import { InvalidArgumentError } from "commander";

export function parseBase10(value: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed))
    throw new InvalidArgumentError("Not a number");
  return parsed;
}