import type { Command } from "commander";
import {
  toHex } from 'viem';
import { redstone } from 'viem/chains'

import { ViemTransactors } from "@polysensus-dapper/chappie";
import type { RequestorOptionsViem } from "@polysensus-dapper/chappie";
import { ParsedLog } from "@polysensus-dapper/chappie";

import { readJson } from "./fsutil.js";


import { addOptionsChaintrapNarrator } from "./chaintrapoptions.js";
import type { ChaintrapNarratorOptions } from "./chaintrapoptions.js";
import { loadTopology } from "./createtopology.js";
import { LogicalTopology } from "@polysensus-dapper/svelte-onepagedungeon";


export function addStartGameCommand(program: Command): void {

  const cmd = program
    .command("startgame")
    .description("start a chaintrap game")

  addOptionsChaintrapNarrator(cmd)
    .option("--start <starts...>", "Start locations for each player. Ordered by registration order")
    .action(async (options: ChaintrapNarratorOptions & {start: number[]}) => {
      await startGame(program, options);
    });
}

const out = console.log;

async function startGame(program: Command, options: ChaintrapNarratorOptions & {start: number[]}) {

  out(`@${options.contract}:startGame() ${options.game}`);

  const gid = BigInt(options.game);

  const topo = loadTopology(options);
  const tree = topo.commit();

  const startChoices = [];
  const proofs = [];
  const data = [];
  for (let itrialist = 0; itrialist < options.start.length; itrialist++) {
    const { choices, proof } = locationChoices(topo, options.start[itrialist]);
    data.push("0x");
    startChoices.push(choices);
    proofs.push(proof);
  }

  const abi = readJson(options.abi).abi;

  const requestorOptions: RequestorOptionsViem = ViemTransactors.createPrivateKeyOptions(
    options.url, redstone, options.narratorKey, options.contract, abi
  );

  const transactor = ViemTransactors.create(requestorOptions)
    .method('startTranscript', gid, {
      rootLabel: toHex(options.rootLabel.padStart(32, '0')),
      choices:startChoices, data, proofs,
    })
    .requireLogs('TranscriptStarted', 'TranscriptEntryChoices');

  const result = (await transactor.returns('startTranscript', 'TranscriptStarted')) as ParsedLog & {args: {id: BigInt}};
  out(result.args.id);
}

export function locationChoices(topo: LogicalTopology, id: number) {
    const [typeId, inputs] = topo.locationChoicesPrepared[id];
    const proof = topo.locationChoicesProof[id];
    return {
      choices: { typeId, inputs },
      proof,
    };
}