import type { JsonDungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import { readJson } from "./fsutil.js";

export type DungeonOptions = { file: string, seeds: string, seed: number, output: string };

export function dungeonName(dungeon: JsonDungeon): string {
  return dungeon.title.toLowerCase().replace(/ /g, "_");
}

export function loadJsonDugeon(file: string): JsonDungeon {
  return readJson(file);
}

export function resolveSeed(options: DungeonOptions, dungeon: JsonDungeon): number {

  // // note: the seeds are scraped from the .md files, which contain the generation url's for each dungeon.
  // // the seed is a query parameter in the url, and is used to generate the same dungeon.
  // import seeds from "./seeds.json"

  const name = dungeonName(dungeon);
  let seed: number = options.seed;
  if (options.seeds)
    seed = readJson(options.seeds)[name] ?? seed;
  if (!seed)
    if (options.seeds)
      throw new Error(`Seed not found for dungeion title ${name}`);
    else
      throw new Error(`Provide a seed file or an explicit seed value`);
  return seed;
}