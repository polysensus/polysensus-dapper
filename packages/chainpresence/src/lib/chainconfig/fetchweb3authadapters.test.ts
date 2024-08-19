import { fetchWeb3AdapterOptions } from './fetchweb3authadapters.js';
import { describe, it, expect, vi } from 'vitest';
// import { Response } from 'node-fetch';

describe('fetchWeb3AdapterOptions', () => {
	it('should return valid adapter options for valid fetch implementation and paths', async () => {
		const mockFetch = vi.fn(async (url) => {
			return new Response(JSON.stringify({ data: `data from ${url}` }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		});

		const paths = ['path1', 'path2'];

		const result = await fetchWeb3AdapterOptions(mockFetch, paths);
		expect(result).toEqual([{ data: 'data from path1' }, { data: 'data from path2' }]);
	});

	it('should handle invalid fetch implementation gracefully', async () => {
		const mockFetch = vi.fn(async () => {
			return new Response(null, { status: 500, statusText: 'Fetch error' });
		});

		const paths = ['path1', 'path2'];

		try {
			await fetchWeb3AdapterOptions(mockFetch, paths);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Failed to fetch path1: Fetch error');
		}
	});

	it('should handle an empty list of paths correctly', async () => {
		const mockFetch = vi.fn();

		const paths = [];

		const result = await fetchWeb3AdapterOptions(mockFetch, paths);
		expect(result).toEqual([]);
	});

	it('should handle a mix of valid and invalid paths', async () => {
		const mockFetch = vi.fn(async (url) => {
			if (url === 'invalidPath') {
				return new Response(null, { status: 500, statusText: 'Fetch error' });
			}
			return new Response(JSON.stringify({ data: `data from ${url}` }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		});

		const paths = ['validPath', 'invalidPath'];

		try {
			await fetchWeb3AdapterOptions(mockFetch, paths);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Failed to fetch invalidPath: Fetch error');
		}
	});
});
