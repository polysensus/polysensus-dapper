/**
 * Abstract implementation of a ProviderSwitch for Web3Auth
 * Expected use is to inherit and implement newWeb3Auth with just  "return new Web3Auth(cfg)"
 */

// --- lib deps
import { ethers } from 'ethers';
import * as pkg from '@web3auth/ethereum-provider';
const { EthereumPrivateKeyProvider } = pkg;

// @ts-ignore
import { ProviderContext, ProviderSwitch } from './providercontext';

import { ChainConfig, SwitchNotification } from './types';
import { ProviderContextConfig } from './types';

import { NetworkConfig } from './types';
import { Web3AuthOptions } from './types';
import { IProviderContext } from './types';
import { ProviderSwitchOptions } from './types';

import { Web3Auth } from '@web3auth/modal';
import {
  ADAPTER_STATUS,
  CustomChainConfig,
  ChainNamespaceType,
} from '@web3auth/base';
import * as web3auth_openlogin_adapter from '@web3auth/openlogin-adapter';
const { OpenloginAdapter } = web3auth_openlogin_adapter;
import * as web3auth_methmask_adapter from '@web3auth/metamask-adapter';
const { MetamaskAdapter } = web3auth_methmask_adapter;

// import { getLogger } from './log';
// const log = getLogger('web3authproviderswitch');

export interface Web3AuthModalProviderContextLike {
  resume(providerSwitch: Web3AuthModalProviderSwitch): Promise<void>;
  setProvider(provider: ethers.providers.Web3Provider): Promise<void>;
}

export class Web3AuthModalProviderSwitch extends ProviderSwitch {
  protected web3AuthAdapterSettings?: any;
  protected web3authOptions?: Web3AuthOptions;
  private _promisedWeb3Auth?: Promise<void>;
  protected web3auth?: any;
  protected web3authChains: Record<string, ChainConfig> = {};
  protected modalOpen = false;
  protected loggedIn = false;
  protected web3AuthProvider?: any;
  protected authenticationState?: string;

  constructor(cfg: ProviderSwitchOptions = {}) {
    super(cfg);
  }

  async authenticated(state: boolean) {
    this.loggedIn = state;
    console.info(
      `Web3ModalProviderSwitch#authenticated ${this.authenticationState}`,
    );
    if (!this.notification) return;
    try {
      return this.notification(
        this.current ?? '<unown>',
        SwitchNotification.AUTHENTICATED,
        undefined,
      );
    } catch (err) {
      console.info(`ERROR: Web3ModalProviderSwitch#authenticated ${err}`);
    }
  }

  /** Avoid forcing the dependency choice in this package, and also make this completely mockable */
  newWeb3Auth(cfg: any) {
    return new Web3Auth(cfg);
  }

  async select(name: string): Promise<IProviderContext> {
    const newCtx = this.requireContext(name);
    this.stopCurrent();

    const chainConfig = this.web3authChains[name];
    let chainId = chainConfig?.chainId;
    if (!chainId) {
      console.info(
        `Web3ModalProviderSwitch#select: selecting non web3auth provider config ${name}`,
      );
      await newCtx.resume();
      this.current = name;
      return newCtx;
    }
    if (typeof chainId === 'number') chainId = ethers.utils.hexlify(chainId);

    console.info(
      `Web3ModalProviderSwitch#select: selecting ${name} ${chainId}`,
    );
    if (!this.isLoggedIn()) {
      await this.login();
    }

    // addChain is deferred until this point because it requires a logged in
    // modal. And we don't want to trigger login on page load (when the
    // providers are initially discovered).
    if (chainConfig.addPending) {
      delete chainConfig.addPending;
      try {
        await this.web3auth.addChain(chainConfig);
      } catch (err) {
        chainConfig.addPending = true;
        console.info(`ERROR:Web3ModalProviderSwitch#select: addChain ${err}`);
        throw err;
      }
    }

    await this.web3auth.switchChain({ chainId });
    const provider = new ethers.providers.Web3Provider(this.web3auth.provider);
    await newCtx.setProvider(provider);
    const address = await provider.getSigner()?.getAddress();
    this.current = name;
    console.info(
      `Web3ModalProviderSwitch#select: provider signerAddress ${address} ${this.current} ${this.getCurrent()}`,
    );
    return newCtx;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  async login(force = false): Promise<void> {
    if (this.modalOpen) {
      console.info(`Web3ModalProviderSwitch#login modal is already open`);
      return;
    }
    if (!this.web3auth) {
      console.info(`Web3ModalProviderSwitch#login modal instance is undefined`);
      return;
    }
    if (this.loggedIn && !force) {
      console.info(`Web3ModalProviderSwitch#login already logged in`);
      return;
    }
    try {
      this.modalOpen = true;
      console.log('*** calling connect ***');
      await this.web3auth.connect();
      this.loggedIn = true;
      this.authenticated(this.loggedIn);
    } catch (err) {
      console.info(
        `ERROR: Web3ModalProviderSwitch#login - calling connect: ${JSON.stringify(err)}, ${err}`,
      );
    } finally {
      this.modalOpen = false;
    }
  }

  logout(): void {
    if (!this.web3auth) {
      console.info(`no web3auth modal instance to do logout with`);
      return;
    }
    this.web3auth.logout();
    this.loggedIn = false;
    this.authenticated(this.loggedIn);
    console.info(`Web3AuthModalProviderContext#logout ok`);
  }

  async refreshLoginStatus(): Promise<string | undefined> {
    const apply = (state: boolean, msg?: string): boolean => {
      if (this.loggedIn === state) return state;
      this.loggedIn = state;
      this.authenticated(this.loggedIn);
      if (msg) console.log(msg);
      return state;
    };
    if (!this.web3auth?.connectedAdapterName) {
      apply(false, 'no adapter name');
      return undefined;
    }
    if (this.web3auth.status !== ADAPTER_STATUS.CONNECTED) {
      apply(false, `wrong status: ${this.web3auth.status}`);
      return undefined;
    }
    if (!this.web3auth.provider) {
      apply(false, 'no provider');
      return undefined;
    }
    if (!apply(true, 'refreshed connected')) return undefined;

    let connectedName: string | undefined;

    for (const [name, chainConfig] of Object.entries(this.web3authChains)) {
      if (chainConfig.chainId !== this.web3auth.coreOptions.chainConfig.chainId)
        continue;

      console.log(`Web3AuthModalProviderSwitch# auto selecting ${name}`);
      connectedName = name;
      break;
    }

    return connectedName;
  }

  /**
   * newOpenloginAdapter instantiates a web3auth/openlogin-adapter instance
   * with the provided adapterSettings
   * @param {object} cfg
   * @param {object} adapterSettings
   */
  newOpenLoginAdapter(_ /*cfg*/ : any, adapterSettings: any) {
    // cfg is ignored, we assume that it contains clientId and network
    return new OpenloginAdapter(adapterSettings);
  }

  newMetamaskAdapter(_ /*cfg*/ : any, adapterSettings: any) {
    return new MetamaskAdapter(adapterSettings);
  }

  /**
   * Ensures there is only one call to initModal, whilst allowing most of the provider configuration to happen in parallel
   */
  async initSingletonWeb3Auth(chainConfig: ChainConfig): Promise<boolean> {
    if (this.web3auth) return false;

    let creator = false;
    if (!this._promisedWeb3Auth) {
      creator = true;
      // This is async, but we will have multiple waiters
      this._promisedWeb3Auth = this._initWeb3Auth(chainConfig);
    }

    try {
      await this._promisedWeb3Auth;
      // <-- re-entrancy can happen after this point
    } catch (err) {
      console.debug(
        `ERROR: Web3ModalProviderSwitch#initSingletonWeb3Auth: await this._promisedWeb3Auth ${err}`,
      );
    }
    if (creator) {
      delete this._promisedWeb3Auth;
    }
    // guarantee all callers that the instance is available on return
    if (!this.web3auth)
      throw new Error(
        `ERROR: Web3ModalProviderSwitch#initSingletonWeb3Auth promised web3auth instance missing`,
      );

    return creator;
  }

  /**
   * DO NOT call directly, see initSingletonWeb3Auth
   * @param {*} chainConfig
   * @returns
   */
  private async _initWeb3Auth(chainConfig: ChainConfig): Promise<void> {
    if (this.web3auth) return;

    console.info(
      `Web3ModalProviderSwitch#_initWeb3Auth: creating Web3Auth and calling initModal for ${chainConfig.chainId}`,
    );

    // allow for functions returning promises.
    if (this.web3authOptions instanceof Promise) {
      this.web3authOptions = await this.web3authOptions;
    }

    if (
      !this.web3authOptions?.clientId ||
      !this.web3authOptions?.web3AuthNetwork
    ) {
      throw new Error(
        `clientId and web3AuthNetwork must be present on the web3auth options`,
      );
    }

    console.info(
      `Web3ModalProviderSwitch#_initWeb3Auth: web3authOptions: ${JSON.stringify(this.web3authOptions)}`,
    );

    if (this.web3authOptions.adapterSettings) {
      this.web3AuthAdapterSettings = this.web3authOptions.adapterSettings;
      delete this.web3authOptions.adapterSettings;
    }

    let privateKeyProvider;
    try {
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: CALL new EthereumPrivateKeyProvider`,
      );
      const compatConfig: any = { ...chainConfig };
      delete compatConfig.chainNamespace;

      const web3authChainConfig: CustomChainConfig = {
        chainNamespace: chainConfig.chainNamespace as ChainNamespaceType,
        ...compatConfig,
      };
      privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig: web3authChainConfig },
      });
    } catch (err) {
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: new EthereumPrivateKeyProvider ERROR: ${err}`,
      );
      throw err;
    }
    console.info(
      `Web3ModalProviderSwitch#_initWeb3Auth: new EthereumPrivateKeyProvider OK`,
    );

    let web3auth;
    try {
      console.info(`Web3ModalProviderSwitch#_initWeb3Auth: CALL newWeb3Auth`);
      web3auth = this.newWeb3Auth({
        ...this.web3authOptions,
        privateKeyProvider,
      });
    } catch (err) {
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: newWeb3Auth ERROR: ${err}`,
      );
      throw err;
    }
    console.info(
      `Web3ModalProviderSwitch#_initWeb3Auth: newWeb3Auth ok: ${web3auth}`,
    );
    if (this.web3AuthAdapterSettings?.openlogin !== undefined) {
      const adapterSettings = this.web3AuthAdapterSettings.openlogin;
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: configuring adapter: ${JSON.stringify(adapterSettings)}`,
      );
      const adapter = this.newOpenLoginAdapter(
        { ...this.web3authOptions, chainConfig },
        adapterSettings,
      );
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: newOpenLoginAdapter ok`,
      );
      web3auth.configureAdapter(adapter);
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: configureAdapter ok`,
      );
    } else {
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: no adapter specializations provided`,
      );
    }

    if (this.web3AuthAdapterSettings?.enableMetamask) {
      const adapterSettings = this.web3AuthAdapterSettings.metamask;
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: configuring metamask adapter: ${JSON.stringify(adapterSettings)}`,
      );
      const adapter = this.newMetamaskAdapter(
        { ...this.web3authOptions, chainConfig },
        adapterSettings,
      );
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: newMetamaskAdapter ok`,
      );
      web3auth.configureAdapter(adapter);
      console.info(
        `Web3ModalProviderSwitch#_initWeb3Auth: configureAdapter ok`,
      );
    }
    await web3auth.initModal();
    console.info(`Web3ModalProviderSwitch#_initWeb3Auth: initModal ok`);
    this.web3auth = web3auth;
  }

  /** Impotently add a network configuration. If the configuration provides a
   * web3auth chainConfig with at least chainSpace set, the network is added to
   * the Web3Modal instance. The first such configuration triggers instantiation
   * and initModal for Web3Auth. */
  async addNetwork(cfg: NetworkConfig): Promise<void> {
    if (!cfg.chainConfig?.chainNamespace) {
      console.debug(
        `Web3ModalProviderSwitch#addNetwork: ${cfg.name} is not configured for web3auth (no chainSpace set)`,
      );
      return;
    }

    console.info(
      `Web3ModalProviderSwitch#addNetwork: considering config ${cfg.name}`,
    );
    if (this.web3authChains[cfg.name]) {
      console.info(
        `Web3ModalProviderSwitch#addNetwork: ${cfg.name} already known`,
      );
      return;
    }

    cfg.chainConfig.chainId = ethers.utils.hexlify(cfg.chainConfig.chainId);

    const chainConfig: ChainConfig = {
      displayName: cfg.description,
      rpcTarget: cfg.url,
      ticker: cfg.currency,
      tickerName: cfg.currency,
      ...cfg.chainConfig, // allow it to override the defaults from the primary config.
    };
    console.info('----------');
    console.info('web3auth chainConfig');
    console.info(JSON.stringify(chainConfig, null, '  '));
    console.info('----------');

    const creator = await this.initSingletonWeb3Auth(chainConfig);
    if (creator) {
      // IF this call created then the chainConfig does not need to be added, it was provided to the constructor.
      console.info(
        `Web3ModalProviderSwitch#addNetwork: initModal complete for ${cfg.name}`,
      );
      this.web3authChains[cfg.name] = chainConfig;
      console.debug(
        `Web3ModalProviderSwitch#addNetwork: initial network for web3auth ${cfg.name}`,
      );
      return;
    }

    console.info(
      `Web3ModalProviderSwitch#addNetwork: adding chain ${cfg.name} ${chainConfig.chainId} to web3auth for ${cfg.name}`,
    );
    // await this.web3auth.addChain(chainConfig);
    chainConfig.addPending = true;
    this.web3authChains[cfg.name] = chainConfig;
    console.debug(
      `Web3ModalProviderSwitch#addNetwork: added network to web3auth for ${cfg.name}`,
    );
  }

  /**
   * Note that opts must include a callback which delivers a valid web3auth config
   * See: Web3AuthOptions here https://web3auth.io/docs/sdk/web/modal/initialize
   *      Only a chainId and chainNamespace are required. The other options are provider/chain specific.
   * @param {*} cfgs
   * @param {*} contextFactory
   * @param {*} opts
   * @returns
   */
  async prepare(
    cfgs: ProviderContextConfig[],
    contextfactory: (cfg: ProviderContextConfig) => ProviderContext,
    opts: { fetch?: boolean; web3authOptions: Web3AuthOptions },
  ): Promise<void> {
    this.web3authOptions = opts.web3authOptions;
    return super.prepare(cfgs, contextfactory, opts);
  }
}
