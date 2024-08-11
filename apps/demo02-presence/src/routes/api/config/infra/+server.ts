import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const DEFAULT_INFRA_CONFIGS = ['web3authn'];

export const GET: RequestHandler = () => {
	const providers = env['PUBLIC_INFRA_PROVIDERS'] as string;
	if (!providers) return json(DEFAULT_INFRA_CONFIGS);
	return json(providers.split(','));
};
