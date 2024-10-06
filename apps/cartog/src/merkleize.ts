import type { Command } from "commander";
import { InvalidArgumentError } from "commander";

import { parseDungeon } from "@polysensus-dapper/svelte-onepagedungeon"
//import type { Dungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import type { JsonDungeon } from "@polysensus-dapper/svelte-onepagedungeon";
//import { readJson, readText, writeSVGTile, writeTextFile } from "./fsutil.js";
import { DungeonOptions, dungeonName, resolveSeed, loadJsonDugeon } from "./jsondungeon.js";

// import type { JSONConnection, Dungeon, ObjectType, Point, Door } from "@polysensus-dapper/svelte-onepagedungeon";
import type { JSONConnection as CTJSONConnection } from "@polysensus-dapper/svelte-onepagedungeon";
import type {
  Door as WatDoor,
  Room as WatRoom
} from "@polysensus-dapper/svelte-onepagedungeon";

function parseBase10(value: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed))
    throw new InvalidArgumentError("Not a number");
  return parsed;
}

export function addMerklizeCommand(program: Command): void {
  program
    .command("merkleize")
    .description("merkleize a watabou dungeon, also persisting its json chaintrap compatible representation")
    .option("-f, --file <file>", "The JSON file to analyze")
    .option("-S, --seeds <seeds>", "A file with seedes for each known title")
    .option("-s, --seed <seed>", "An explicit seed for the random number generator", parseBase10)
    .option("-o, --output <output>", "The output directory", "./dungeon/<name>/tiles")
    .action((options: DungeonOptions) => {
      merklize(program, options);
    });
}

const out = console.log;
let vout = (...args: any[]) => { };

function merklize(program: Command, options: DungeonOptions) {
  out(`Analyzing file: ${options.file}`);
  if (!options.output)
    throw new Error("Output directory not specified");
  const watabouJson = loadJsonDugeon(options.file);
  vout(JSON.stringify(watabouJson, null, '  '));
  const name = dungeonName(watabouJson);
  const outputDir = options.output.replace("<name>", name);
  const seed = resolveSeed(options, watabouJson);
  const dungeon = parseDungeon(seed, watabouJson);
  const s = JSON.stringify(dungeon, null, '  ')

  // The relationship bewtween the watabou format and the chaintrap format is esesntially 1:1 for things that matter.
  // * Watabou room or area-rect has at most 4 exits - chain trap has arbitrary exits per side.
  // * Watabou sorts exits clockwise from the top - chaintrap sorts anti-clockwise.
  // * Watabou doors corresponds to a chaintrap connection/corridor
  // * Watabou doors (connections) are unit squares
  // * Watabou doors (connections) join only opposite sides, chaintrap joins allow for right angled corridor bends.

  const connections: (CTJSONConnection & WatDoor)[] = [];
  out(s);
}