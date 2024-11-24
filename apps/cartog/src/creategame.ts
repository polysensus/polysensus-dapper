import type { Command } from "commander";
import {
  toHex } from 'viem';
import { redstone } from 'viem/chains'
import type { Chain } from 'viem/chains'

import {
  MerkleCodec, ObjectTypes,
} from "@polysensus-dapper/svelte-onepagedungeon"

import { ViemTransactors } from "@polysensus-dapper/chappie";
import type { RequestorOptionsViem } from "@polysensus-dapper/chappie";
import { ParsedLog } from "@polysensus-dapper/chappie";

import { readJson } from "./fsutil.js";

import { buildTree } from "./createtopology.js";


import { addOptionsChaintrapNarrator } from "./chaintrapoptions.js";
import type { ChaintrapNarratorOptions } from "./chaintrapoptions.js";


export function addCreateGameCommand(program: Command): void {

  const cmd = program
    .command("creategame")
    .description("create a chaintrap game from a watabou dungeon")

  addOptionsChaintrapNarrator(cmd)

  cmd
   .action(async (options: ChaintrapNarratorOptions) => {
      await createGame(program, options);
    });
}

const out = console.log;
let vout = (...args: any[]) => { };

async function createGame(program: Command, options: ChaintrapNarratorOptions) {

  if (!options.output)
    throw new Error("Output directory not specified");
  const tree = buildTree(options);
  const abi = readJson(options.abi).abi;

  const requestorOptions: RequestorOptionsViem = ViemTransactors.createPrivateKeyOptions(
    options.url, redstone, options.narratorKey, options.contract, abi
  );

  const initArgs = {
    tokenURI: "https://chaintrap.polysensus.io/dungeon/{id}",
    registrationLimit: 2,
    trialistArgs: {flags: 0, lives:2},
    rootLabels:[toHex(options.rootLabel.padStart(32, '0'))],
    roots: [tree.root],
    choiceInputTypes: [ObjectTypes.E.location_choices].map(MerkleCodec.conditionInput),
    transitionTypes: [ObjectTypes.E.link, ObjectTypes.E.finish].map(MerkleCodec.conditionInput),
    victoryTransitionTypes: [ObjectTypes.E.finish].map(MerkleCodec.conditionInput),
    haltParticipantTransitionTypes: [ObjectTypes.E.fatal_chest_trap].map(MerkleCodec.conditionInput),
    livesIncrement: [ObjectTypes.E.chest_treat_gain_life].map(MerkleCodec.conditionInput),
    livesDecrement: [ObjectTypes.E.chest_treat_gain_life].map(MerkleCodec.conditionInput),
  }


  const transactor = ViemTransactors.create(requestorOptions)
    .method('createGame', initArgs)
    .requireLogs('TranscriptCreated', 'TranscriptMerkleRootSet');

  type CreateGameResult = ParsedLog & {args: {id: BigInt}};

  const created: CreateGameResult = (await transactor.collect([{method: 'createGame', logs: ['TranscriptCreated']}]))[0][0] as CreateGameResult;
  out(JSON.stringify({id: created.args.id.toString()}));
}