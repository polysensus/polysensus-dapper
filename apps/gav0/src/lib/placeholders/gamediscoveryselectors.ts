import { GameDiscoverySelector } from '$lib/components/organisms/gamediscoveryselector';
import type {
	GameTeaserHelperContent,
	GameTeaserHowWeHelpContent,
	GameTeaserLaunchPadLauncherContent,
	GameTeaserLaunchPadContent,
	GameTeaserAboutContent
} from '$lib/models/components';

import { placeholders, randomImages } from '$lib/utils/slides/placeholders';
import shrapnel2024 from '$lib/assets/midjourney/shrapnel-2024.png';

export const shrapnelId = `0-shrapnel-2024`;

export function aboutByNumber(id: number): GameTeaserAboutContent {
	return {
		id: `game-${id}`,
		title: `Game ${id}`,
		logLine: `Log Line for Game ${id}`,
		blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
		imageUrl:
			placeholders.teasers.length > id ? placeholders.teasers[id] : randomImages('teasers', 1)
	};
}

export function howWeHelpByNumber(
	id: number,
	helperDescriptions: string[]
): GameTeaserHowWeHelpContent {
	const helpers: GameTeaserHelperContent[] = helperDescriptions.map(
		(helper, index): GameTeaserHelperContent => {
			return {
				id: `helper-game-${id}-${index}`,
				name: `Helper ${id}-${index}`,
				description: helper
			};
		}
	);

	return {
		id: `game-${id}-augmentation`,
		gameId: `game-${id}`,
		logLine: `Log Line for Game ${id} Augmentation`,
		helpers,
		blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`
	};
}

export function launchPadById(
	id: number | string,
	launcherCount: number
): GameTeaserLaunchPadContent {
	id = typeof id === 'string' ? id : `game-${id}`;

	const launchers: GameTeaserLaunchPadLauncherContent[] = [];
	for (let i = 0; i < launcherCount; i++) {
		if (!launchersById[`launcher-${i + 1}`]) {
			throw new Error(`Missing launcher with id "launcher-${i + 1}"`);
		}
		launchers.push(launchersById[`launcher-${i + 1}`]);
	}

	return {
		id: `${id}-launch-pad`,
		gameId: `${id}`,
		logLine: `Log Line for Game ${id} Launch Pad`,
		blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
		launchers
	};
}

const launchersById: { [key: string]: GameTeaserLaunchPadLauncherContent } = {
	'launcher-1': {
		id: 'launcher-1',
		name: 'Test Net Pre-loaded',
		iconName: 'fa-gift',
		launchAction: 'Launch Test Net with pre-loaded eth',
		description: 'Use Game test net deploy for free with pre loaded test eth',
		launchUrl: 'https://www.polysensus.com'
	},
	'launcher-2': {
		id: 'launcher-2',
		name: 'Live Net GAS Sponsor',
		iconName: 'fa-gas-pump',
		launchAction: 'Launch with Sponsored GAS alowance',
		description: 'Sponsored entry to Game with your eth allowance',
		launchUrl: 'https://www.polysensus.com'
	},
	'launcher-3': {
		id: 'launcher-3',
		name: 'Not The Droid',
		iconName: 'fa-id-badge',
		launchAction: 'Launch and solve bot challenge',
		description: 'Pre solve the anti-bot chalenge for easy onboard to Game',
		launchUrl: 'https://www.polysensus.com'
	},
	'launcher-4': {
		id: 'launcher-4',
		name: 'Gear Bonus',
		iconName: 'fa-gift',
		launchAction: 'Launch with fee gear',
		description: 'Game entry with free bonus gear from developer',
		launchUrl: 'https://www.polysensus.com'
	}
};

export const singleGameSelector: GameDiscoverySelector = new GameDiscoverySelector([
	{
		about: aboutByNumber(1),
		howWeHelp: howWeHelpByNumber(1, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadById(1, 4)
	}
]);

export const sixGameSelector: GameDiscoverySelector = new GameDiscoverySelector([
	{
		about: {
			id: shrapnelId,
			logLine: 'Can you survive this high-stakes extraction challenge?',
			title: 'Shrapnel',
			imageUrl: shrapnel2024,
			blurb: `
It’s 2038. An asteroid collides with the moon. Lunar meteorites bombard a 500km
radius on  Earth.  This Sacrifice Zone is permanently evacuated and guarded by
paramilitary.  Until shrapnel from the meteor, full of  valuable resources, is
discovered in the Sacrifice Zone. Guards become mercenaries, risking their lives
to extract the valuable shrapnel from the Zone. 

Can you survive this high-stakes extraction challenge?`
		},
		howWeHelp: {
			id: `${shrapnelId}-augmentation`,
			gameId: shrapnelId,
			logLine: 'Power up your extraction team',
			blurb: 'Map and cosmentics creators, brag panel for your home page',
			helpers: [
				{
					id: `helper-${shrapnelId}-0`,
					name: 'Map and cosmetics creator',
					description:
						'Create your own maps and cosmetics to survive the Shrapnel extraction challenge'
				},
				{
					id: `helper-${shrapnelId}-1`,
					name: 'Brag list',
					description: 'Show off your extracted shrapnel and creations on your player page'
				},
				{
					id: `helper-${shrapnelId}-2`,
					name: 'Graffiti',
					description: 'Leave your mark on a valuable piece of shrapnel. Post-apocalyptic graffiti'
				}
			]
		},
		launchPad: launchPadById(shrapnelId, 4)
	},
	{
		about: aboutByNumber(2),
		howWeHelp: howWeHelpByNumber(2, ['Awesome thing', 'Unusual thing']),
		launchPad: launchPadById(2, 4)
	},
	{
		about: aboutByNumber(3),
		howWeHelp: howWeHelpByNumber(3, ['Cool thing1', 'Fancy thing', 'Surprising thing']),
		launchPad: launchPadById(3, 4)
	},
	{
		about: aboutByNumber(4),
		howWeHelp: howWeHelpByNumber(4, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadById(4, 4)
	},
	{
		about: aboutByNumber(5),
		howWeHelp: howWeHelpByNumber(5, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadById(5, 4)
	},
	{
		about: aboutByNumber(6),
		howWeHelp: howWeHelpByNumber(6, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadById(6, 4)
	}
]);
