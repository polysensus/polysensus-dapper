import type { Meta, StoryObj } from '@storybook/svelte';

import GeneratorPreviewPane from '$lib/components/organisms/GeneratorPreviewPane.svelte';

import { randomImages } from '$lib/utils';
const image: { src: string; alt: string } = randomImages('teasers', 1)[0];

const meta = {
	title: 'Organisms/GeneratorPreviewPane',
	component: GeneratorPreviewPane,
	tags: ['autodocs'],
	render: (args) => ({
		Component: GeneratorPreviewPane,
		props: args,
	})
} satisfies Meta<GeneratorPreviewPane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { image }
};
