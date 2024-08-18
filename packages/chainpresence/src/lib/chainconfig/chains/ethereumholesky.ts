// https://garnetchain.com/docs/network-info
import type { ChainAccessConfig } from '../chainaccessconfig.js';
export const chains_ethereumholesky_default: ChainAccessConfig = {
	chainId: 17000,
	displayName: 'Ethereum Holesky (L1)',
	name: 'holesky_default',
	networkName: 'holesky',
	description: 'A public Ethereum testnet',
	infoUrl: 'https://garnetchain.com/docs/network-info',
	ticker: 'ETH',
	decimals: 18,
	rpcUrl: 'https://ethereum-holesky.publicnode.com',
	wsRpcUrl: 'wss://ethereum-holesky.publicnode.com',
	explorerUrl: 'https://holesky.etherscan.io'
};
