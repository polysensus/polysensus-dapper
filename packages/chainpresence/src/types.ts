import { ethers } from 'ethers';
import { ProviderType } from './providertypes';

export interface Web3AuthOptions {
  clientId?: string;
  web3AuthNetwork?: string;
  adapterSettings?: any;
}

export interface ChainPresenceConfig {
  networks: Record<string, any>;
  excludeNetworkTypes?: ProviderType[];
  hardhatWalletCount?: number;
  hardhatWalletFirst?: number;
  [key: string]: any;
}

export interface IProviderContext {
  prepareProvider(): Promise<void>;
  setProvider(
    provider: ethers.providers.Web3Provider,
    addressOrIndex?: string | number | undefined,
  ): Promise<void>;
  resume(): Promise<void>;
  getConfig(): ProviderContextConfig;
}

export enum SwitchNotification {
  Undefined,
  CHAIN_CHANGED,
  ACCOUNTS_CHANGED,
  DISCONNECTED,
  PREPARED,
  STOPPED,
  AUTHENTICATED,
  LOGGED_OUT,
  NETWORK_ADDED,
}

export interface ChainConfig {
  chainId: string;
  chainNamespace: string;
  displayName?: string;
  rpcTarget?: string;
  ticker?: string;
  tickerName?: string;
  addPending?: boolean;
}

export interface NetworkConfig {
  name: string;
  description?: string;
  url?: string;
  currency?: string;
  chainConfig?: ChainConfig;
  adapterSettings?: any;
}

export interface EthersProviderLike {}

export interface PreparedProvider {
  provider: any;
  request: (...args: any[]) => Promise<any>;
  accounts: string[] | undefined;
  addressOrIndex: string | number | undefined;
  chainId: number | undefined;
  evmProviderType: string | undefined;
  signer: ethers.Signer | null | undefined;
  signerAddress: string | undefined;
}

export interface ProviderSwitchOptions {
  notification?: (
    name: string,
    notice: SwitchNotification,
    ctx?: IProviderContext,
  ) => Promise<void>;
}

export interface ProviderContextConfig {
  name?: string | undefined;
  type?: string | undefined;
  id?: string;
  fetch?: any;
  static?: boolean | undefined;
  url?: string | undefined;
  info?: object | undefined;
  chainId?: number | undefined;
  apiPath?: string | undefined;
  addressOrIndex?: string | number | undefined;
}

export interface SetProviderConfig {
  chainId?: number | undefined;
  accountsChanged: (accounts: string[]) => Promise<void>;
  chainChanged: (chainId: string) => Promise<void>;
  disconnected: (err: Error) => Promise<void>;
}

export interface Prepare1193ProviderConfig {
  accountsChanged: (accounts: string[]) => Promise<void>;
  chainChanged: (chainId: string) => Promise<void>;
  disconnected: (err: Error) => Promise<void>;
}

export interface EIP1193ProviderContextInterface {
  provider?: ethers.providers.Web3Provider;
  request?: (...args: any[]) => Promise<any>;
  eip1193Provider?: ethers.providers.ExternalProvider;
  chainId?: number | undefined;
  evmProviderType?: string | undefined;
  signer?: ethers.Signer | undefined | null;
  signerAddress?: string | undefined;
  accounts?: string[] | undefined;
  addressOrIndex?: string | number | undefined;

  accountsChanged: (accounts: string[]) => Promise<void>;
  chainChanged: (chainId: string) => Promise<void>;
  disconnected: (err: Error) => Promise<void>;

  setProvider(
    eip1193Provider: ethers.providers.ExternalProvider,
    addressOrIndex?: string | number,
    chainId?: number,
  ): Promise<void>;

  stopListening(): void;
  resume(): Promise<void>;
  reset(): void;
}
