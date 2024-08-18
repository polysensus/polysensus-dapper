import type { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';
import type { EnvConfigLike } from '$lib/fromenv.js';
import { fromPrefixedEnv } from '$lib/fromenv.js';
import type { LoginProvider, Web3AuthAdapterConfig } from './adapterconfig.js';

// import * as openlogin_utils from '@toruslabs/openlogin-utils';
// const { UX_MODE } = openlogin_utils;
// XXX: can't get the import to work, ends up undefined.
const UX_MODE_REDIRECT = 'redirect';
const WALLET_ADAPTERS_OPENLOGIN = 'openlogin';

// import * as web3auth_base from '@web3auth/base';
// const { WALLET_ADAPTERS } = web3auth_base;
// import { WALLET_ADAPTERS } from '@web3auth/base';
// XXX: can't get the import to work, WALLET_ADAPTERS ends up undefined.

export const web3auth_adapter_openlogin_default: EnvConfigLike = {};

export function OpenloginAdapterOptionsFromEnv(
	prefix: string,
	defaults: EnvConfigLike,
	env: EnvConfigLike
): Web3AuthAdapterConfig {
	const base: EnvConfigLike = {
		id: WALLET_ADAPTERS_OPENLOGIN,
		adapterId: WALLET_ADAPTERS_OPENLOGIN,
		...defaults,
		...fromPrefixedEnv(`${prefix}BASE_`, env)
	};
	if (!base.id) throw new Error(`${prefix}BASE_ID not set`);
	if (!base.adapterId) throw new Error(`${prefix}BASE_ADAPTER_ID not set`);

	const verifier: EnvConfigLike = {
		...defaults,
		...fromPrefixedEnv(`${prefix}VERIFIER_`, env)
	};
	// console.log(`VERIFIER: ${prefix} ${JSON.stringify(verifier)}`);

	if (!verifier.name) throw new Error(`${prefix}VERIFIER_NAME not set`);
	if (!verifier.clientId) throw new Error(`${prefix}VERIFIER_CLIENT_ID not set`);

	const loginProvider: LoginProvider = {
		loginProvider: 'jwt',
		extraLoginOptions: {
			verifierIdField: 'sub',
			...defaults,
			...fromPrefixedEnv(`${prefix}LOGIN_OPTIONS_`, env)
		}
	};
	if (!loginProvider.extraLoginOptions.domain)
		throw new Error(`${prefix}LOGIN_OPTIONS_DOMAIN not set`);
	if (!loginProvider.extraLoginOptions.verifierIdField)
		throw new Error(`${prefix}LOGIN_OPTIONS_VERIFIER_ID_FIELD not set`);

	const options: OpenloginAdapterOptions = {
		loginSettings: {
			mfaLevel: 'optional'
		},
		adapterSettings: {
			uxMode: UX_MODE_REDIRECT,
			loginConfig: {
				jwt: {
					verifier: verifier.name,
					typeOfLogin: 'jwt',
					clientId: verifier.clientId
				}
			},
			mfaSettings: {
				deviceShareFactor: {
					enable: true,
					priority: 1,
					mandatory: true
				},
				backUpShareFactor: {
					enable: true,
					priority: 2,
					mandatory: false
				},
				socialBackupFactor: {
					enable: true,
					priority: 3,
					mandatory: false
				},
				passwordFactor: {
					enable: true,
					priority: 4,
					mandatory: true
				}
			}
		}
	};
	const cfg: Web3AuthAdapterConfig = {
		id: base.id,
		adapterId: base.adapterId,
		options,
		loginProvider
	};
	return cfg;
}
