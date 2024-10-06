import { describe, it, expect } from 'vitest';
import { ethers } from 'ethers';
import { MerkleCodec } from './etherscodec.js';
describe('MerkleCodec.value32', () => {
  it('should pad a number to 32 bytes', () => {
    const value = 123;
    const result = MerkleCodec.value32(value);
    expect(result).toBe("0x000000000000000000000000000000000000000000000000000000000000007b");
  });

  it('should pad a string to 32 bytes', () => {
    const value = '0x123';
    const result = MerkleCodec.value32(value);
    expect(result).toBe("0x0000000000000000000000000000000000000000000000000000000000000123");
  });

  it('should pad a Uint8Array to 32 bytes', () => {
    const value = new Uint8Array([1, 2, 3]);
    const result = MerkleCodec.value32(value);
    expect(result).toBe(ethers.zeroPadValue(value, 32));
  });

  it('should pad a number array to 32 bytes', () => {
    const value = [1, 2, 3];
    const result = MerkleCodec.value32(value);
    expect(result).toBe(ethers.zeroPadValue(new Uint8Array(value), 32));
  });

  it('should return the same Hex32 value if already 32 bytes', () => {
    const value = '0x' + '0'.repeat(64);
    const result = MerkleCodec.value32(value);
    expect(result).toBe(value);
  });

  it('should throw an error for invalid value type', () => {
    expect(() => MerkleCodec.value32({} as any)).toThrow('Invalid value type');
  });
});

describe('MerkleCodec.bytes32', () => {
  it('should pad a number to 32 bytes', () => {
    const value = 123;
    const result = MerkleCodec.bytes32(value);
    expect(result).toBe("0x7b" + "0".repeat(62));
  });

  it('should pad a string to 32 bytes', () => {
    const value = '0x123';
    const result = MerkleCodec.bytes32(value);
    expect(result).toBe("0x0123" + "0".repeat(60));
  });

  it('should pad a Uint8Array to 32 bytes', () => {
    const value = new Uint8Array([1, 2, 3]);
    const result = MerkleCodec.bytes32(value);
    expect(result).toBe(ethers.zeroPadBytes(value, 32));
  });

  it('should pad a number array to 32 bytes', () => {
    const value = [1, 2, 3];
    const result = MerkleCodec.bytes32(value);
    expect(result).toBe(ethers.zeroPadBytes(new Uint8Array(value), 32));
  });

  it('should return the same Hex32 value if already 32 bytes', () => {
    const value = '0x' + '0'.repeat(64);
    const result = MerkleCodec.bytes32(value);
    expect(result).toBe(value);
  });

  it('should throw an error for invalid value type', () => {
    expect(() => MerkleCodec.bytes32({} as any)).toThrow('Invalid value type');
  });
});

