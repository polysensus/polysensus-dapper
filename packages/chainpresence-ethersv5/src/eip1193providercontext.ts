import { ethers } from 'ethers';
import { setProvider } from './setprovider';

import { alwaysNumber } from './idioms';

import {
  EIP1193ProviderContextInterface,
  IProviderContext,
  SwitchNotification,
} from './types';
import { ProviderContextConfig } from './types';

import { getSignerAddress } from './getsigneraddress';

import { getLogger } from './log';

const log = getLogger('chainpresence');

export class EIP1193ProviderContext implements EIP1193ProviderContextInterface {
  protected cfg: ProviderContextConfig;
  provider?: ethers.providers.Web3Provider;
  request?: (...args: any[]) => Promise<any>;
  eip1193Provider?: any;
  chainId?: number;
  evmProviderType?: string;
  signer?: ethers.Signer | undefined | null;
  signerAddress?: string;
  accounts?: string[];
  addressOrIndex?: string | number | undefined;
  notification?: (
    name: string,
    notice: SwitchNotification,
    ctx: IProviderContext,
  ) => Promise<void>;

  async prepareProvider(): Promise<void> {}
  getConfig(): ProviderContextConfig {
    return this.cfg;
  }

  constructor(
    cfg: ProviderContextConfig,
    notification?: (
      name: string,
      notice: SwitchNotification,
      ctx: IProviderContext,
    ) => Promise<void>,
  ) {
    this.cfg = cfg;
    this.notification = notification;
    this._init();
  }

  async accountsChanged(accounts: string[]): Promise<void> {
    this.accounts = accounts;

    if (this.provider) {
      const { signer, signerAddress } = await getSignerAddress(
        this.provider,
        this.addressOrIndex,
      );
      this.signer = signer;
      this.signerAddress = signerAddress;
    }

    if (!this.notification) return;
    return await this.notification(
      this.cfg.name ?? '<unknown>',
      SwitchNotification.ACCOUNTS_CHANGED,
      this,
    );
  }

  async chainChanged(chainId: string): Promise<void> {
    this.chainId = alwaysNumber(chainId);
    if (this.provider) {
      const { signer, signerAddress } = await getSignerAddress(
        this.provider,
        this.addressOrIndex,
      );
      this.signer = signer;
      this.signerAddress = signerAddress;
    }

    if (!this.notification) return;
    return await this.notification(
      this.cfg.name ?? '<unknown>',
      SwitchNotification.CHAIN_CHANGED,
      this,
    );
  }

  async disconnected(err: Error): Promise<void> {
    if (err) log.info('provider disconnected', err);
    this.stopListening(); // pause rather than reset so that a trivial reconnect is possible

    if (!this.notification) return;
    return await this.notification(
      this.cfg.name ?? '<unknown>',
      SwitchNotification.DISCONNECTED,
      this,
    );
  }

  async setProvider(
    eip1193Provider: any,
    addressOrIndex: string | number | undefined,
    chainId: number | undefined = undefined,
  ): Promise<void> {
    this.stopListening();

    if (typeof addressOrIndex === 'undefined')
      addressOrIndex = this.addressOrIndex;

    const prepared = await setProvider(eip1193Provider, addressOrIndex, {
      chainId,
      accountsChanged: this.accountsChanged.bind(this),
      chainChanged: this.chainChanged.bind(this),
      disconnected: this.disconnected.bind(this),
    });

    this.provider = prepared.provider;
    this.request = prepared.request;
    this.eip1193Provider = eip1193Provider;
    this.chainId = prepared.chainId;
    this.evmProviderType = prepared.evmProviderType;
    this.signer = prepared.signer;
    this.signerAddress = prepared.signerAddress;
    this.accounts = prepared.accounts;
    this.addressOrIndex = prepared.addressOrIndex;
  }

  stopListening(): void {
    if (this.eip1193Provider?.removeAllListeners) {
      this.eip1193Provider.removeAllListeners();
    }
  }

  async resume(): Promise<void> {
    return this.setProvider(this.eip1193Provider, this.addressOrIndex);
  }

  private _init(): void {
    this.eip1193Provider = undefined;
    this.addressOrIndex = this.cfg.addressOrIndex;

    this.provider = undefined;
    this.request = undefined;
    this.eip1193Provider = undefined;
    this.chainId = undefined;
    this.evmProviderType = undefined;
    this.signer = undefined;
    this.signerAddress = undefined;
    this.accounts = undefined;
  }

  reset(): void {
    this.stopListening();
    this._init();
  }
}
