import type { Meta, StoryObj } from '@storybook/svelte';
import CardGameTeaserHowWeHelp from '$lib/components/organisms/CardGameTeaserHowWeHelp.svelte';

const meta = {
	title: 'Organisms/CardGameTeaserHowWeHelp',
	component: CardGameTeaserHowWeHelp,
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
		Component: CardGameTeaserHowWeHelp,
		props: args
	})
} satisfies Meta<CardGameTeaserHowWeHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CardGameTeaserHowWeHelp,
// 	props: {...args, slides}
// });
export const Default: Story = {
	args: {
		game: {
			id: 'game-1-helpers',
			gameId: 'game-1',
			logLine: 'Log Line for Game 1 Helpers',
			helpers: [
				{ id: 'helper-1', name: 'Helper 1', description: 'Cool thing 1' },
				{ id: 'helper-2', name: 'Helper 2', description: 'Useful thing 2' }
			],
			blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum
velit et gravida vehicula. Proin at felis leo. Proin et scelerisque leo.
Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam enim
neque, blandit nec mi eget, placerat elementum nisi. Morbi condimentum
convallis porttitor. Phasellus consectetur luctus erat, in sodales ligula
pellentesque sit amet. Proin consequat quis leo a volutpat. Cras eu mattis
sem. In pellentesque sem odio. Quisque id mauris et dolor feugiat commodo at
ut ligula. Proin cursus mollis gravida.

Praesent eget dignissim arcu. Proin ut interdum dui. Phasellus aliquet odio ac
ex tempor ultrices. Aenean fringilla porta eros sed pharetra. Nunc finibus
interdum metus fermentum interdum. Proin sit amet tempor velit. Ut ultricies
odio ante, nec aliquet mauris sodales quis. Aliquam hendrerit nisl ut pretium
viverra. Etiam sed fringilla enim, sed elementum risus. Etiam ac dictum eros, in
commodo nisl. In vel dolor laoreet, rhoncus magna finibus, imperdiet metus. Cras
enim mi, aliquam scelerisque felis nec, pharetra dapibus odio.  
    `
		}
	}
};
