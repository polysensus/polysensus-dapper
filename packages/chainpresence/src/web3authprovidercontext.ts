import { ethers } from 'ethers';

import { ProviderContext } from './providercontext';
import { ProviderContextConfig } from './types';

import { apiPath } from './api';

export class Web3AuthModalProviderContext extends ProviderContext {
  protected modalOpen: boolean;
  protected web3auth: any;
  protected web3AuthProvider: any;
  protected loggedIn: boolean;

  constructor(cfg: ProviderContextConfig = {}) {
    super(cfg);
    this.modalOpen = false;
    this.web3auth = undefined;
    this.web3AuthProvider = undefined;
    this.loggedIn = false;
  }

  /**
   * For Web3 we start with a normal rpc provider. In resume, which is triggered
   * on select, we initiate the web3auth flow.
   * @returns
   */
  async prepareProvider() // switcher: Web3AuthModalProviderSwitchAbstract,
  : Promise<void> {
    // if (!switcher) {
    //   throw new Error(
    //     `the web3auth provider context requires access to the switcher here`,
    //   );
    // }

    if (this.cfg.fetch) {
      const resp = await fetch(`${apiPath}${this.cfg.name}`);
      const remoteCfg = await resp.json();
      if (remoteCfg?.error) {
        const error = JSON.stringify(remoteCfg.error);
        throw new Error(error);
      }
      this.cfg = { ...this.cfg, ...remoteCfg };
    }
    // await switcher.addNetwork(this.cfg);
  }

  async resume(): Promise<void> {
    try {
      this.modalOpen = true;
      await this.web3auth?.connect();
      this.loggedIn = true;
    } catch (err) {
      console.log(`ERROR: this.modal.connect: ${JSON.stringify(err)}, ${err}`);
    } finally {
      this.modalOpen = false;
    }

    const provider = new ethers.providers.Web3Provider(this.web3auth?.provider);
    await this.setProvider(provider);
    const address = await provider.getSigner()?.getAddress();
    console.log(`
signerAddress: ${address},
this.modal signer: ${provider.getSigner().constructor.name},
provider: ${provider.constructor.name}`);
  }
}
