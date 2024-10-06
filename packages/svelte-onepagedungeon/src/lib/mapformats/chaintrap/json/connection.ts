import type { Point } from "./point.js";
import type { JSONJoin, JSONJoinSides } from "./join.js";
export type JSONCorridor = {
  comment?: string;
  join_sides: JSONJoinSides;
  joins: JSONJoin;
  points: Point[];
};

// Corridors are really just connections. While the can be generated with
// length, its just easier to represent all areas that can have encounters as
// locations (rooms).
export type JSONConnection = JSONCorridor