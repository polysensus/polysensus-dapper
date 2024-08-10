import ChainAccessPicker from './ChainAccessPicker.svelte';

import { action } from '@storybook/addon-actions';

import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

import { storePopup } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

export default {
	component: ChainAccessPicker,
	title: 'ChainAccessPicker',
	tags: ['autodocs']
	//👇 Our exports that end in "Data" are not stories.
	// excludeStories: /.*Data$/,
	/*render: (args) => ({
		Component: ChainAccessPicker,
		props: args,
		on: {
			...actionsData
		}
	})*/
};

export const actionsData = {
	onProviderSelected: action('onProviderSelected')
};

export const Default = {
	args: {}
};

export const NothingSelected = {
	args: {
		configs: [
			{ id: 123, name: 'onetwothree' },
			{ id: 321, name: 'threetwoone' },
			{ id: 999, name: 'nineninenine' }
		]
	}
};

export const SecondSelected = {
	args: {
		configs: [
			{ id: 123, name: 'onetwothree' },
			{ id: 321, name: 'threetwoone' },
			{ id: 999, name: 'nineninenine' }
		],
		selected: { id: 321, name: 'threetwoone' }
	}
};
