/**
 * Encodes the exits available to the location scene exit menu. These form the
 * basis of the location links.
 */

import { MerkleCodec } from "./etherscodec.js";
import type { Hex32, PreparedObject } from "./etherscodec.js";
import { ObjectTypes } from "../objecttypes.js";
import { LogicalRef } from "./logicalref.js";
import type { RefResolverOptions } from "./logicalref.js";
import type { ConditionedInput, UnconditionedInput } from "../inputtypes.js";

/**
 * [EXIT, [[REF(#L, i)]]]
 */
export class LocationExit {
  static ObjectType = ObjectTypes.index("exit");
  locationExitRef: LogicalRef;

  constructor(locationExitRef: LogicalRef) {
    this.locationExitRef = locationExitRef;
  }

  inputs(options: RefResolverOptions): UnconditionedInput {
    const locationExit = options.resolveValue(this.locationExitRef);
    return [locationExit as number[]];
  }

  encoded(options: RefResolverOptions): ConditionedInput {
    const locationExit = options.resolveValue(this.locationExitRef);
    return [(locationExit as number[]).map((i) => MerkleCodec.conditionInput(i))];
  }

  /**
   * @param {{resolveValue(ref:LogicalRef):string|number}} options
   * @returns
   */
  prepare(options: RefResolverOptions): PreparedObject {
    return [LocationExit.ObjectType, this.encoded(options)];
  }
}
