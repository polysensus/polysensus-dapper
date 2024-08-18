import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import type { ChainAccessConfig } from '@polysensus-dapper/chainpresence';
import { ChainAccessConfigFromEnv } from '@polysensus-dapper/chainpresence';
import { chains_ethereum_default } from '@polysensus-dapper/chainpresence';

const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_CHAIN_ETHEREUM_';

export const GET: RequestHandler = () => {
	// Initialize to the public config first
	let cfg: ChainAccessConfig = ChainAccessConfigFromEnv(
		API_CONFIG_PREFIX,
		chains_ethereum_default,
		env
	);

	// Allow the public to be overridden by any private env
	cfg = ChainAccessConfigFromEnv(API_CONFIG_PREFIX, cfg, secrets);
	// console.log(`#api/config/chain/etherum: ${cfg}`);
	return json(cfg);
};
