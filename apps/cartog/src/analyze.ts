import type { Option, Command } from "commander";
import { InvalidArgumentError } from "commander";
import { JSDOM } from "jsdom";
import path from "path";
import { DOMImplementation, XMLSerializer } from "xmldom";

import type { Dungeon } from "@polysensus-dapper/svelte-onepagedungeon";
import { SVGDungeonLayer } from "@polysensus-dapper/svelte-onepagedungeon";
import type { JsonDungeon } from "@polysensus-dapper/svelte-onepagedungeon";
// import { svgPlainify, svgEmptyDungeonClone, svgDungeonInsert } from "@polysensus-dapper/svelte-onepagedungeon";
import { SVGDungeon, SVGDungeonModel, SVGDungeonPlain, SVGNodeFactory } from "@polysensus-dapper/svelte-onepagedungeon";
import { SVGLayerId } from "@polysensus-dapper/svelte-onepagedungeon";
// import type { SVGLayerId } from "@polysensus-dapper/svelte-onepagedungeon";

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
  const serializer = new XMLSerializer();

  // The actual svg file name is derived from the json file name
  const dom = svgDOM(options.file);
  const document = dom.window.document;
  const model = new SVGDungeonModel(svgDOM(options.file).window.document);
  console.log(`Room count: ${model.locationCount}`)
  const plain = new SVGDungeonPlain(svgDOM(options.file).window.document)
  const factory = new SVGNodeFactory(svgDOM(options.file).window.document)

  writeTextFile(path.dirname(outputDir) + `/${name}.plain.svg`, serializer.serializeToString(plain.svg));
  writeTextFile(path.dirname(outputDir) + `/${name}.orig.svg`, serializer.serializeToString(model.svg));

  for (let i = 0; i < model.locationCount; i++) {
    const root = factory.wrapGeometry(model.getLocation(i));
    writeSVGTile(outputDir, i, serializer.serializeToString(root));
  }



  for (let i = SVGLayerId.Hatching; i < SVGLayerId.LastLayer; i++) {
    const paths = SVGDungeonLayer.selectPaths(model.svg, i);
    console.log(`${SVGDungeonLayer.name(i)}: path count: ${paths.length}`);
    const root = factory.wrapGeometry(SVGDungeon.groupPath(document, paths));
    const layer = SVGLayerId[i].toLowerCase();
    writeTextFile(path.dirname(outputDir) + `/${name}.${layer}.svg`, serializer.serializeToString(root));
  }
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

/*
  // g1 is hatching
  // g2 is outline
  // g3 is floor grid
  // g4 is clip path (invisible ?) 
  // g6 is corner details
  // g7 is floor furniture (chests, etc)
  // g8 is very faint room outline
  // g9 is doors and stairs
  const trims: { [key: string]: number } = {
    hatching: 2,
    outline: 2,
    grid: 2,
    clippath: 3,
    cornerDetails: 2,
    furniture: 2,
    faintOutline: 2,
    exits: 2,
  }

  const layers: { [key: string]: SVGElement } = {};
  const pathLayers: { [key: string]: SVGPathElement[] } = {};
  for (let i = SVGLayerId.Hatching; i < SVGLayerId.LastLayer; i++) {
    const name = SVGLayerId[i].toLowerCase();
    layers[name] = SVGDungeonLayer.select(svg, i);
    const paths = SVGDungeonLayer.selectPaths(svg, i);
    pathLayers[name] = paths.slice(trims[name]);
    console.log(`Layer paths: ${paths.length} ${pathLayers[name].length} ${SVGLayerId[i].toLowerCase()}`);
  }

*/