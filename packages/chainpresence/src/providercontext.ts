import { ethers } from 'ethers';
import { ProviderContextConfig } from './types';
import { ProviderSwitchOptions } from './types';
import { EIP1193ProviderContext } from './eip1193providercontext';
import { Web3AuthOptions } from './types';
import { IProviderContext } from './types';
import { SwitchNotification } from './types';
import { NetworkConfig } from './types';
import { ProviderType } from './providertypes';
import { getLogger } from './log';

const log = getLogger('chainpresence');

export abstract class ProviderContext extends EIP1193ProviderContext {
  constructor(
    cfg: ProviderContextConfig = {},
    notification?: (
      name: string,
      notice: SwitchNotification,
      ctx: IProviderContext,
    ) => Promise<void>,
  ) {
    super(cfg, notification);
  }

  /**
   *
   * @param eip1193Provider
   * @param addressOrIndex
   * @returns
   */
  async setProvider(
    eip1193Provider: any,
    addressOrIndex?: string | number | undefined,
  ) {
    return await super.setProvider(
      eip1193Provider,
      addressOrIndex,
      this.cfg.chainId,
    );
  }

  async prepareProvider() {
    // Check it using the static provider
    let provider;
    if (!this.cfg.static) {
      log.info(`<<<Preparing polling provider>>>> ${this.cfg.url}`);
      provider = new ethers.providers.JsonRpcProvider({
        url: this.cfg.url ?? '',
        ...this.cfg.info,
      });
    } else {
      log.info(`<<<Preparing static provider>>>>  ${this.cfg.url}`);
      provider = new ethers.providers.StaticJsonRpcProvider({
        url: this.cfg.url ?? '',
        ...this.cfg.info,
      });
    }
    await this.setProvider(provider);
    this.stopListening();
  }
}

export class ProviderSwitch {
  available: { [key: string]: ProviderContext } = {};
  protected current: string | undefined;
  protected opts: ProviderSwitchOptions;

  notification?: (
    name: string,
    notice: SwitchNotification,
    ctx?: IProviderContext,
  ) => Promise<void>;

  constructor(opts: ProviderSwitchOptions = {}) {
    this.opts = opts;
    this.notification = opts.notification;
  }

  logout(): void {}
  async login(_ /*force*/ : boolean | undefined): Promise<void> {}

  getCurrent(): ProviderContext | undefined {
    return this.available?.[this.current!];
  }

  /** get the context. throw an error if it is not available. intended for derived implementations of select */
  requireContext(name: string): IProviderContext {
    const ctx = this.available[name];
    if (!ctx) {
      throw new Error(`provider ${name} is not currently available`);
    }
    return ctx;
  }

  /** impotently stopListening on the current context. intended for derived implementations of select */
  stopCurrent(): void {
    const currentCtx = this.getCurrent();
    if (currentCtx) {
      currentCtx.stopListening();
      this.current = undefined;
    }
  }

  async select(name: string): Promise<IProviderContext> {
    const newCtx = this.requireContext(name);
    this.stopCurrent();

    await newCtx.resume();
    this.current = name;
    return newCtx;
  }

  async stopAll(): Promise<void> {
    for (const [name, ctx] of Object.entries(this.available)) {
      ctx.reset();
      if (this.notification)
        await this.notification(name, SwitchNotification.STOPPED, ctx);
    }
    this.available = {};
    this.current = undefined;
  }

  async prepare(
    cfgs: ProviderContextConfig[],
    contextfactory: (cfg: ProviderContextConfig) => ProviderContext,
    opts: { fetch?: boolean; web3authOptions: Web3AuthOptions },
  ): Promise<void> {
    this.available = await this.beginPrepare(cfgs, contextfactory, opts);
    // issue the prepared callbacks after _all_ have had a chance to finish. may
    // revisit this, depending on how responsive it is. it may be better ux to
    // just kick these immediately, but it makes the connection & start up logs
    // confusing.
    for (const [name, each] of Object.entries(this.available)) {
      try {
        if (this.notification)
          await this.notification(name, SwitchNotification.PREPARED, each);
      } catch (err) {
        log.info(`error issuing prepared notification for ${name}: ${err}`);
      }
    }
  }

  async addNetwork(_ /*cfg*/ : NetworkConfig): Promise<void> {}

  async beginPrepare(
    cfgs: ProviderContextConfig[],
    contextfactory: (cfg: ProviderContextConfig) => ProviderContext,
    opts?: { fetch?: boolean },
  ): Promise<{ [key: string]: ProviderContext }> {
    await this.stopAll();

    const fetch = opts?.fetch;

    const prepared: { [key: string]: ProviderContext } = {};
    const preparing: Promise<ProviderContext>[] = [];

    // Take the injected providers as is. Accumulate an array of promises for the rest
    for (let each of Object.values(cfgs)) {
      if (each.fetch && !fetch) {
        log.info(
          `fetch config '${each.id}' skipped - fetching provider configs is not enabled`,
        );
        continue;
      }
      const ctx = contextfactory(each);
      if (each.type === ProviderType.Injected) {
        // The injected ones don't get pre-checked, as that forces interaction
        prepared[each.id ?? each.name ?? ''] = ctx;
        continue;
      }
      preparing.push(
        new Promise<ProviderContext>((resolve, _ /*reject*/) => {
          ctx.prepareProvider().then(() => resolve(ctx));

          // await switcher.addNetwork(this.cfg);
        }),
      );
    }

    // If we don't have any non injected providers we are done
    if (preparing.length === 0) {
      return prepared;
    }

    // Resolve the promises for rpc providers
    return Promise.all(
      preparing.map((p) =>
        p.catch((e) => log.info(`unexpected error checking provider: ${e}`)),
      ),
    )
      .then((values) => {
        for (const ctx of values) {
          if (ctx === undefined) continue;
          const id = ctx?.getConfig().id;
          const url = ctx?.getConfig().url;
          log.debug(`adding provider ${id} ${url}`);
          if (!id) continue;
          prepared[id] = ctx;
          ctx.stopListening();
        }
        return prepared;
      })
      .catch((e) => {
        log.info(`unexpected error checking providers: ${e}`);
        return prepared;
      });
  }
}
