import type { Meta, StoryObj } from '@storybook/svelte';

import BiomesPreviewPane from '$lib/components/organisms/BiomesPreviewPane.svelte';

import { randomImages } from '$lib/utils';
const image: { src: string; alt: string } = randomImages('teasers', 1)[0];

const meta = {
	title: 'Organisms/BiomesPreviewPane',
	component: BiomesPreviewPane,
	tags: ['autodocs'],
	render: (args) => ({
		Component: BiomesPreviewPane,
		props: args,
	})
} satisfies Meta<BiomesPreviewPane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Graffiti: Story = {
	args: { image, meta: {generatorType: "graffiti"} }
};

export const Blueprints: Story = {
	args: { image, meta: {generatorType: "blueprints"} }
};
