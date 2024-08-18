import type { CustomChainConfig } from '@web3auth/base';
import type { BaseAdapterSettings } from '@web3auth/base';
import type { IWeb3AuthCoreOptions } from '@web3auth/base';

// import type { Web3AuthOptions } from '@web3auth/modal';
import type { ChainInfraConfig } from './infraconfig.js';
// import { BaseRedirectParams, LoginParams, OpenLoginOptions } from '@toruslabs/openlogin-utils';
import type { OpenLoginOptions } from '@toruslabs/openlogin-utils';

export type Web3AuthnChainConfig = CustomChainConfig & {};
export type Web3AuthnSettings = BaseAdapterSettings & {};
// export type Web3AuthnOptions = Web3AuthOptions &
export type Web3AuthnOptions = IWeb3AuthCoreOptions &
	ChainInfraConfig & {
		adapterSettings: OpenLoginOptions;
		enableMetamask: boolean;
	};
