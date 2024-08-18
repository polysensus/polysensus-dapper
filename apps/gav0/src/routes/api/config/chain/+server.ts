import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const defaultChains = 'ethereum,ethereumholesky,redstone,garnet';

export const GET: RequestHandler = () => {
	const chainNames: string[] = (env['PUBLIC_API_CONFIG_CHAIN_CHAINS'] ?? defaultChains).split(',');
	// console.log(`#api/config/chain: ${chainNames}`);
	return json(chainNames);
};
