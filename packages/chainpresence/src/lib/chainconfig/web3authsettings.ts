import type { Web3AuthnSettings } from './web3auth.js';
import type { ChainAccessConfig } from './chainaccessconfig.js';
import { Web3AuthToChainAccessConfig } from './web3authcustomchainconfig.js';
import { ChainAccessConfigToWeb3Auth } from './web3authcustomchainconfig.js';

export function Web3AuthnSettingsToCommon(
	cfg: Web3AuthnSettings,
	defaults: ChainAccessConfig,
	overrides: { name: string; decimals: number }
): ChainAccessConfig {
	if (!cfg.chainConfig) throw new Error(`chainConfig not present, cant convert`);

	return Web3AuthToChainAccessConfig(cfg.chainConfig, defaults, overrides);
}

export function CommonToWeb3AuthnSettings(
	cfg: ChainAccessConfig,
	defaults?: Web3AuthnSettings
): Web3AuthnSettings {
	return {
		chainConfig: ChainAccessConfigToWeb3Auth(cfg, defaults?.chainConfig)
	};
}
