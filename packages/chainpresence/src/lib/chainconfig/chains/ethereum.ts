// https://ethereum.publicnode.com/
import type { ChainAccessConfig } from '../chainaccessconfig.js';
export const chains_ethereum_default: ChainAccessConfig = {
	chainId: 1,
	displayName: 'Ethereum',
	name: 'ethereum_default',
	networkName: 'ethereum',
	description: 'The ethereum mainnet, publicnode.com',
	infoUrl: 'https://ethereum-rpc.publicnode.com/',
	ticker: 'ETH',
	decimals: 18,
	rpcUrl: 'https://ethereum-rpc.publicnode.com',
	wsRpcUrl: 'wss://ethereum-rpc.publicnode.com',
	explorerUrl: 'https://etherscan.io/'
};
