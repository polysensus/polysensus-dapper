import * as dotenv from "dotenv";
import type { Option, Command, CommandOptions } from "commander";

dotenv.config({ path: process.env.DOTENV_FILE ?? ".env" });

import { program } from "commander";

import { addAnalyzeCommand } from "./analyze.js";

program
  .enablePositionalOptions()
  .option("-v, --verbose", "more verbose reporting")

addAnalyzeCommand(program);

try {
  program.parse();
} catch (err: any) {
  if (err.code === "commander.helpDisplayed") process.exit(1);
  console.log(err);
  process.exit(1);
}