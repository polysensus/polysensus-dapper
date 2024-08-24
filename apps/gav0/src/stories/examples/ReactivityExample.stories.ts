import type { Meta, StoryObj } from '@storybook/svelte';
// import DiscoveryPage from '$lib/components/pages/DiscoveryPage.svelte';
// import DiscoveryPage from '../../components/pages/DiscoveryPage.svelte';
import ReactivityExample from '$lib/components/examples/ReactivityExample.svelte';

const meta = {
	title: 'Examples/ReactivityExample',
	component: ReactivityExample,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<ReactivityExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: ReactivityExample,
	props: args
});
