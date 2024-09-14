import type { Option, Command } from "commander";
import { InvalidArgumentError } from "commander";
import { JSDOM } from "jsdom";
import { DOMImplementation, XMLSerializer } from "xmldom";

import type { Dungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import { parseDungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import type { JsonDungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import { getDungeonPathElements } from "@polysensus-dapper/svelte-onepagedungeon";
import { getTileSVGString } from "@polysensus-dapper/svelte-onepagedungeon";
import { svgPlainify } from "@polysensus-dapper/svelte-onepagedungeon";

import { readJson, readText, writeSVGTile, writeTextFile } from "./fsutil.js";

function parseBase10(value: string, previous: string | number | undefined): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

type Options = { file: string, seeds: string, seed: number, output: string };

export function addAnalyzeCommand(program: Command): void {
  program
    .command("analyze")
    .description("Analyze a dungeon JSON file")
    .option("-f, --file <file>", "The JSON file to analyze")
    .option("-S, --seeds <seeds>", "A file with seedes for each known title")
    .option("-s, --seed <seed>", "An explicit seed for the random number generator", parseBase10)
    .option("-o, --output <output>", "The output directory", "./dungeon/<name>/tiles")
    .action((options: Options) => {
      analyze(program, options);
    });
}

const out = console.log;
let vout = (...args: any[]) => { };

async function analyze(program: Command, options: Options) {
  out(`Analyzing file: ${options.file}`);
  if (!options.output)
    throw new Error("Output directory not specified");

  const jsonDungeon = loadJsonFile(options.file);
  vout(JSON.stringify(jsonDungeon, null, '  '));
  const name = dungeonName(jsonDungeon);
  const outputDir = options.output.replace("<name>", name);

  // The actual svg file name is derived from the json file name
  const dom = svgDOM(options.file);
  const document = dom.window.document;
  const svg: SVGElement | null = dom.window.document.querySelector("svg");
  if (!svg) throw new Error(`No SVG found in file ${options.file}`);
  svgPlainify(svg);
  const svgDungeonElements = getDungeonPathElements(svg);

  const serializer = new XMLSerializer();
  writeTextFile(outputDir + `/${name}.svg`, serializer.serializeToString(svg));
  svgDungeonElements.forEach((element: SVGPathElement, index: number) => {
    const tileSVG = getTileSVGString(document, element, index, { margin: 10 });
    // Serialize the SVG document to a string
    const svgData = serializer.serializeToString(tileSVG);
    // Add XML declaration
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
    writeSVGTile(outputDir, index, xmlDeclaration + svgData);
  });

  // const jsonDungeon = loadJsonFile(options.file);
  // const seed = resolveSeed(options, jsonDungeon);
  // const dungeon = parseDungeon(seed, jsonDungeon);
}

function loadJsonFile(file: string): JsonDungeon {
  return readJson(file);
}

function svgDOM(file: string): JSDOM {
  file = file.replace(/\.json$/, ".svg");
  return new JSDOM(readText(file), { contentType: "image/svg+xml" })
}

function dungeonName(dungeon: JsonDungeon): string {
  return dungeon.title.toLowerCase().replace(/ /g, "_");
}

function resolveSeed(options: Options, dungeon: JsonDungeon): number {

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