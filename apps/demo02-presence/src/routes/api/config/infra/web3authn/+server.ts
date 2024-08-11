import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';
import type { Web3AuthnOptions } from '@polysensus-dapper/chainpresence';
// import { Web3AuthnSettingsToCommon } from '@polysensus-dapper/chainpresence';

const DEFAULT_CHAIN_CONFIGS = ['redstone', 'op-sepolia'];

export const GET: RequestHandler = () => {
	const nativeOpts: Web3AuthnOptions = {
		dapper: {
			serviceName: 'web3authn',
			chainConfigs: env['PUBLIC_WEB3AUTH_CHAIN_CONFIGS'] ?? DEFAULT_CHAIN_CONFIGS
		},
		clientId: env['PUBLIC_WEB3AUTH_CLIENT_ID'],
		web3AuthNetwork: env['PUBLIC_WEB3AUTH_NETWORK'],
		enableMetamask: true,
		adapterSettings: {
			clientId: env['PUBLIC_WEB3AUTH_CLIENT_ID'],
			// "popup" works on desktop, "redirect" works for iPad, iPhone, and phones in general
			uxMode: 'redirect',
			network: env['PUBLIC_WEB3AUTH_NETWORK']
		}
	};
	return json(nativeOpts);
};
