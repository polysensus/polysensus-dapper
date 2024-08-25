import type { Meta, StoryObj } from '@storybook/svelte';
import CarouselGameDiscoverySelectedGame from '$lib/components/organisms/CarouselGameDiscoverySelectedGame.svelte';

import { singleGameSelector as selector } from '../../lib/placeholders/gamediscoveryselectors';

const meta = {
	title: 'Organisms/CarouselGameDiscoverySelectedGame',
	component: CarouselGameDiscoverySelectedGame,
	tags: ['autodocs'],
	argTypes: {
		// selector: GameDiscoverySelector,
		// selected: 'string',
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	},
	render: (args) => ({
		Component: CarouselGameDiscoverySelectedGame,
		props: args
	})
} satisfies Meta<CarouselGameDiscoverySelectedGame>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CarouselGameDiscoverySelectedGame,
// 	props: {...args, slides}
// });
export const Default: Story = {
	args: {
		selector,
		selected: 'game-1'
	}
};
