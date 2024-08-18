import type { EnvConfigLike } from '$lib/fromenv.js';
import { fromPrefixedEnv } from '$lib/fromenv.js';
// import merge from 'lodash.merge';

/**
 * Identifies a known chain configuration and
 * provides application specific access configuration
 */
export type ChainAccessConfig = {
	name: string;
	networkName: string;
	chainId: number;
	displayName?: string;
	description?: string;
	infoUrl?: string;
	ticker?: string;
	decimals?: number;
	rpcUrl: string;
	wsRpcUrl?: string;
	explorerUrl?: string;
	bridgeUrl?: string;
};

export function ChainAccessConfigFromEnv(
	prefix: string,
	defaults: EnvConfigLike,
	env: EnvConfigLike
): ChainAccessConfig {
	const cfg: ChainAccessConfig = {
		name: '',
		networkName: '',
		chainId: 0,
		rpcUrl: '',
		...defaults,
		...fromPrefixedEnv(prefix, env)
	};
	return cfg;
}
