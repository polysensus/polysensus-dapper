import { fromPrefixedEnv } from './fromenv.ts';
import { describe, it, expect } from 'vitest';

describe('fromPrefixedEnv', () => {
	it('should return environment variables with the specified prefix', () => {
		const env = {
			TEST_PREFIX_VAR1: 'value1',
			TEST_PREFIX_VAR2: 'value2'
		};

		const result = fromPrefixedEnv('TEST_PREFIX_', env);
		expect(result).toEqual({
			var1: 'value1',
			var2: 'value2'
		});
	});

	it('should return environment variables with camel cased names', () => {
		const env = {
			TEST_PREFIX_THE_VAR1: 'value1',
			TEST_PREFIX_OTHER_LONG_VAR2: 'value2'
		};

		const result = fromPrefixedEnv('TEST_PREFIX_', env);
		expect(result).toEqual({
			theVar1: 'value1',
			otherLongVar2: 'value2'
		});
	});

	it('should return an empty object if no environment variables match the prefix', () => {
		const env = {
			OTHER_PREFIX_VAR1: 'value1',
			OTHER_PREFIX_VAR2: 'value2'
		};

		const result = fromPrefixedEnv('NON_EXISTENT_PREFIX_', env);
		expect(result).toEqual({});
	});

	it('should handle an empty prefix correctly', () => {
		const env = {
			var1: 'value1',
			var2: 'value2'
		};

		const result = fromPrefixedEnv('', env);
		expect(result).toEqual({
			var1: 'value1',
			var2: 'value2'
		});
	});

	it('should handle environment variables with similar prefixes correctly', () => {
		const env = {
			TEST_PREFIX_VAR1: 'value1',
			TEST_VAR2: 'value2'
		};

		const result = fromPrefixedEnv('TEST_PREFIX_', env);
		expect(result).toEqual({
			var1: 'value1'
		});
	});
});
