import type { Meta, StoryObj } from '@storybook/svelte';
import FormImagePrompt from '$lib/components/molecules/FormImagePrompt.svelte';

const meta = {
	title: 'Molecules/FormImagePrompt',
	component: FormImagePrompt,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: FormImagePrompt,
		props: args
	})
} satisfies Meta<FormImagePrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: FormImagePrompt,
	props: args
});
