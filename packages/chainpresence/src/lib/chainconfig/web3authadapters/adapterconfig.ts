import type { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';
import type { MetamaskAdapterOptions } from '@web3auth/metamask-adapter';
import type { BaseAdapterSettings } from '@web3auth/base';
import type { EnvConfigLike } from '$lib/fromenv.js';

export type LoginProvider = {
	loginProvider: string;
	extraLoginOptions: { [key: string]: string };
};

export type Web3AuthAdapterConfig = {
	id: string;
	adapterId: string;
	options: OpenloginAdapterOptions | MetamaskAdapterOptions | BaseAdapterSettings;
	loginProvider: LoginProvider;
};
