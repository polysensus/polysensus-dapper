import { describe, it, expect } from 'vitest';
import { chainIdFromHex } from './chainidhex.js';

describe('chainIdFromHex', () => {
	it('should convert a valid hex string to a number', () => {
		expect(chainIdFromHex('0x1')).toBe(1);
		expect(chainIdFromHex('0x10')).toBe(16);
		expect(chainIdFromHex('0x0')).toBe(0);
	});

	it('should handle hex strings without the 0x prefix', () => {
		expect(chainIdFromHex('1')).toBe(1);
		expect(chainIdFromHex('10')).toBe(16);
		expect(chainIdFromHex('0')).toBe(0);
	});

	it('should handle empty strings by returning 0', () => {
		expect(chainIdFromHex('')).toBe(0);
	});

	it('should throw an error for invalid hex strings', () => {
		expect(() => chainIdFromHex('0xG')).toThrow('invalid hex chainId: 0xG');
		expect(() => chainIdFromHex('xyz')).toThrow('invalid hex chainId: xyz');
	});
});
