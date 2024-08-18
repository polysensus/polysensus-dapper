import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import { OpenloginAdapterOptionsFromEnv } from '@polysensus-dapper/chainpresence';

import type { WebAuthAdapterConfig } from '@polysensus-dapper/chainpresence';

import { web3auth_adapter_openlogin_default } from '@polysensus-dapper/chainpresence';

const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_WEB3AUTH_ADAPTER_OPENLOGIN_';

export const GET: RequestHandler = () => {
	// Initialise to the public config first
	const opts: WebAuthAdapterConfig = OpenloginAdapterOptionsFromEnv(
		API_CONFIG_PREFIX,
		web3auth_adapter_openlogin_default,
		env
	);

	// Allow the public to be overridden by any private env
	const secretOpts = OpenloginAdapterOptionsFromEnv(
		API_CONFIG_PREFIX,
		web3auth_adapter_openlogin_default,
		{ ...env, ...secrets }
	);

	return json({ ...opts, ...secretOpts });
};
