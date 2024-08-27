// --- lib deps

import type { GameTeaserAboutContent } from '$lib/models/components';
import type { GameTeaserHowWeHelpContent } from '$lib/models/components';
import type { GameTeaserLaunchPadContent } from '$lib/models/components';

export class GameDiscoverySelector {
  _games: {
    about: GameTeaserAboutContent,
    howWeHelp: GameTeaserHowWeHelpContent,
    launchPad: GameTeaserLaunchPadContent}[] = [];
	_index: { [key: string]: number } = {};
	selected?: string;

	get teasers(): GameTeaserAboutContent[] {
		return this._games.map((game) => game.about);
	}

  /** gameId's returns the id's assigned to the about instances in order of their original indices (determined by order of addition) */
	get gameIds(): string[] {
		return this._games.map((game) => game.about.id);
	}

	get augmentations(): GameTeaserHowWeHelpContent[] {
		return this._games.map((game) => game.howWeHelp);
	}

	get launchPads(): GameTeaserLaunchPadContent[] {
		return this._games.map((game) => game.launchPad);
	}

	get teaser(): GameTeaserAboutContent {
		if (!this.selected) throw new Error(`selected not set`);
    return this._games[this._index[this.selected]].about;
	}

	get augmentation(): GameTeaserHowWeHelpContent {
		if (!this.selected) throw new Error(`selected not set`);
    return this._games[this._index[this.selected]].howWeHelp;
	}

	get launchPad(): GameTeaserLaunchPadContent {
		if (!this.selected) throw new Error(`selected not set`);
    return this._games[this._index[this.selected]].launchPad;
	}

	constructor(
		games: {
			about: GameTeaserAboutContent;
			howWeHelp: GameTeaserHowWeHelpContent;
			launchPad: GameTeaserLaunchPadContent;
		}[]
	) {
    this._games = games;
    this._games.forEach((game, index) => {
      this._index[game.about.id] = index;
    });

		if (Object.values(this._games).length > 0) this.selected = this.teasers[0].id;
	}

	/** return the id for the index. The index is according to the lexical sort order of the ids,
	 * so this.teasers[0].id == this._indices[0]
	 */
	idOf(index: number): string {
		return this._games[index].about.id;
	}

	select(id: string) {
		if (!(id in this._index)) throw new Error(`id ${id} not found in index`);
		this.selected = id;
	}
}
