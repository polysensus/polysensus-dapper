import { MerkleCodec } from "./etherscodec.js";
import type { PreparedObject } from "./etherscodec.js";
import { LogicalRef } from "./logicalref.js";
import type { RefResolverOptions } from "./logicalref.js";
import type { ConditionedInput, UnconditionedInput } from "../inputtypes.js";
import { ObjectTypes } from "../objecttypes.js";


/**
 * Encodes the connection between to locations via their respective exits
 * Prepares [LINK, [[REF(#Ea)], [REF(#Eb)]]]
 */
export class LocationLink {
  static ObjectType = ObjectTypes.index("link");

  exitRefA: LogicalRef;
  exitRefB: LogicalRef;

  constructor(exitRefA: LogicalRef, exitRefB: LogicalRef) {
    this.exitRefA = exitRefA;
    this.exitRefB = exitRefB;
  }

  inputs(options: RefResolverOptions): UnconditionedInput {

    const a = options.resolveValue(this.exitRefA) as number;
    const b = options.resolveValue(this.exitRefB) as number;
    return [[a], [b]];
  }

  encoded(options: RefResolverOptions): ConditionedInput {

    const a = MerkleCodec.conditionInput(options.resolveValue(this.exitRefA) as number);
    const b = MerkleCodec.conditionInput(options.resolveValue(this.exitRefB) as number);
    return [[a], [b]];
  }

  prepare(options: RefResolverOptions): PreparedObject {
    return [LocationLink.ObjectType, this.encoded(options)];
  }
}
