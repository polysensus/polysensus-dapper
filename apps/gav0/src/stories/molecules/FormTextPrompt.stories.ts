import type { Meta, StoryObj } from '@storybook/svelte';
import FormTextPrompt from '$lib/components/molecules/FormTextPrompt.svelte';

const meta = {
	title: 'Molecules/FormTextPrompt',
	component: FormTextPrompt,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: FormTextPrompt,
		props: args
	})
} satisfies Meta<FormTextPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: FormTextPrompt,
	props: args
});
