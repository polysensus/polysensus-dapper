import type { Meta, StoryObj } from '@storybook/svelte';

import ImagePrompt from '$lib/components/organisms/ImagePrompt.svelte';

import { randomImages } from '$lib/utils';
const images: { src: string; alt: string } = randomImages('teasers', 4);
const panels = images.map((image, i) => ( { id: i+1, image, text: `Panel ${i+1}` }));


const meta = {
	title: 'Organisms/ImagePrompt',
	component: ImagePrompt,
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
		Component: ImagePrompt,
		props: args
	})
} satisfies Meta<ImagePrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { panels, stride: 2, strideWide: 3 }
};
