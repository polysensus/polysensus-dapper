// import type { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';
import type { FetchFunctionLike } from '../fetchfunction.js';
import type { Web3AuthAdapterConfig } from '$lib/types.js';

export async function fetchWeb3AdapterOptions(
	fetch: FetchFunctionLike,
	configs: string[]
): Promise<Web3AuthAdapterConfig[]> {
	try {
		// Map over the configs array to create an array of fetch Promises
		const fetchPromises = configs.map((path) =>
			fetch(path).then((response: Response) => {
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
