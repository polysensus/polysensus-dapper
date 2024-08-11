import type { Meta, StoryObj } from '@storybook/svelte';
import ConfigPicker from '../lib/components/ConfigPicker.svelte';
// import { action } from '@storybook/addon-actions';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
	title: 'ConfigPicker',
	component: ConfigPicker,
	tags: ['autodocs'],
	argTypes: {}
} satisfies Meta<ConfigPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {}
};

export const NothingSelected: Story = {
	args: {
		configs: [
			{ id: 123, name: 'onetwothree' },
			{ id: 321, name: 'threetwoone' },
			{ id: 999, name: 'nineninenine' }
		]
	}
};

export const SecondSelected: Story = {
	args: {
		configs: [
			{ id: 123, name: 'onetwothree' },
			{ id: 321, name: 'threetwoone' },
			{ id: 999, name: 'nineninenine' }
		],
		selected: { id: 321, name: 'threetwoone' }
	}
};
