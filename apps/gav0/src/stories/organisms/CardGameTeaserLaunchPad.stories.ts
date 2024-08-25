import type { Meta, StoryObj } from '@storybook/svelte';
import CardGameTeaserLaunchPad from '$lib/components/organisms/CardGameTeaserLaunchPad.svelte';

const meta = {
	title: 'Organisms/CardGameTeaserLaunchPad',
	component: CardGameTeaserLaunchPad,
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
		Component: CardGameTeaserLaunchPad,
		props: args
	})
} satisfies Meta<CardGameTeaserLaunchPad>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = (args) => ({
// 	Component: CardGameTeaserLaunchPad,
// 	props: {...args, slides}
// });
export const Default: Story = {
	args: {
		game: {
			id: 'game-1-helpers',
			gameId: 'game-1',
			logLine: 'Log Line for Game 1 Helpers',
			launchers: [
				{
					id: 'launcher-1',
					name: 'Test Net Pre-loaded',
					iconName: 'fa-gift',
					launchAction: 'Launch Test Net with pre-loaded eth',
					description: 'Use Game 1 test deploy for free with pre loaded test eth',
					launchUrl: 'https://www.polysensus.com'
				},
				{
					id: 'launcher-2',
					name: 'Live Net GAS Sponsor',
					iconName: 'fa-gas-pump',
					launchAction: 'Launch with Sponsored GAS alowance',
					description: 'Sponsored entry to Game 1 with your eth allowance',
					launchUrl: 'https://www.polysensus.com'
				},
				{
					id: 'launcher-3',
					name: 'Not The Droid',
					iconName: 'fa-id-badge',
					launchAction: 'Launch and solve bot challenge',
					description: 'Pre solve the anti-bot chalenge for easy onboard to Game 1',
					launchUrl: 'https://www.polysensus.com'
				},
				{
					id: 'launcher-4',
					name: 'Gear Bonus',
					iconName: 'fa-gift',
					launchAction: 'Launch with fee gear',
					description: 'Game 1 entry with free bonus gear from developer',
					launchUrl: 'https://www.polysensus.com'
				}
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
