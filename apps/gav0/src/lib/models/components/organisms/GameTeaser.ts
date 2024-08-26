export type GameTeaserAboutContent = {
	id: string;
	title: string;
	logLine: string;
	blurb: string;
  imageUrl: string;
};

export type GameTeaserHelperContent = {
	id: string;
	name: string;
	description: string;
};

export type GameTeaserHowWeHelpContent = {
	id: string;
	gameId: string;
	logLine: string;
	blurb: string;
	helpers: GameTeaserHelperContent[];
};

export type GameTeaserLaunchPadLauncherContent = {
	id: string;
	name: string;
	iconName?: string;
	description: string;
  launchAction: string;
	launchUrl?: string;
};

export type GameTeaserLaunchPadContent = {
	id: string;
	gameId: string;
	logLine: string;
	blurb: string;
	launchers: GameTeaserLaunchPadLauncherContent[];
};
