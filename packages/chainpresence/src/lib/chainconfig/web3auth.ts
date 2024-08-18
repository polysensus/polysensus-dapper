import type { EnvConfigLike } from '$lib/fromenv.js';
import { fromPrefixedEnv } from '$lib/fromenv.js';

// export type Web3AuthOptions = Web3AuthOptions &
export type Web3AuthOptions = {
	clientId: string;
	enableMetamask?: boolean;

	/**
	 * setting to "local" will persist social login session accross browser tabs.
	 *
	 * @defaultValue "local"
	 */
	storageKey?: 'session' | 'local';

	/**
	 * sessionTime (in seconds) for idToken issued by Web3Auth for server side verification.
	 * @defaultValue 86400
	 *
	 * Note: max value can be 7 days (86400 * 7) and min can be  1 day (86400)
	 */
	sessionTime?: number;
	web3AuthNetwork?: string;
};

export type Web3AuthInfraConfig = {
	id: string;
	options: Web3AuthOptions;
};

export function Web3AuthInfraConfigFromEnv(
	prefix: string,
	defaults: EnvConfigLike,
	env: EnvConfigLike
): Web3AuthInfraConfig {
	const cfg: EnvConfigLike = {
		...defaults,
		...fromPrefixedEnv(prefix, env)
	};

	if (!cfg.web3authNetwork) throw new Error(`${prefix}WEB3AUTH_NETWORK must beset`);

	const options: Web3AuthOptions = {
		clientId: cfg.clientId,
		web3AuthNetwork: cfg.web3authNetwork
		// enableMetamask: cfg.enableMetamask?.toLocaleLowerCase() === 'true' || cfg.enableMetamask === '1',
	};
	if (cfg.sessionTime) options.sessionTime = parseInt(cfg.sessionTime);
	return { id: 'web3auth', options };
}
