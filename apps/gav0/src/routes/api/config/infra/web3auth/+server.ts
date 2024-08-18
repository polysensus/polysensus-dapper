import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import { Web3AuthInfraConfigFromEnv } from '@polysensus-dapper/chainpresence';
import type { Web3AuthInfraConfig } from '@polysensus-dapper/chainpresence';

const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_INFRA_WEB3AUTH_';

export const GET: RequestHandler = () => {
	// Initialise to the public config first
	const opts: Web3AuthInfraConfig = Web3AuthInfraConfigFromEnv(API_CONFIG_PREFIX, {}, env);

	// Allow the public to be overridden by any private env
	const secretOpts = Web3AuthInfraConfigFromEnv(API_CONFIG_PREFIX, {}, { ...env, ...secrets });

	return json({ ...opts, ...secretOpts });
};
