import type { Command } from "commander";
import {
  toHex } from 'viem';
import { redstone } from 'viem/chains'

import { ViemTransactors } from "@polysensus-dapper/chappie";
import type { RequestorOptionsViem } from "@polysensus-dapper/chappie";
import { ParsedLog } from "@polysensus-dapper/chappie";

import { readJson } from "./fsutil.js";

import { addOptionsChaintrapRaider } from "./chaintrapoptions.js";
import type { ChaintrapRaiderOptions } from "./chaintrapoptions.js";

import { MerkleCodec } from "@polysensus-dapper/svelte-onepagedungeon";


export function addCommitChoiceCommand(program: Command): void {

  const cmd = program
    .command("commitchoice")
    .description("commit a location choice for a player")

  addOptionsChaintrapRaider(cmd)
    .option("--choice <values...>", "The choice to commit, for example, a side and an exit as two numbers")
    .action(async (options: ChaintrapRaiderOptions & {choice: number[]}) => {
      await commitChoice(program, options);
    });
}

const out = console.log;

async function commitChoice(
  program: Command, options: ChaintrapRaiderOptions & {choice: number[]}) {

  const gid = BigInt(options.game);

  const abi = readJson(options.abi).abi;

  const requestorOptions: RequestorOptionsViem = ViemTransactors.createPrivateKeyOptions(
    options.url, redstone, options.raiderKey, options.contract, abi
  );

  const rootLabel = toHex(options.rootLabel.padStart(32, '0'));
  const input = options.choice.map(Number).map(MerkleCodec.conditionInput);
  const data = "0x";

  const transactor = ViemTransactors.create(requestorOptions)
    .method('transcriptEntryCommit', gid, {rootLabel, input, data})
    .requireLogs(
        "TranscriptEntryCommitted"
      );

  const committed = (await transactor.returns('transcriptEntryCommit', 'TranscriptEntryCommitted')) as ParsedLog & {args: {id: BigInt, eid: BigInt}};
  out(JSON.stringify({id: committed.args.id.toString(), eid: committed.args.eid.toString()}));
}