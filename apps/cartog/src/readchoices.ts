import type { Command } from "commander";
import {
  toHex
} from 'viem';
import {
  redstone
} from 'viem/chains';

import {
  createPublicClient,
  http,
  parseEventLogs,
  getAbiItem,
  AbiEvent
} from 'viem'
import {
  privateKeyToAccount
} from "viem/accounts";

import {
  MerkleCodec,
} from "@polysensus-dapper/svelte-onepagedungeon";

import {
  readJson
} from "./fsutil.js";

import {
  addOptionsChaintrapRaider
} from "./chaintrapoptions.js";
import type {
  ChaintrapRaiderOptions
} from "./chaintrapoptions.js";


export function addReadChoicesCommand(program: Command): void {

  const cmd = program
    .command("readchoices")
    .description("Read the available choices for a player")

  addOptionsChaintrapRaider(cmd)
    // .option("--name <name>", "The raider's name", "alice")
    .action(async (options: ChaintrapRaiderOptions) => {
      await readChoices(program, options);
    });
}

const out = console.log;

export type TranscriptChoices = {
  typeId: BigInt;
  inputs: `0x${string}`[][];
}

export type TranscriptEntryChoices = {
  id: BigInt;
  eid: BigInt;
  data: `0x${string}`;
  participant: string;
  choices: TranscriptChoices;
}

async function readChoices(program: Command, options: ChaintrapRaiderOptions) {

  const abi = readJson(options.abi).abi;
  // For the address.
  const account = privateKeyToAccount(options.raiderKey);

  const eventABI = getAbiItem({
    abi,
    name: 'TranscriptEntryChoices'
  }) as AbiEvent;

  const client = createPublicClient({
    chain: redstone,
    transport: http(options.url)
  })

  const gid = BigInt(options.game);
  const raw = await client.getLogs({
    address: options.contract,
    event: eventABI,
    args: {
      id: gid,
      participant: account.address
    },
    // fromBlock: 10136164n,
  });


  const logs = parseEventLogs({
    abi,
    logs: raw
  }) as unknown as {
    args: TranscriptEntryChoices
  }[];

  // Sort by descending event id.
  logs.sort((a, b) => (a.args.eid > b.args.eid ? -1 : a.args.eid == b.args.eid ? 0 : 1));

  if (logs.length === 0) {
    out("{}");
    return;
  }
  const inputs: number[][] = [];
  for (const choice of logs[0].args.choices.inputs) {
    inputs.push(choice.map(MerkleCodec.deconditionInput))
  }
  out(JSON.stringify( {id: gid.toString, eid: logs[0].args.eid.toString(), participant: logs[0].args.participant,data: logs[0].args.data, inputs}));
}