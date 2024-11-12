import type { Command } from "commander";
import { InvalidArgumentError, Option } from "commander";
import { privateKeyToAccount } from 'viem/accounts';
import {
  createPublicClient, createWalletClient, parseEventLogs, http, toHex } from 'viem';
import type { TransactionReceipt, Log } from "viem";
import { redstone } from 'viem/chains'

import {
  parseDungeon, MerkleCodec, ObjectTypes,
} from "@polysensus-dapper/svelte-onepagedungeon"

import { readJson } from "./fsutil.js";

import { createTopology } from "./createtopology.js";
import { DungeonOptions, dungeonName, resolveSeed, loadJsonDugeon } from "./jsondungeon.js";

import { Transactor } from "./transactor/transactor.js";
import { RequestorOptions } from "./transactor/options.js";
import { TransactResult } from "./transactor/result.js";
import { ParsedLog } from "./transactor/parsedlog.js";

type CreateGameOptions = {
  url: string
  abi: string
  contract: `0x${string}`
  narratorKey: `0x${string}`
};
type Options = DungeonOptions & CreateGameOptions;

function parseBase10(value: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed))
    throw new InvalidArgumentError("Not a number");
  return parsed;
}

export function addCreateGameCommand(program: Command): void {
  program
    .command("creategame")
    .description("create a chaintrap game from a watabou dungeon")
    .addOption(new Option("-u, --url <url>", "The URL for the chain").default("http://127.0.0.1:8545").env("RPC_URL"))
    .addOption(new Option("-C, --contract <contract>", "The address of the contract").env("CHAINTRAP_ADDRESS"))
    .addOption(new Option("--narrator-key <narratorkey>", "Private Key").env("NARATOR_KEY"))
    .option("--abi <abi>", "The ABI file to use", "abi.json")
    .option("-f, --file <file>", "The JSON file to analyze")
    .option("-S, --seeds <seeds>", "A file with seedes for each known title")
    .option("-s, --seed <seed>", "An explicit seed for the random number generator", parseBase10)
    .option("-o, --output <output>", "The output directory", "./dungeon/<name>/tiles")
    .action(async (options: Options) => {
      await createGame(program, options);
    });
}

const out = console.log;
let vout = (...args: any[]) => { };

function buildTree(options: Options) {
  const watabouJson = loadJsonDugeon(options.file);
  const name = dungeonName(watabouJson);
  const outputDir = options.output.replace("<name>", name);
  const seed = resolveSeed(options, watabouJson);
  const dungeon = parseDungeon(seed, watabouJson);
  const s = JSON.stringify(dungeon, null, '  ')
  const topo = createTopology(dungeon, name);
  return topo.commit();
}

async function methodCaller(method: string, ...args: any): Promise<TransactionReceipt> {
  /*
      const { request } = await reader.simulateContract({
        account: account,
        address: options.contract,
        abi: abi,
        functionName: method,
        args: args,
      });
      const hash = await signer.writeContract(request);
      return await reader.getTransactionReceipt({ hash });
  */
  return {} as TransactionReceipt;
}


async function createGame(program: Command, options: Options) {

  out(`@${options.contract}:createGame() ${options.file}`);

  if (!options.output)
    throw new Error("Output directory not specified");
  const tree = buildTree(options);

  const abi = readJson(options.abi).abi;
  const account = privateKeyToAccount(options.narratorKey);
  const reader = createPublicClient({
    chain: redstone,
    transport: http(options.url),
  });
  const signer = createWalletClient({
    account,
    chain: redstone,
    transport: http(options.url),
  });

  const requestorOptions: RequestorOptions<TransactionReceipt> = {
    //logParser: (receipt) => ({ receipt, names: [], events: {} }),
    logParser: (receipt) => {
      const logs = parseEventLogs({abi, logs: (receipt as TransactionReceipt).logs});
      const parsed: ParsedLog[] = [];
      for (const log of logs) {
        const log2 = log as unknown as ParsedLog;
        parsed.push({...log2, signature: log.topics[0] ?? ""});
      }
      return parsed;
    },
    methodCaller: async <T>(method: string, ...args: any): Promise<T> => {
      const { request } = await reader.simulateContract({
        account: account,
        address: options.contract,
        abi: abi,
        functionName: method,
        args: args,
      });
      const hash = await signer.writeContract(request);
      const receipt = await reader.getTransactionReceipt({ hash });
      return receipt as T;
    }
  }

  const initArgs = {
    tokenURI: "https://chaintrap.polysensus.io/dungeon/{id}",
    registrationLimit: 2,
    trialistArgs: {flags: 0, lives:2},
    rootLabels:[toHex("chaintrap-dungeon:static".padStart(32, '0'))],
    roots: [tree.root],
    choiceInputTypes: [ObjectTypes.E.location_choices].map(MerkleCodec.conditionInput),
    transitionTypes: [ObjectTypes.E.link, ObjectTypes.E.finish].map(MerkleCodec.conditionInput),
    victoryTransitionTypes: [ObjectTypes.E.finish].map(MerkleCodec.conditionInput),
    haltParticipantTransitionTypes: [ObjectTypes.E.fatal_chest_trap].map(MerkleCodec.conditionInput),
    livesIncrement: [ObjectTypes.E.chest_treat_gain_life].map(MerkleCodec.conditionInput),
    livesDecrement: [ObjectTypes.E.chest_treat_gain_life].map(MerkleCodec.conditionInput),
  }


  const transactor = new Transactor<TransactionReceipt>(requestorOptions)
    .method('createGame', initArgs)
    .requireLogs('TranscriptCreated', 'TranscriptMerkleRootSet');


  for await (const r of transactor.transact()) {
    for (const log of r.ordered) {
      out(log.eventName);
    }
  }
}