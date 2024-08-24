import type { Preview } from '@storybook/svelte';
import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

import '../src/app.postcss';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
