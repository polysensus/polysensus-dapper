import type { Meta, StoryObj } from '@storybook/svelte';
import ButtonSubmit1 from '$lib/components/atoms/ButtonSubmit1.svelte';

const meta = {
	title: 'Atoms/ButtonSubmit1',
	component: ButtonSubmit1,
	tags: ['autodocs'],
	render: (args) => ({
		Component: ButtonSubmit1,
		props: args
	})
} satisfies Meta<ButtonSubmit1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: ButtonSubmit1,
	props: args
});