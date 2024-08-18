import * as env from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

const defaultGames = 'mockup0';

export const GET: RequestHandler = () => {
	return json((env['PUBLIC_API_CONFIG_GAME_GAMES'] ?? defaultGames).split(','));
};
