import * as dotenv from "dotenv";

dotenv.config({ path: process.env.DOTENV_FILE ?? ".env" });

import { program } from "commander";

import { addExplodeCommand } from "./explodesvg.js";
import { addMerklizeCommand } from "./merkleize.js";
import { addCreateGameCommand } from "./creategame.js";

program
  .enablePositionalOptions()
  .option("-v, --verbose", "more verbose reporting")

addExplodeCommand(program);
addMerklizeCommand(program);
addCreateGameCommand(program);

try {
  program.parse();
} catch (err: any) {
  if (err.code === "commander.helpDisplayed") process.exit(1);
  console.log(err);
  process.exit(1);
}