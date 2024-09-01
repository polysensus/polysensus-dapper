import type { Meta, StoryObj } from '@storybook/svelte';
import BiomesFabricator from '$lib/components/organisms/BiomesFabricator.svelte';

import { randomImages } from '$lib/utils';
const images: { src: string; alt: string } = randomImages('teasers', 4);
const panels = images.map((image, i) => ( { id: i+1, image, text: `Panel ${i+1}` }));

const meta = {
	title: 'Organisms/BiomesFabricator',
	component: BiomesFabricator,
	tags: ['autodocs'],
	argTypes: {
	},
	render: (args) => ({
		Component: BiomesFabricator,
		props: args
	})
} satisfies Meta<BiomesFabricator>;

export default meta;
type Story = StoryObj<typeof meta>;

let messages: {id: number, text: string, image: {src:string, alt:string}}[] = [
  {id: 1, text: 'Hello', image: images[0]},
  {id: 2, text: 'World', image: images[1]},
  {id: 3, text: 'What did the quick brown fox do ?', image: images[2]},
  {id: 4, text: 'The quick brown fox jumps over the lazy dog.', image: images[3]},
]

export const SelectedGraffiti: Story = (args) => ({
	Component: BiomesFabricator,
	props: {...args, pathname: "/fabricator/biomes/graffiti",data: { content: messages }}
});

export const SelectedBlueprints: Story = (args) => ({
	Component: BiomesFabricator,
	props: {...args, pathname: "/fabricator/biomes/blueprints",data: { content: panels }}
});
