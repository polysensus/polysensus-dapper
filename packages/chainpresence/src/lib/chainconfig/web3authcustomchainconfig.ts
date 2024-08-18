// import merge from 'lodash.merge';
import type { CustomChainConfig as Web3AuthCustomChainConfig } from '@web3auth/base';
import { chainIdFromHex, chainIdToHex } from '../chainidhex.js';
import * as web3auth_base from '@web3auth/base';
import type { ChainAccessConfig } from './chainaccessconfig.js';
const { CHAIN_NAMESPACES } = web3auth_base;

export function Web3AuthToChainAccessConfig(
	w3cfg: Web3AuthCustomChainConfig,
	defaults: ChainAccessConfig,
	overrides?: { name: string; decimals: number }
): ChainAccessConfig {
	const cfg: ChainAccessConfig = {
		chainId: chainIdFromHex(w3cfg.chainId),
		name: w3cfg?.displayName ?? defaults.name ?? '',
		networkName: w3cfg?.displayName ?? defaults.networkName ?? '',
		// infraProviderId: cfg.clientId,
		ticker: w3cfg?.ticker ?? defaults.ticker ?? '',
		decimals: w3cfg?.decimals ?? defaults.decimals ?? 18,
		rpcUrl: w3cfg?.rpcTarget ?? defaults.rpcUrl ?? '',
		wsRpcUrl: w3cfg?.wsTarget ?? defaults.wsRpcUrl ?? '',
		explorerUrl: w3cfg?.blockExplorerUrl ?? defaults?.explorerUrl ?? ''
	};
	if (overrides?.name) cfg.name = overrides.name;
	if (overrides?.decimals) cfg.decimals = overrides.decimals;
	return cfg;
}

export function ChainAccessConfigToWeb3Auth(
	cfg: ChainAccessConfig,
	defaults?: Web3AuthCustomChainConfig
): Web3AuthCustomChainConfig {
	const w3cfg: Web3AuthCustomChainConfig = {
		chainId: chainIdToHex(cfg.chainId),
		chainNamespace: defaults?.chainNamespace ?? CHAIN_NAMESPACES.EIP155,
		displayName: cfg.displayName,
		ticker: cfg.ticker ?? defaults?.ticker,
		decimals: cfg.decimals ?? defaults?.decimals,
		rpcTarget: cfg.rpcUrl ?? defaults?.rpcTarget,
		wsTarget: cfg.wsRpcUrl ?? defaults?.wsTarget,
		blockExplorerUrl: cfg.explorerUrl ?? defaults?.blockExplorerUrl,
		isTestnet: defaults?.isTestnet
	};
	return w3cfg;
}
