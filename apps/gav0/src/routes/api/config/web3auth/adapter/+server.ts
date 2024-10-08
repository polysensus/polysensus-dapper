import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const defaults = 'openlogin';

export const GET: RequestHandler = () => {
	const chainNames: string[] = (
		env['PUBLIC_API_CONFIG_WEB3AUTH_ADAPTER_ADAPTERS'] ?? defaults
	).split(',');
	return json(chainNames);
};
