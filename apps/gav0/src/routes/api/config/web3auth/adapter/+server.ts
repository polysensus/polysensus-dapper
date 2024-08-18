import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const defaults = 'openlogin';
const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_WEB3AUTH_ADAPTER_ADAPTERS';

export const GET: RequestHandler = () => {
	const chainNames: string[] = (env[API_CONFIG_PREFIX] ?? defaults).split(',');
	return json(chainNames);
};
