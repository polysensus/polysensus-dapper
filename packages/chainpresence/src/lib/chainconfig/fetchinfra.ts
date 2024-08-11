import type { Web3AuthnOptions } from './web3authn';
import type { ZeroDevConfig } from './zerodev';
import type { AlchemyInfraConfig } from './alchemy';

export async function fetchInfraConfigs(
	fetch,
	configs: string[]
): Promise<(Web3AuthnOptions | ZeroDevConfig | AlchemyInfraConfig)[]> {
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
