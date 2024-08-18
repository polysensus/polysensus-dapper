// https://garnetchain.com/docs/network-info
import type { ChainAccessConfig } from '../chainaccessconfig.js';
export const chains_garnet_default: ChainAccessConfig = {
	chainId: 17069,
	displayName: 'Garnet Holesky (L2)',
	name: 'garnet_default',
	networkName: 'garnet',
	description:
		'Garnet is the public testnet for Redstone, settling on the Ethereum Holesky testnet',
	infoUrl: 'https://garnetchain.com/docs/network-info',
	ticker: 'ETH',
	decimals: 18,
	rpcUrl: 'https://rpc.garnetchain.com',
	wsRpcUrl: 'wss://rpc.garnetchain.com',
	explorerUrl: 'https://explorer.garnetchain.com'
};
