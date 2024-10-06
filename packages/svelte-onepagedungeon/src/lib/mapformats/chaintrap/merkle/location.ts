import { namedFlags } from "./namedflags.js";
import type { JSONLocationExits } from "../json/location.js";

export const locationFlags = ["california", "main", "inter"];
export type LocationFlag = (typeof locationFlags)[number];

export class Location {

  // One side for north, west, south, east
  sides: JSONLocationExits;
  flags: Record<LocationFlag, boolean>;

  /**
   * Note that a join can be listed at most *once* in the any single side joins
   * list. Because a single join cannot enter the same room in two different
   * exits. This is why we don't bother encoding the join exit index explicitly.
   * we can always search for it and the N for the search is very small.
   * indexes the joins table for each SIDE. NORTH, WEST, SOUTH, EAST clockwise
   * from TOP
   */
  constructor(sides: JSONLocationExits, flags: Record<LocationFlag, boolean>) {
    /** @readonly*/
    this.sides = sides;
    /** @readonly*/
    this.flags = flags;
  }
}

export namespace LocationFlags {

  /**
   * Calls {@link namedFlags} with the {@link LocationFlags.names}
   * @param {Object.<string, boolean>} flags
   * @returns {Uint8Array}
   */
  export function bytes32(flags) {
    return namedFlags(locationFlags, flags);
  }

  export const enumeration: { [key in LocationFlag]: number } = locationFlags.reduce((acc, type, index) => {
    acc[type as LocationFlag] = index;
    return acc;
  }, {} as { [key in LocationFlag]: number });
  export const E = enumeration;

  export const senumeration: { [key in LocationFlag]: string } = locationFlags.reduce((acc, type, index) => {
    acc[type as LocationFlag] = type;
    return acc;
  }, {} as { [key in LocationFlag]: string });

  export const S = senumeration;


  // Function to get the index corresponding to the LocationFlag
  export function index(type: LocationFlag): number {
    return enumeration[type];
  }
}