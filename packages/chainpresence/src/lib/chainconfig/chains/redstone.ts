// https://garnetchain.com/docs/network-info
import type { ChainAccessConfig } from '../chainaccessconfig.js';
export const chains_redstone_default: ChainAccessConfig = {
	chainId: 690,
	displayName: 'Redstone',
	name: 'redstone_default',
	networkName: 'redstone',
	description: 'The public mainnet for Redstone, settling on Ethereum Mainnet',
	infoUrl: 'https://redstone.xyz/docs/network-info',
	ticker: 'ETH',
	rpcUrl: 'https://rpc.redstonechain.com',
	wsRpcUrl: 'wss://rpc.redstonechain.com',
	explorerUrl: 'https://explorer.redstone.xyz'
};
