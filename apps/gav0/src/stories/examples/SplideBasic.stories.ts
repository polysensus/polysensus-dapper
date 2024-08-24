import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import BasicExample from '$lib/components/examples/BasicExample.svelte';

const meta = {
	title: 'Examples/BasicExample',
	component: BasicExample,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<BasicExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: BasicExample,
	props: args
});
