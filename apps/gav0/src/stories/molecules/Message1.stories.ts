import type { Meta, StoryObj } from '@storybook/svelte';
import Message1 from '$lib/components/molecules/Message1.svelte';

const meta = {
	title: 'Molecules/Message1',
	component: Message1,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: Message1,
		props: args
	})
} satisfies Meta<Message1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: Message1,
	props: args
});
