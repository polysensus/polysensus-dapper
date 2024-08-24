import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import DynamicSlidesExample from '$lib/components/examples/DynamicSlidesExample.svelte';

const meta = {
	title: 'Examples/DynamicSlidesExample',
	component: DynamicSlidesExample,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<DynamicSlidesExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: DynamicSlidesExample,
	props: args
});
