import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import type { ChainAccessConfig } from '@polysensus-dapper/chainpresence';
import { ChainAccessConfigFromEnv } from '@polysensus-dapper/chainpresence';
import { chains_garnet_default } from '@polysensus-dapper/chainpresence';

const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_CHAIN_GARNET_';

export const GET: RequestHandler = () => {
	// Initialise to the public config first
	let cfg: ChainAccessConfig = ChainAccessConfigFromEnv(
		API_CONFIG_PREFIX,
		chains_garnet_default,
		env
	);

	// Allow the public to be overriden by any private env
	cfg = ChainAccessConfigFromEnv(API_CONFIG_PREFIX, cfg, secrets);
	return json(cfg);
};
