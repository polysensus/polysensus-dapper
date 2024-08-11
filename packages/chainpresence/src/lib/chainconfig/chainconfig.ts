import type { Web3AuthnSettings } from './web3authn.js';
import * as web3auth_base from '@web3auth/base';
const { CHAIN_NAMESPACES } = web3auth_base;

/**
 * Identifies a known chain configuration and
 * provides application specific access configuration
 */
export type ChainAccessConfig = {
	id: number;
	name: string;
	ticker?: string;
	decimals?: number;
	rpcUrl: string;
	explorerUrl?: string;
	bridgeUrl?: string;
};

export type DapperInfraConfig = {
	serviceName: string;
	chainConfigs: string[];
};

// ChainInfraConfig should be intersected with the specific infra type (web3authn etc)
export type ChainInfraConfig = {
	dapper: DapperInfraConfig;
};

export function Web3AuthnSettingsToCommon(cfg: Web3AuthnSettings): ChainAccessConfig {
	let hexId = cfg.chainConfig?.chainId ?? '';
	if (hexId?.startsWith('0x')) hexId = hexId.slice(2);
	if (hexId === '') hexId = '0';
	const id = parseInt(hexId, 16);
	if (isNaN(id))
		throw new Error(`chainId must be empty, undefined or hex: ${cfg.chainConfig?.chainId}`);

	return {
		id,
		name: cfg.chainConfig?.displayName ?? '',
		// infraProviderId: cfg.clientId,
		ticker: cfg.chainConfig?.ticker ?? '',
		decimals: cfg.chainConfig?.decimals,
		rpcUrl: cfg.chainConfig?.rpcTarget ?? '',
		explorerUrl: cfg.chainConfig?.blockExplorerUrl
	};
}

export function CommonToWeb3AuthnSettings(
	cfg: ChainAccessConfig,
	defaults?: Web3AuthnSettings
): Web3AuthnSettings {
	return {
		chainConfig: {
			// overrides anything preserved in cfg.orig
			chainNamespace: defaults?.chainConfig?.chainNamespace ?? CHAIN_NAMESPACES.EIP155,
			chainId: '0x' + cfg.id.toString(16),
			displayName: cfg.name ?? defaults?.chainConfig?.displayName,
			ticker: cfg.ticker ?? defaults?.chainConfig?.ticker,
			decimals: cfg.decimals ?? defaults?.chainConfig?.decimals,
			rpcTarget: cfg.rpcUrl ?? defaults?.chainConfig?.rpcTarget,
			blockExplorerUrl: cfg.explorerUrl ?? defaults?.chainConfig?.blockExplorerUrl
		}
	};
}
