import * as dotenv from "dotenv";

dotenv.config({ path: process.env.DOTENV_FILE ?? ".env" });

import { program } from "commander";


program
  .enablePositionalOptions()
  .option("-v, --verbose", "more verbose reporting")

import { addExplodeCommand } from "./explodesvg.js";
import { addMerklizeCommand } from "./merkleize.js";
import { addCreateGameCommand } from "./creategame.js";
import { addRegisterRaiderCommand } from "./registerraider.js";
import { addStartGameCommand } from "./startgame.js";
import { addReadChoicesCommand } from "./readchoices.js";
import { addCommitChoiceCommand } from "./commitchoice.js";

addExplodeCommand(program);
addMerklizeCommand(program);

addCreateGameCommand(program);
addRegisterRaiderCommand(program);
addStartGameCommand(program);
addReadChoicesCommand(program);
addCommitChoiceCommand(program);

try {
  program.parse();
} catch (err: any) {
  if (err.code === "commander.helpDisplayed") process.exit(1);
  console.log(err);
  process.exit(1);
}