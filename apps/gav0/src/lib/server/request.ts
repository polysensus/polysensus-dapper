import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export type NamedConfig = {
	name: string;
};

export function requireChainEnv(chainCfg: NamedConfig, name: string): string {
	const prefix = toUpperCaseWords(chainCfg.name);
	return requireEnv(`PUBLIC_${prefix}_${name}`);
}

export function requireEnv(name: string): string {
	const value = env[name];
	if (!value) {
		throw error(400, { message: `env value not found (or empty) for ${name}` });
	}
	return value;
}

export function requireSecret(name: string): string {
	const value = secrets[name];
	if (!value) {
		throw error(400, { message: `secret value not found (or empty) for ${name}` });
	}
	return value;
}

export function requireParam(url: URL, name: string): string {
	const value = url.searchParams.get(name);
	if (!value) {
		throw error(404, { message: `${name} is a required query parameter` });
	}
	return value;
}

interface RequestOptions extends RequestInit {
	headers?: Headers;
}

export function deriveOptions(
	request: RequestOptions | undefined,
	updateOptions: RequestOptions | undefined
): RequestOptions {
	const options: RequestOptions | any = {};

	for (const key of [
		'method',
		'mode',
		'credentials',
		'cache',
		'redirect',
		'referrer',
		'referrerPolicy',
		'integrity',
		'keepalive',
		'signal'
	] as const) {
		if (typeof request?.[key] !== 'undefined') {
			options[key] = request[key];
		}
	}

	if (typeof request?.headers !== 'undefined') {
		options.headers = new Headers(request.headers);
	}

	if (typeof updateOptions?.headers !== 'undefined') {
		if (typeof options.headers === 'undefined') {
			options.headers = new Headers(updateOptions.headers);
		} else {
			for (const [name, value] of updateOptions.headers) {
				options.headers.append(name, value);
			}
		}
	}

	return { ...options, ...updateOptions };
}

export function json(data: any): Response {
	const response = new Response(JSON.stringify(data), {
		status: 200,
		statusText: 'OK',
		headers: new Headers([['content-type', 'application/json']])
	});
	return response;
}

function toUpperCaseWords(str: string): string {
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
