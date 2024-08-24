import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-links',
		'@storybook/addon-themes',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions'
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	// core: {
	// 	builder: '@storybook/builder-vite'
	// },
	// viteFinal: async (config, { configType }) => {
	// 	// Add PostCSS handling to Vite
	// 	config.css = config.css || {};
	// 	config.css.postcss = './postcss.config.cjs';
	// 	// Extend the Vite configuration
	// 	return {
	// 		...config,
	// 		resolve: {
	// 			alias: {
	// 				...config.resolve?.alias,
	// 				$lib: '/src/lib' // Adjust the path according to your project structure
	// 			}
	// 		}
	// 	};
	// }
};
export default config;
