import type { Command } from "commander";
import { InvalidArgumentError } from "commander";

import { createTopology } from "./createtopology.js";

import {
  parseDungeon,
} from "@polysensus-dapper/svelte-onepagedungeon"
import { DungeonOptions, dungeonName, resolveSeed, loadJsonDugeon } from "./jsondungeon.js";

// import * as abi from "@polysensus-dapper/chaintrap-contracts";

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
  // out(JSON.stringify(abi, null, '  '));
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
  const topo = createTopology(dungeon, name);
  const tree = topo.commit();

  out(s);
  for (const [i, v] of tree.entries()) {
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);
  }
}