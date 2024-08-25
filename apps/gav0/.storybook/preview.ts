import type { Preview, SvelteRenderer } from '@storybook/svelte';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
// import { themes } from '@storybook/theming';
// import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

import '../src/app.postcss';

const preview: Preview = {
	parameters: {
		darkMode: { stylePreview: true },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	decorators: [
		withThemeByDataAttribute<SvelteRenderer>({
			themes: {
				skeleton: 'skeleton',
				crimson: 'crimson',
				modern: 'modern'
			},
			defaultTheme: 'skeleton',
			parentSelector: 'body',
			attributeName: 'data-theme'
		})
	]
};

export default preview;
