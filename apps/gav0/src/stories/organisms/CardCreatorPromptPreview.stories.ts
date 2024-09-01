import type { Meta, StoryObj } from '@storybook/svelte';
import CardCreatePromptPreview from '$lib/components/organisms/CardCreatePromptPreview.svelte';
import { randomImages } from '$lib/utils';
let slides: { src: string; alt: string } = randomImages('teasers', 6);

const meta = {
	title: 'Organisms/CardCreatePromptPreview',
	component: CardCreatePromptPreview,
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
		Component: CardCreatePromptPreview,
		props: args
	})
} satisfies Meta<CardCreatePromptPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CardCreatePromptPreview,
// 	props: {...args, slides}
// });
export const Default: Story = {
	// args: { props: { slides } }
	args: { slides }
};
