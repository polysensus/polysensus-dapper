import { GameDiscoverySelector } from '$lib/components/organisms/gamediscoveryselector';
import type {
	GameTeaserHelperContent,
	GameTeaserHowWeHelpContent,
	GameTeaserLaunchPadLauncherContent,
	GameTeaserLaunchPadContent
} from '$lib/models/components';

export function aboutByNumber(id: number) {
	return {
		id: `game-${id}`,
		title: `Game ${id}`,
		logLine: `Log Line for Game ${id}`,
		blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`
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

export function launchPadByNumber(id: number, launcherCount: number): GameTeaserLaunchPadContent {
	const launchers: GameTeaserLaunchPadLauncherContent[] = [];
	for (let i = 0; i < launcherCount; i++) {
		if (!launchersById[`launcher-${i + 1}`]) {
			throw new Error(`Missing launcher with id "launcher-${i + 1}"`);
		}
		launchers.push(launchersById[`launcher-${i + 1}`]);
	}

	return {
		id: `game-${id}-launch-pad`,
		gameId: `game-${id}`,
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
		launchPad: launchPadByNumber(1, 4)
	}
]);

export const sixGameSelector: GameDiscoverySelector = new GameDiscoverySelector([
	{
		about: aboutByNumber(1),
		howWeHelp: howWeHelpByNumber(1, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadByNumber(1, 4)
	},
	{
		about: aboutByNumber(2),
		howWeHelp: howWeHelpByNumber(2, ['Awesome thing', 'Unusual thing']),
		launchPad: launchPadByNumber(2, 4)
	},
	{
		about: aboutByNumber(3),
		howWeHelp: howWeHelpByNumber(3, ['Cool thing1', 'Fancy thing', 'Surprising thing']),
		launchPad: launchPadByNumber(3, 4)
	},
	{
		about: aboutByNumber(4),
		howWeHelp: howWeHelpByNumber(4, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadByNumber(4, 4)
	},
	{
		about: aboutByNumber(5),
		howWeHelp: howWeHelpByNumber(5, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadByNumber(5, 4)
	},
	{
		about: aboutByNumber(6),
		howWeHelp: howWeHelpByNumber(6, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadByNumber(6, 4)
	}
]);
