export function getAllNames(opts, names) {

  const prefix = opts?.prefix ?? "";
  const group = opts?.group ?? "";
  const fromEnv = opts.env ?? process.env;

  const missing = [];
  const config = {};

  for (const name of names) {
    const value = fromEnv[`${prefix}${name}`];
    if (typeof value === "undefined") {
      missing.push(name);
      continue;
    }

    const parts = name.split("_");
    let titleCased =
      group +
      parts
        .map(
          (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
        )
        .join("");
    if (!group) titleCased.charAt(0).toLowerCase();

    config[titleCased] = value;
  }

  return {
    config,
    missing,
    missingAny: missing.length !== 0 && names.length != 0,
  };
}
