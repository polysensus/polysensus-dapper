import { ethers } from "ethers";
import type { ConditionedInput, UnconditionedInput } from "../inputtypes";

export type BytesLike = ethers.BytesLike;
export type Hex32 = `0x${string & { length: 64 }}`;

export type PreparedObject = [number, BytesLike];

const codec = ethers.AbiCoder.defaultAbiCoder();

export namespace MerkleCodec {

  export const LeafABI = ["uint256 typeId", "bytes32[][] inputs"];

  export function hex32(
    value: string | number | number[] | Uint8Array | BytesLike | Hex32,
    zeroPad: (value: string | Uint8Array, length: number) => string): Hex32 {

    if (value instanceof Uint8Array) {
      return zeroPad(value as Uint8Array, 32) as Hex32;
    }
    if (Array.isArray(value) && typeof value[0] === "number") {
      if (value.length > 32) throw new Error("Value out of range");
      for (let i = 0; i < value.length; i++) {
        if (value[i] as number > 255) throw new Error("Value out of range");
      }
      return zeroPad(new Uint8Array(value as number[]), 32) as Hex32;
    }
    if (typeof value === "number") {
      return zeroPad(ethers.toBeHex(value), 32) as Hex32;
    }
    if (typeof value === "string") {
      // if the value is not even length, we always pad left by one zero character
      if (value.length % 2 !== 0) {
        if (value.startsWith("0x"))
          value = `0x0${value.slice(2)}`;
        else
          value = `0${value.slice(2)}`;
      }
      return zeroPad(value, 32) as Hex32;
    }
    throw new Error("Invalid value type");
  }

  /** pad left (as per solidity value types such as uint128) */
  export function value32(value: string | number | number[] | Uint8Array | BytesLike | Hex32): Hex32 {
    return hex32(value, ethers.zeroPadValue);
  }

  /** like value32 but pad right (as per solidity bytes32) */
  export function bytes32(value: string | number | number[] | Uint8Array | BytesLike | Hex32): Hex32 {
    return hex32(value, ethers.zeroPadBytes);
  }

  /**
   * Compute the merkle node value for the prepared {@link LeafObject}
   * standardLeafHash from https://github.com/OpenZeppelin/merkle-tree/blob/master/src/standard.ts#L9
   */
  export function leafHash(preparedLeaf: PreparedObject): Hex32 {
    return ethers.keccak256(ethers.keccak256(leafEncoded(preparedLeaf))
    ) as Hex32;
  }
  export function leafEncoded(preparedLeaf: PreparedObject): BytesLike {
    return ethers.getBytes(codec.encode(LeafABI, preparedLeaf));
  }

  export function conditionInput(input: number | Hex32): Hex32 {
    return value32(input);
  }

  export function conditionInputs(inputs: ConditionedInput | UnconditionedInput): ConditionedInput {
    return inputs.map((input) => input.map((value) => conditionInput(value)));
  }

  /**assumes numbers are in range for javascript number type */
  export function deconditionInput(value: 'bigint' | string | number | boolean): number {
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') return parseInt(value, 16);
    if (value?.constructor?.name === 'Uint8Array') return Number(BigInt(value));
    return value as number;
  }
}