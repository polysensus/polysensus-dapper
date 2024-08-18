import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import type { ChainAccessConfig } from '@polysensus-dapper/chainpresence';

export const GET: RequestHandler = () => {
	const cfg: ChainAccessConfig & {
		description: string;
		polling: number;
	} = {
		id: Number(env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_CHAINID']),
		name: 'redstone',
		description: 'Redstone',
		rpcUrl: env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_RPC_URL'],
		explorerUrl: env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_EXPLORER_URL'],
		bridgeUrl: env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_BRIDGE_URL'],
		polling: env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_POLLING'] ?? 2000,
		ticker: env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_TICKER'] ?? 'ETH'
	};
	const decimals = Number(env['PUBLIC_API_CONFIG_CHAIN_OP_SEPOLIA_DECIMALS']);
	if (!isNaN(decimals)) cfg.decimals = decimals;

	// if there is a url in secrets use that, as it will have the api key embeded
	if (secrets['API_CONFIG_CHAIN_OP_SEPOLIA_RPC_URL'])
		cfg.rpcUrl = secrets['API_CONFIG_CHAIN_OP_SEPOLIA_RPC_URL'];

	return json(cfg);
};
