import { error } from '@sveltejs/kit';
import type { Load } from '@sveltejs/kit';

import { fetchInfraConfigs } from '@polysensus-dapper/chainpresence';

export const load: Load = async ({ params, fetch }) => {
	let resp = await fetch(`/api/config/infra`);
	if (!resp.ok) throw error(resp.status, { message: `fetching /api/config/infra` });

	const configNames: string[] = (await resp.json()) as string[];
	const configPaths: string[] = configNames.map((name: string) => `/api/config/infra/${name}`);
	return {
		infra: await fetchInfraConfigs(fetch, configPaths)
	};
};

/*
export async function load({ params, fetch }) {
	// const gid = ethers.BigNumber.from(params.gid);
	let resp = await fetch(`/api/trials/open`);
	if (!resp.ok) throw error(resp.status, { message: `fetching /api/trials/open` });
	return {
		page: {
			openTrials: await resp.json()
		}
	};
}*/
