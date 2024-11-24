import { Command, Option } from "commander";

import { DungeonOptions } from "./jsondungeon.js";
import { parseBase10 } from "./optionsutils.js";

export const defaultRootLabel = "chaintrap-dungeon:static";

export type ContractOptions = {
  url: string
  abi: string
  contract: `0x${string}`
};
export type ChaintrapNarratorOptions = DungeonOptions & ContractOptions & {
  narratorKey: `0x${string}`
  game: string
  rootLabel: string
}
export type ChaintrapRaiderOptions = DungeonOptions & ContractOptions & {
  raiderKey: `0x${string}`
  rootLabel: string
  game: string
}
export function addOptionsChaintrapNarrator(program: Command): Command {
  return program
    .addOption(new Option("-u, --url <url>", "The URL for the chain").default("http://127.0.0.1:8545").env("RPC_URL"))
    .addOption(new Option("-C, --contract <contract>", "The address of the contract").env("CHAINTRAP_ADDRESS"))
    .addOption(new Option("--narrator-key <narratorkey>", "Private Key").env("NARATOR_KEY"))
    .addOption(new Option("--game <game>", "The game id").env("GAME_ID"))
    .option("--abi <abi>", "The ABI file to use", "abi.json")
    .option("-f, --file <file>", "The JSON file to analyze")
    .option("-S, --seeds <seeds>", "A file with seedes for each known title")
    .option("-s, --seed <seed>", "An explicit seed for the random number generator", parseBase10)
    .option("-o, --output <output>", "The output directory", "./dungeon/<name>/tiles")
    .option("--root-label <rootlabel>", "The root label for the dungeon", defaultRootLabel)
}

export function addOptionsChaintrapRaider(program: Command): Command {
  return program
    .addOption(new Option("-u, --url <url>", "The URL for the chain").default("http://127.0.0.1:8545").env("RPC_URL"))
    .addOption(new Option("-C, --contract <contract>", "The address of the contract").env("CHAINTRAP_ADDRESS"))
    .addOption(new Option("--raider-key <raiderkey>", "Private Key").env("RAIDER_KEY"))
    .addOption(new Option("--game <game>", "The game id").env("GAME_ID"))
    .option("--abi <abi>", "The ABI file to use", "abi.json")
    .option("--root-label <rootlabel>", "The root label for the dungeon", defaultRootLabel)
}