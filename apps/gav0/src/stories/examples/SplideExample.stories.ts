import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import SplideExample from '$lib/components/examples/SplideExample.svelte';

const meta = {
	title: 'Examples/SplideExample',
	component: SplideExample,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<SplideExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: SplideExample,
	props: args
});
