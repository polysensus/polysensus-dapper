// --- lib deps

import type { GameTeaserAboutContent } from '$lib/models/components';
import type { GameTeaserHowWeHelpContent } from '$lib/models/components';
import type { GameTeaserLaunchPadContent } from '$lib/models/components';

export class GameDiscoverySelector {
	_teasers: { [key: string]: GameTeaserAboutContent } = {};
	_augmentations: { [key: string]: GameTeaserHowWeHelpContent } = {};
	_launchPads: { [key: string]: GameTeaserLaunchPadContent } = {};
	selected?: string;

	get teasers(): GameTeaserAboutContent[] {
		return Object.values(this._teasers).sort((a, b) => a.id.localeCompare(b.id));
	}

	get gameIds(): string[] {
		return Object.keys(this._teasers).sort((a, b) => a.localeCompare(b));
	}

	get augmentations(): GameTeaserHowWeHelpContent[] {
		return Object.values(this._augmentations).sort((a, b) => a.gameId.localeCompare(b.gameId));
	}

	get launchPads(): GameTeaserLaunchPadContent[] {
		return Object.values(this._launchPads).sort((a, b) => a.gameId.localeCompare(b.gameId));
	}

	get teaser(): GameTeaserAboutContent {
    console.log(this.selected);
		if (!this.selected) throw new Error(`selected not set`);
		return this._teasers[this.selected];
	}

	get augmentation(): GameTeaserHowWeHelpContent {
		if (!this.selected) throw new Error(`selected not set`);
		return this._augmentations[this.selected];
	}

	get launchPad(): GameTeaserLaunchPadContent {
		if (!this.selected) throw new Error(`selected not set`);
		return this._launchPads[this.selected];
	}

	constructor(
		games: {
			about: GameTeaserAboutContent;
			howWeHelp: GameTeaserHowWeHelpContent;
			launchPad: GameTeaserLaunchPadContent;
		}[]
	) {
		games.forEach((game) => {
			if (game.about.id !== game.howWeHelp.gameId || game.about.id !== game.launchPad.gameId)
				throw new Error(`game.about.id inconsistent with associated items`);
			this._teasers[game.about.id] = game.about;
			this._augmentations[game.howWeHelp.gameId] = game.howWeHelp;
			this._launchPads[game.launchPad.gameId] = game.launchPad;
		});

		if (Object.values(this._teasers).length > 0) this.selected = this.teasers[0].id;
	}

	select(id: string) {
		if (!(id in this._teasers)) throw new Error(`id ${id} not found in teasers`);
		this.selected = id;
	}
}
