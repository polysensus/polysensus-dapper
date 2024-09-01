import type { Meta, StoryObj } from '@storybook/svelte';
import MessageScroller from '$lib/components/organisms/MessageScroller.svelte';

let messages: {id: number, text: string}[] = [
  {id: 1, text: 'Hello'},
  {id: 2, text: 'World'},
  {id: 3, text: 'What did the quick brown fox do ?'},
  {id: 4, text: 'The quick brown fox jumps over the lazy dog.'},
]

const meta = {
	title: 'Organisms/MessageScroller',
	component: MessageScroller,
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
		Component: MessageScroller,
		props: args
	})
} satisfies Meta<MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: MessageScroller,
// 	props: {...args, slides}
// });
export const Default: Story = {
	args: { messages }
};

export const ShortHeight: Story = {
	args: { messages, heightCss: 'h-[10rem]'}
};

