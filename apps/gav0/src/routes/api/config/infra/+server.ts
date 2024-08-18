import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const defaults = 'web3auth';

export const GET: RequestHandler = () => {
	const names: string[] = (env['PUBLIC_API_CONFIG_INFRA_PROVIDERS'] ?? defaults).split(',');
	return json(names);
};
