import { ProviderType } from './providertypes';

import { writable, get, type Writable } from 'svelte/store';

import { Web3AuthModalProviderSwitch } from './web3authmodalproviderswitch';

import { FetchProviderContext } from './fetchprovidercontext';
import { Web3AuthModalProviderContext } from './web3authprovidercontext';

import {
  ChainPresenceConfig,
  IProviderContext,
  ProviderContextConfig,
  SwitchNotification,
} from './types';

export class ChainPresence {
  static async create(cfg: ChainPresenceConfig): Promise<ChainPresence> {
    const presence = new ChainPresence(cfg);
    await presence.refreshProviders();
    return presence;
  }

  private cfg: ChainPresenceConfig;
  providerCtx?: any;
  private authenticated: Writable<boolean>;
  private providerName: Writable<string | undefined>;
  private providerSwitch: Web3AuthModalProviderSwitch;

  constructor(cfg: ChainPresenceConfig) {
    this.cfg = cfg;
    this.cfg.excludeNetworkTypes = [
      ProviderType.APIProxyRPC,
      ProviderType.NamedRPC,
      ProviderType.EthersRPC,
    ];

    this.providerCtx = undefined;
    this.authenticated = writable(false);
    this.providerName = writable(undefined);

    this.providerSwitch = new Web3AuthModalProviderSwitch({
      notification: this.handleNotices.bind(this.handleNotices),
    });
  }

  logout(): void {
    if (!get(this.authenticated)) return;
    this.providerSwitch.logout();
  }

  async handleNotices(
    _ /*name*/ : string,
    notice: SwitchNotification,
    _1? /*ctx*/ : IProviderContext,
  ): Promise<void> {
    switch (notice) {
      default:
        console.log(`notice: ${SwitchNotification[notice]}`);
    }
  }

  /**
   *
   * @param providerName
   * @returns
   */
  async selectProvider(providerName?: string): Promise<void> {
    if (!providerName) {
      console.info(`clearing provider selection`);
      this.providerCtx = undefined;
      return;
    }

    if (providerName === get(this.providerName)) {
      return;
    }

    try {
      this.providerCtx = await this.providerSwitch.select(providerName);
    } catch (err) {
      console.info(`failed to select provider ${providerName}: ${err}`);
    }
  }

  async refreshProviders(): Promise<any[]> {
    let web3authOptions;

    try {
      const resp = await fetch(`/api/web3auth/`);
      web3authOptions = await resp.json();
      if (web3authOptions?.error) {
        const error = JSON.stringify(web3authOptions.error);
        console.info(`error fetching web3auth options ${error}`);
        throw new Error(error);
      }
      console.log(
        `ChainPresence#refreshProviders api/web3auth: ${JSON.stringify(web3authOptions)}`,
      );
    } catch (err) {
      console.error('Failed to fetch web3auth options:', err);
      throw err;
    }

    const networks: Record<string, ProviderContextConfig> = {};
    for (const cfg of Object.values(this.cfg.networks)) {
      cfg.id = cfg.id ?? cfg.name;

      if (this.cfg.excludeNetworkTypes?.includes(cfg.type)) continue;

      networks[cfg.id] = cfg;

      if (cfg.name !== 'local' || (this.cfg.hardhatWalletCount ?? 0) < 1)
        continue;

      console.log(
        `adding ${this.cfg.hardhatWalletCount ?? -1} hardhat wallets`,
      );
      let first = this.cfg.hardhatWalletFirst ?? 1;

      for (let i = 0; i < (this.cfg.hardhatWalletCount ?? -1); i++) {
        const hhCfg = { ...cfg };
        hhCfg.id = `${cfg.name}/${first + i}`;
        hhCfg.addressOrIndex = first + i;
        networks[hhCfg.id] = hhCfg;
      }
    }

    await this.providerSwitch.prepare(
      Object.values(networks),
      (cfg: any) => {
        console.log(`preparing: ${cfg.name} ${cfg.id}`);
        if (cfg.type.startsWith('web3auth')) {
          return new Web3AuthModalProviderContext(cfg);
        }
        return new FetchProviderContext(cfg);
      },
      { fetch: true, web3authOptions },
    );

    return Object.values(this.providerSwitch.available).map(
      (ctx: any) => ctx.cfg,
    );
  }
}
