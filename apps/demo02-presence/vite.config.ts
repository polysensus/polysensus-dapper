import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
// https://web3auth.io/docs/troubleshooting/svelte-issues
// import { sveltekit } from "@sveltejs/kit/vite";
// import { defineConfig } from "vitest/config";
// import { nodePolyfills } from "vite-plugin-node-polyfills";
//
// export default defineConfig({
//   plugins: [
//     nodePolyfills({
//       exclude: ["fs"],
//       globals: {
//         Buffer: true,
//         global: true,
//         process: true,
//       },
//       protocolImports: true,
//     }),
//     sveltekit(),
//   ],
//   optimizeDeps: {
//     include: ["dayjs/plugin/relativeTime.js", "dayjs", "@web3auth/ethereum-provider"],
//   },
//   test: {
//     include: ["src/**/*.{test,spec}.{js,ts}"],
//   },
// });
