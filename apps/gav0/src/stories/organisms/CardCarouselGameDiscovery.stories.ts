import type { Meta, StoryObj } from '@storybook/svelte';
import CardCarouselGameDiscovery from '$lib/components/organisms/CardCarouselGameDiscovery.svelte';
import { randomImages } from '$lib/utils';
let slides: { src: string; alt: string } = randomImages('teasers', 6);

const meta = {
	title: 'Organisms/CardCarouselGameDiscovery',
	component: CardCarouselGameDiscovery,
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
		Component: CardCarouselGameDiscovery,
		props: args
	})
} satisfies Meta<CardCarouselGameDiscovery>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CardCarouselGameDiscovery,
// 	props: {...args, slides}
// });
export const Default: Story = {
	// args: { props: { slides } }
	args: { slides }
};
