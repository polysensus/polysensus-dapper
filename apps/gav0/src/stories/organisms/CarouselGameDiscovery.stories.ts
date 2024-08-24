import type { Meta, StoryObj } from '@storybook/svelte';
import CarouselGameDiscovery from '$lib/components/organisms/CarouselGameDiscovery.svelte';
import { randomImages } from '$lib/utils';
let slides: { src: string; alt: string } = randomImages('teasers', 6);

const meta = {
	title: 'Organisms/CarouselGameDiscovery',
	component: CarouselGameDiscovery,
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
    Component: CarouselGameDiscovery,
    props: args,
  }),
} satisfies Meta<CarouselGameDiscovery>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CarouselGameDiscovery,
// 	props: {...args, slides}
// });
export const Default: Story = {
	args: { slides }
};
