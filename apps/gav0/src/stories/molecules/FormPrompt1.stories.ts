import type { Meta, StoryObj } from '@storybook/svelte';
import FormPrompt1 from '$lib/components/molecules/FormPrompt1.svelte';

const meta = {
	title: 'Molecules/FormPrompt1',
	component: FormPrompt1,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: FormPrompt1,
		props: args
	})
} satisfies Meta<FormPrompt1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: FormPrompt1,
	props: args
});
