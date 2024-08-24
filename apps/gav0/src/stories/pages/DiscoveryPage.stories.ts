import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';

const meta = {
	title: 'Pages/DiscoveryPage',
	component: DiscoveryPage,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<DiscoveryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: DiscoveryPage,
	props: args
});
