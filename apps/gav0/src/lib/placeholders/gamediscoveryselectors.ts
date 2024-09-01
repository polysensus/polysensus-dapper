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
import biomesImgSrc from '$lib/assets/midjourney/teaser-biomes.jpg';
import primodiumImgSrc from '$lib/assets/midjourney/teaser-primodium.jpg';
import skystrifeImgSrc from '$lib/assets/midjourney/teaser-skystrife.jpg';

export const shrapnelId = `shrapnel-2024`;
export const biomesId = `biomes-2024`;
export const primodiumId = `primodium-2024`;
export const skystrifeId = `skystrife-2024`;

export function aboutByNumber(id: number): GameTeaserAboutContent {
	return {
		id: `game-${id}`,
		title: `Game ${id}`,
		logLine: `Log Line for Game ${id}`,
		blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
		imageUrl:
			placeholders.teasers.length > id
				? placeholders.teasers[id]
				: randomImages('teasers', 1)[0].src
	};
}

export function howWeHelpByNumber(
	id: number,
	helperDescriptions: string[],
	gameId?: string
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
		gameId: gameId ?? `game-${id}`,
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

export const sevenGameSelector: GameDiscoverySelector = new GameDiscoverySelector([
	{
		about: {
			id: biomesId,
			logLine: 'What will your world look like?',
			title: 'BIOMES',
			imageUrl: biomesImgSrc,
			blurb: `Wonder around, play mini-games, team up and craft your own experience in this
MMORPG sandbox. Fish, craft, farm, create.

Like Roblox or Minecraft, but with many more opportunities to create your own
worlds and environment, and fewer rules.

What will your world look like?`
		},
		howWeHelp: {
			id: `${biomesId}-augmentation`,
			gameId: biomesId,
			logLine: 'Builder, on-board and LFG helpers',
			blurb: 'Skip the invite codes, accelerate your world building and find your team',
			helpers: [
				{
					id: `helper-${biomesId}-0`,
					name: 'Blueprints fabricator',
					description: 'Rapid, automatic, blueprint creation and experience deployment',
          fabLink: {fabId: 'blueprints', buttonText: 'Blueprint Fab'}
				},
				{
					id: `helper-${biomesId}-1`,
					name: 'Skip the invite codes',
					description:
						'Avoids the need for invite codes'
				},
				{
					id: `helper-${biomesId}-2`,
					name: 'Graffiti fabricator',
					description: 'Leave your mark on the world with custom graffiti',
          fabLink: {fabId: 'graffiti', buttonText: 'Graffiti Fab'}
				},
			]
		},
		launchPad: launchPadById(biomesId, 3)
	},
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
		about: {
			id: primodiumId,
			logLine: 'Gain control over the asteroid belt by building your industrial empire',
			title: 'primodium',
			imageUrl: primodiumImgSrc,
			blurb: `
Gain control over the asteroid belt by building your industrial empire and fleet
to battle your enemies. Collect resources through mining, trading or raiding,
transport and process them, construct your automated production line and even
undertake research to upgrade your equipment, all in an attempt to increase your
control over the asteroid belt.`
		},
		howWeHelp: {
			id: `${primodiumId}-augmentation`,
			gameId: primodiumId,
			logLine: 'Builder, on-board and LFG helpers',
			blurb: 'Generate industrial artifacts, show off your fleet and get going faster',
			helpers: [
				{
					id: `helper-${primodiumId}-0`,
					name: 'Game artifact generator',
					description: 'Create custom add-ons for your industrial complex'
				},
				{
					id: `helper-${primodiumId}-1`,
					name: 'Brag list',
					description:
						'Show off your fleet on your GAV player page'
				},
				{
					id: `helper-${primodiumId}-2`,
					name: 'Easy play',
					description: 'Step straight into your planetary empire building with our easy play option'
				},
			]
		},
		launchPad: launchPadById(primodiumId, 3)
	},

	{
		about: aboutByNumber(4),
		howWeHelp: howWeHelpByNumber(4, ['Cool thing 1', 'Fancy thing 2', 'Awesome thing 3']),
		launchPad: launchPadById(4, 4)
	},

	{
		about: {
			id: skystrifeId,
			logLine: 'Gain control over the asteroid belt by building your industrial empire',
			title: 'skystrife',
			imageUrl: skystrifeImgSrc,
			blurb: `Secure the Ember Crown by being the last one standing in this fast-paced, real
time strategy game. Each turn, you can move or attack with your army, conquering
mines or destroying enemy units. Boost your gold reserves to secure that Crown. 

Will you be the last one standing?`
		},
		howWeHelp: {
			id: `${skystrifeId}-augmentation`,
			gameId: skystrifeId,
			logLine: 'Will you be the last one standing?',
			blurb: 'Skip the invite codes, accelerate your world building and find your team',
			helpers: [
				{
					id: `helper-${skystrifeId}-0`,
					name: 'Easy play',
					description: 'Start conquering islands with your hero and 1,000 gold units with our easy play option'
				},
				{
					id: `helper-${skystrifeId}-1`,
					name: 'Brag list',
					description:
						'Showcase your army, gold reserve and conquered territory on your GAV player page'
				},
				{
					id: `helper-${skystrifeId}-2`,
					name: 'Artifact generator',
					description: 'Customize your islands and armies and make them yours'
				},
			]
		},
		launchPad: launchPadById(skystrifeId, 3)
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
