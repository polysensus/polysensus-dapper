/**
 * facilitates merkle nodes which encode references between nodes
 */

import type { Hex32 } from "./etherscodec.js";
import type { ObjectType } from "../objecttypes.js";

export const logicalRefTypes = ["proof", "proof_input"];
export type LogicalRefType = (typeof logicalRefTypes)[number];

export type LogicalRefValue = Hex32 | Hex32[] | number | number[];

export type LogicalRefResolver = (ref: LogicalRef) => LogicalRefValue;

export type RefResolverOptions = { resolveValue: LogicalRefResolver };

export class LogicalRef {

  type: LogicalRefType;
  targetType: ObjectType;
  id: number; // id identifies the targeted object, typically just an array index.
  index?: number; // index identifies the input contribution to the targeted object.

  constructor(type: LogicalRefType, targetType: ObjectType, id: number, index?: number | undefined) {
    /**
     * The type of the reference.
     */
    this.type = type;
    this.targetType = targetType;
    // target item id, used for both Proof & ProofInput references
    this.id = id;
    // only used for ProofInput type
    this.index = index;
  }
}

export namespace LogicalRefs {
  // Dynamically generate the mapping object for LogicalRefType to number
  export const enumeration: { [key in LogicalRefType]: number } = logicalRefTypes.reduce((acc, type, index) => {
    acc[type as LogicalRefType] = index;
    return acc;
  }, {} as { [key in LogicalRefType]: number });
  export const E = enumeration;

  // Function to get the index corresponding to the LogicalRefType
  export function index(type: LogicalRefType): number {
    return enumeration[type];
  }
}
