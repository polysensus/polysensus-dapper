<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	// export let data;
	import { onMount } from 'svelte';

	import * as web3auth_no_modal from '@web3auth/no-modal';
	const { Web3AuthNoModal } = web3auth_no_modal;

	import * as web3auth_base from '@web3auth/base';
	const { WALLET_ADAPTERS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK, UX_MODE } = web3auth_base;

	import * as web3auth_openloginadapter from '@web3auth/openlogin-adapter';
	const { OpenloginAdapter } = web3auth_openloginadapter;
	import * as web3auth_ethereum_provider from '@web3auth/ethereum-provider';
	const { EthereumPrivateKeyProvider } = web3auth_ethereum_provider;

	//import RPC from "./web3RPC"; // for using web3.js
	// import RPC from './ethersRPC' // for using ethers.js
	import RPC from '$lib/viemRPC'; // for using viem
	import type { W } from 'vitest/dist/chunks/reporters.C_zwCd4j.js';

	let web3auth;
	let provider;
	let loggedIn = false;

	// XXX: demo03-auth0
	const clientId =
		'BL-m01b-u5AFq18I1PL5ImH5cEyUEaomN74xbOpin2IwlXtmxwQOEfiy5KGYaWhrVMSDOBbFc584TXOL_T7f9WM';

	onMount(async () => {
		await init();
	});

	const init = async () => {
		try {
			const chainConfig = {
				chainNamespace: CHAIN_NAMESPACES.EIP155,
				chainId: '0x1', // Please use 0x1 for Mainnet
				rpcTarget: 'https://rpc.ankr.com/eth',
				displayName: 'Ethereum Mainnet',
				blockExplorerUrl: 'https://etherscan.io/',
				ticker: 'ETH',
				tickerName: 'Ethereum',
				logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
			};

			const privateKeyProvider = new EthereumPrivateKeyProvider({
				config: { chainConfig }
			});

			web3auth = new Web3AuthNoModal({
				clientId,
				// XXX: web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				privateKeyProvider
			});

			const openloginAdapter = new OpenloginAdapter({
				loginSettings: {
					mfaLevel: 'optional'
				},
				adapterSettings: {
					uxMode: UX_MODE.REDIRECT,
					loginConfig: {
						jwt: {
							// XXX: verifier: 'w3a-auth0-demo',
							verifier: 'demo03-auth0',
							// verifier: 'w3a-auth0-demo-jwt-id-email',
							typeOfLogin: 'jwt',
							// XXX: clientId: 'hUVVf4SEsZT7syOiL0gLU9hFEtm2gQ6O',
							clientId: 'DhecZlb4adm8AF96u3qjbeEFsU8TSjPd'
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
			});
			web3auth.configureAdapter(openloginAdapter);

			await web3auth.init();
			provider = web3auth.provider;

			if (web3auth.connected) {
				loggedIn = true;
			}
		} catch (error) {
			console.error(error);
		}
	};
	const login = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
			loginProvider: 'jwt',
			extraLoginOptions: {
				// XXX: domain: 'https://web3auth.au.auth0.com',
				domain: 'https://polysensus-hoy.uk.auth0.com',
				// XXX: verifierIdField: 'email',
				verifierIdField: 'sub'
				// verifierIdField: 'email',
				// connection: "google-oauth2", // Use this to skip Auth0 Modal for Google login.
			}
		});
		provider = web3authProvider;
	};

	const authenticateUser = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		const idToken = await web3auth.authenticateUser();
		uiConsole(idToken);
	};

	const getUserInfo = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		const user = await web3auth.getUserInfo();
		uiConsole(user);
	};

	const logout = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		try {
			await web3auth.logout();
		} catch (error) {
			uiConsole(JSON.stringify(error));
		}
		loggedIn = false;
		provider = null;
	};

	const getAccounts = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const address = await rpc.getAccounts();
		uiConsole(address);
	};

	const getBalance = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const balance = await rpc.getBalance();
		uiConsole(balance);
	};

	const sendTransaction = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const receipt = await rpc.sendTransaction();
		uiConsole(receipt);
	};

	const signMessage = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const signedMessage = await rpc.signMessage();
		uiConsole(signedMessage);
	};

	function uiConsole(...args: any[]): void {
		const el = document.querySelector('#console>p');
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	}

	const getPrivateKey = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const privateKey = await rpc.getPrivateKey();
		uiConsole(privateKey);
	};
</script>

{#if loggedIn}
	<div class="card p-4">
		<div>
			<button on:click={() => getUserInfo()} type="button" class="btn variant-filled"
				>Get User Info</button
			>
		</div>
		<div>
			<button on:click={() => authenticateUser()} type="button" class="btn variant-filled">
				Get ID Token
			</button>
		</div>
		<div>
			<button on:click={() => getChainId()} type="button" class="btn variant-filled">
				Get Chain ID
			</button>
		</div>
		<div>
			<button on:click={() => getAccounts()} type="button" class="btn variant-filled">
				Get Accounts
			</button>
		</div>
		<div>
			<button on:click={() => getBalance()} type="button" class="btn variant-filled">
				Get Balance
			</button>
		</div>
		<div>
			<button on:click={() => signMessage()} type="button" class="btn variant-filled">
				Sign Message
			</button>
		</div>
		<div>
			<button on:click={() => sendTransaction()} type="button" class="btn variant-filled">
				Send Transaction
			</button>
		</div>
		<div>
			<button on:click={() => getPrivateKey()} type="button" class="btn variant-filled">
				Get Private Key
			</button>
		</div>
		<div>
			<button on:click={() => logout()} type="button" class="btn variant-filled"> Log Out </button>
		</div>
	</div>
{:else}
	<div>
		<button on:click={() => login()} type="button" class="btn variant-filled"> Log In </button>
	</div>
{/if}
<div id="console" style={{ whiteSpace: 'pre-line' }}>
	<p style={{ whiteSpace: 'pre-line' }}>Logged in Successfully!</p>
</div>

<!--
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
			<li><code class="code">/src/app.postcss</code> - app wide css</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
	</div>
</div>
-->
