export type EnvConfigLike = {
	[key: string]: string;
};

export function fromPrefixedEnv(prefix: string, env: EnvConfigLike): EnvConfigLike {
	const cfg: EnvConfigLike = {};
	for (const key in env) {
		if (env.hasOwnProperty(key) && key.startsWith(prefix)) {
			const configName = toTitleCase(key.slice(prefix.length));
			cfg[configName] = env[key];
		}
	}
	return cfg;
}

export function toTitleCase(value: string, group?: string): string {
	const parts = value.split('_');
	let titleCased =
		group ??
		'' + parts.map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()).join('');
	if (!group) titleCased = titleCased.charAt(0).toLowerCase() + titleCased.slice(1);
	return titleCased;
}
