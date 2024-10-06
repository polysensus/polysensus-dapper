import { MerkleCodec } from "./etherscodec.js";
import type { Hex32 } from "./etherscodec.js";
import type { ChoiceInput } from "../inputtypes.js";
import { ObjectTypes } from "../objecttypes.js";
import { LogicalRef } from "./logicalref.js";
import type { PreparedObject } from "./etherscodec.js";
import type { ConditionedInput, UnconditionedInput } from "../inputtypes.js";

/**
 * TODO:
 * update ObjectType and encode/prepare etc for new ObjectType
 * update LogicalTopology reference stuff for new ObjectType
 *
 */

export class LocationChoices {
  static ObjectType = ObjectTypes.index("location_choices");
  static LOCATION_INPUT = 0;
  static CHOICE_INPUTS = 1;

  location: number;
  sideExits: ChoiceInput[];
  furniture: ChoiceInput[];


  constructor(location: number, sideExits: ChoiceInput[], furniture: ChoiceInput[]) {
    this.location = location;
    this.sideExits = sideExits;
    this.furniture = furniture;
  }

  /**
   * return the input index where the choices start, or return inputs.length if there are none.
   * @returns {number}
   */
  iChoices() {
    return LocationChoices.CHOICE_INPUTS;
  }

  /**
   * @param {number[]} choice
   * @returns {number} matching input index or undefined
   */
  matchInput(choice: number[]) {
    const inputs = this.inputs();
    for (let i = this.iChoices(); i < inputs.length; i++) {
      if (choice.length !== inputs[i].length) continue;

      let matched = 0;
      for (let j = 0; j < choice.length; j++)
        if (choice[j] === inputs[i][j]) matched += 1;
      if (matched === choice.length) return i;
    }
  }

  inputs(): UnconditionedInput {
    let unconditioned = [[this.location], ...this.sideExits];
    if (this.furniture?.length > 0)
      unconditioned = [...unconditioned, ...this.furniture];
    return unconditioned;
  }

  encoded(): ConditionedInput {
    let conditioned = [
      [MerkleCodec.conditionInput(this.location)],
      ...MerkleCodec.conditionInputs(this.sideExits),
    ];
    if (this.furniture?.length > 0)
      conditioned = [...conditioned, ...MerkleCodec.conditionInputs(this.furniture)];
    return conditioned;
  }


  /**
   * @param {{resolveValue(ref:LogicalRef):string|number}} options
   * @returns
   */
  prepare(options): PreparedObject {
    return [LocationChoices.ObjectType, this.encoded()];
  }
}
