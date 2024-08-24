import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import ThumbnailsExample from '$lib/components/examples/ThumbnailsExample.svelte';

const meta = {
	title: 'Examples/ThumbnailsExample',
	component: ThumbnailsExample,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<ThumbnailsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: ThumbnailsExample,
	props: args
});
