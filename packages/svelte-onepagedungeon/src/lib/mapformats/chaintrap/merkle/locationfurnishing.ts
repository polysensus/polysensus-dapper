/**
 * Encodes the chests available to the location menu. These form the
 * basis of the location chest based traps and treats
 */

import { MerkleCodec } from "./etherscodec.js";
import type { PreparedObject } from "./etherscodec.js";
import { LogicalRef } from "./logicalref.js";
import type { JSONLocationItem } from "../json/locationitem.js";
import type { RefResolverOptions } from "./logicalref.js";
import type { ConditionedInput, UnconditionedInput } from "../inputtypes.js";
import { LocationChoiceTypes } from "../inputtypes.js";
import { ObjectTypes } from "../objecttypes.js";

/**
 * [FURNITURE-TYPE, [[CHOICE-TYPE], [REF(#L, i)]]]
 */
export class LocationFurnishing {
  // static ObjectType = ObjectType.Chest;
  furn: JSONLocationItem;
  inputRef: LogicalRef;

  constructor(furn: JSONLocationItem, inputRef: LogicalRef) {
    this.furn = furn;
    this.inputRef = inputRef;
  }

  inputs(options: RefResolverOptions): UnconditionedInput {
    return [[LocationChoiceTypes.index(this.furn.choiceType)], options.resolveValue(this.inputRef) as number[]];
  }

  encoded(options: RefResolverOptions): ConditionedInput {

    const inputs = [[LocationChoiceTypes.index(this.furn.choiceType)], options.resolveValue(this.inputRef) as number[]];
    return MerkleCodec.conditionInputs(inputs);
  }

  /**
   * @param {{resolveValue(ref:LogicalRef):string|number}} options
   * @returns
   */
  prepare(options): PreparedObject {
    return [ObjectTypes.index(this.furn.type), this.encoded(options)];
  }
}
