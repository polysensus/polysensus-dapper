import { fromPrefixedEnv } from '@polysensus-dapper/chainpresence';
import type { EnvConfigLike } from '@polysensus-dapper/chainpresence';

export const API_CONFIG_GAME_PATH = `/api/config/game`;

export type GameConfig = {
	/**unique name for the game config, must be url safe, must be symbol safe*/
	name: string;
	/** identifies the chain configs to use*/
	chainConfigs: string[];
	testnetChainConfigs: string[];
};

function splitMultiString(value: string | Array<string> | undefined) {
	if (typeof value === 'string') return value.split(',');
	return value;
}

export function GameConfigFromEnv(
	prefix: string,
	defaults: EnvConfigLike,
	env: EnvConfigLike
): GameConfig {
	const raw: EnvConfigLike = { ...defaults, ...fromPrefixedEnv(prefix, env) };

	const cfg: GameConfig = {
		...raw,
		chainConfigs: splitMultiString(raw.chainConfigs),
		testnentChainConfigs: splitMultiString(raw.testnetChainConfigs)
	};

	return cfg;
}

export async function fetchGameConfigs(fetch, configs: string[]): Promise<GameConfig[]> {
	try {
		// Map over the configs array to create an array of fetch Promises
		const fetchPromises = configs.map((path) =>
			fetch(path).then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
				}
				return response.json();
			})
		);

		// Use Promise.all to wait for all Promises to resolve
		const results = await Promise.all(fetchPromises);

		return results;
	} catch (error) {
		console.error('Error fetching configs:', error);
		throw error; // Rethrow the error for further handling if needed
	}
}
