import type { Meta, StoryObj } from '@storybook/svelte';
import MessageRounded1 from '$lib/components/molecules/MessageRounded1.svelte';

const meta = {
	title: 'Molecules/MessageRounded1',
	component: MessageRounded1,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: MessageRounded1,
		props: args
	})
} satisfies Meta<MessageRounded1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: MessageRounded1,
	props: args
});
