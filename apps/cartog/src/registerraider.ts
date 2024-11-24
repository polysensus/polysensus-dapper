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


export function addRegisterRaiderCommand(program: Command): void {

  const cmd = program
    .command("registerraider")
    .description("create a chaintrap game from a watabou dungeon")

  addOptionsChaintrapRaider(cmd)
    .option("--name <name>", "The raider's name", "alice")
    .action(async (options: ChaintrapRaiderOptions & {name: string}) => {
      await registerRaider(program, options);
    });
}

const out = console.log;

async function registerRaider(program: Command, options: ChaintrapRaiderOptions & {name: string}) {

  out(`@${options.contract}:registerTrailist() ${options.game}`);

  const gid = BigInt(options.game);

  const abi = readJson(options.abi).abi;

  const requestorOptions: RequestorOptionsViem = ViemTransactors.createPrivateKeyOptions(
    options.url, redstone, options.raiderKey, options.contract, abi
  );

  const transactor = ViemTransactors.create(requestorOptions)
    .method('registerTrialist', gid, toHex(options.name))
    .requireLogs('TranscriptRegistration', 'TranscriptParticipantLivesAdded');

  const created = (await transactor.returns('registerTrialist', 'TranscriptRegistration')) as ParsedLog & {args: {id: BigInt}};
  out(created.args.id);
}