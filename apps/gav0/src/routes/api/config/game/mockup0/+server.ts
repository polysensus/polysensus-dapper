import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '$lib/server/request';

import { GameConfigFromEnv } from '$lib/models/gameconfig';
import type { GameConfig } from '$lib/models/gameconfig';
const API_CONFIG_PREFIX = 'PUBLIC_API_CONFIG_GAME_MOCKUP0_';

export const GET: RequestHandler = () => {
	let cfg: GameConfig = GameConfigFromEnv(
		API_CONFIG_PREFIX,
		{
			name: 'mockup0',
			testnetChainConfigs: 'garnet,ethereumholesky'
		},
		env
	);

	// Allow the public to be overriden by any private env
	cfg = GameConfigFromEnv(API_CONFIG_PREFIX, cfg, secrets);
	return json(cfg);
};
