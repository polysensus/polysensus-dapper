import type { Meta, StoryObj } from '@storybook/svelte';
import GAVBar from '$lib/components/organisms/GAVBar.svelte';

const meta = {
	title: 'Organisms/GAVBar',
	component: GAVBar,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	},
	render: (args) => ({
		Component: GAVBar,
		props: args
	})
} satisfies Meta<GAVBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: GAVBar,
	props: args
});
