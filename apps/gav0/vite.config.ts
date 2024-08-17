import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
//import { defineConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			exclude: ['fs'],
			globals: {
				Buffer: true,
				global: true,
				process: true
			},
			protocolImports: true
		}),
		purgeCss()
	]
	// from this web3authn example: https://github.com/Web3Auth/web3auth-pnp-examples/blob/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/auth0-no-modal-example/vite.config.ts
	// resolve: {
	//   alias: {
	//     crypto: "empty-module",
	//     assert: "empty-module",
	//     http: "empty-module",
	//     https: "empty-module",
	//     os: "empty-module",
	//     url: "empty-module",
	//     zlib: "empty-module",
	//     stream: "empty-module",
	//     _stream_duplex: "empty-module",
	//     _stream_passthrough: "empty-module",
	//     _stream_readable: "empty-module",
	//     _stream_writable: "empty-module",
	//     _stream_transform: "empty-module",
	//   },
	// },
	// define: {
	//   global: "globalThis",
	// },
});
