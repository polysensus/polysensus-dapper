import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import TailwindThumbnails from '$lib/components/examples/TailwindThumbnails.svelte';

const meta = {
	title: 'Examples/TailwindThumbnails',
	component: TailwindThumbnails,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<TailwindThumbnails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: TailwindThumbnails,
	props: args
});
