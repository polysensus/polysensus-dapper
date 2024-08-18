import { error } from '@sveltejs/kit';
import type { Load } from '@sveltejs/kit';

import { fetchInfraConfigs } from '@polysensus-dapper/chainpresence';
import { fetchWeb3AdapterOptions } from '@polysensus-dapper/chainpresence';
import { fetchChainAccessConfigs } from '@polysensus-dapper/chainpresence';
import { API_CONFIG_GAME_PATH, fetchGameConfigs } from '$lib/models/gameconfig';
// import type { FetchFunction } from '@polysensus-dapper/chainpresence';

export const load: Load = async ({ params, fetch }) => {
	let resp: Response;
	resp = await fetch(`/api/config/infra`);
	if (!resp.ok) throw error(resp.status, { message: `fetching /api/config/infra` });

	const configInfraNames: string[] = (await resp.json()) as string[];
	const configInfraPaths: string[] = configInfraNames.map(
		(name: string) => `/api/config/infra/${name}`
	);

	resp = await fetch(`/api/config/chain`);
	if (!resp.ok) throw error(resp.status, { message: `fetching /api/config/chain` });

	const configChainNames: string[] = (await resp.json()) as string[];
	const configChainPaths: string[] = configChainNames.map(
		(name: string) => `/api/config/chain/${name}`
	);

	// console.log(`/+layout.ts# ${configChainPaths}`);

	resp = await fetch(API_CONFIG_GAME_PATH);
	if (!resp.ok) throw error(resp.status, { message: `fetching ${API_CONFIG_GAME_PATH}` });

	const configGameNames: string[] = (await resp.json()) as string[];
	const configGamePaths: string[] = configGameNames.map(
		(name: string) => `${API_CONFIG_GAME_PATH}/${name}`
	);

	const chains = await fetchChainAccessConfigs(fetch, configChainPaths);
	// console.log(`/+layout.ts# found ${chains.length} chains`);

	resp = await fetch(`/api/config/web3auth/adapter`);
	if (!resp.ok) throw error(resp.status, { message: `fetching /api/config/web3auth/adapter` });

	const adapterNames: string[] = (await resp.json()) as string[];
	const adapterPaths: string[] = adapterNames.map(
		(name: string) => `/api/config/web3auth/adapter/${name}`
	);
	const adapters = await fetchWeb3AdapterOptions(fetch, adapterPaths);
	// console.log(`/+layout.ts# found ${adapters.length} adapters`);

	return {
		chains,
		infra: await fetchInfraConfigs(fetch, configInfraPaths),
		games: await fetchGameConfigs(fetch, configGamePaths),
		adapters
	};
};
