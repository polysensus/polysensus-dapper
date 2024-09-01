import type { Meta, StoryObj } from '@storybook/svelte';
import ButtonVoiceInput1 from '$lib/components/atoms/ButtonVoiceInput1.svelte';

const meta = {
	title: 'Atoms/ButtonVoiceInput1',
	component: ButtonVoiceInput1,
	tags: ['autodocs'],
	argTypes: {
		slides: { src: 'string', alt: 'string' },
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	},
	render: (args) => ({
		Component: ButtonVoiceInput1,
		props: args
	})
} satisfies Meta<ButtonVoiceInput1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: ButtonVoiceInput1,
	props: args
});