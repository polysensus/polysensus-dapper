import type { Meta, StoryObj } from '@storybook/svelte';
import CardImageGenerator from '$lib/components/organisms/CardImageGenerator.svelte';

const meta = {
	title: 'Organisms/CardImageGenerator',
	component: CardImageGenerator,
	tags: ['autodocs'],
	argTypes: {
		game: { id: 'string', title: 'string', logLine: 'string', blurb: 'string' },
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	},
	render: (args) => ({
		Component: CardImageGenerator,
		props: args
	})
} satisfies Meta<CardImageGenerator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = (args) => ({
	Component: CardImageGenerator,
	props: args
});