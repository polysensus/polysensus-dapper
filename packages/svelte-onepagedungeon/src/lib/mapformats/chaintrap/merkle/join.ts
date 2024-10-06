import type { JSONJoin, JSONJoinSides } from "../json/join.js"

export class Join {

  joins: JSONJoin;
  sides: JSONJoinSides;
  flags: Record<string, boolean>;
  /**
   * @param joins pair of location indices in a LogicalTopology, representing a connection (join) of those two locations.
   * @param sides a side index, associated with each location in joins. The join for location joins[0], is attached to the location on sides[0].
   * @param flags
   */
  constructor(joins: JSONJoin, sides: JSONJoinSides, flags: Record<string, boolean>) {
    /** @readonly */
    this.joins = [...joins];
    /** @readonly */
    this.sides = [...sides];
    /** @readonly */
    this.flags = { ...flags };
  }
}
