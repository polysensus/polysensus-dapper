import type { Hex32 } from './merkle/etherscodec.js';
export type ChoiceInput = [number, number];
export type ConditionedInput = Hex32[][];
export type UnconditionedInput = number[][];

/*
 LocationChoices have at leat 4 choice menus.
 
 The first four are the 'side' menues representing the 4 sides of each location
 and the exits available on each respective side.

 Subsequent menus are identified by the following constants.
 */
export const locationChoiceTypes = ['north', 'east', 'south', 'west', 'open_chest', 'search', 'finish_exit']
export type LocationChoiceType = (typeof locationChoiceTypes)[number];

export namespace LocationChoiceTypes {
  // Dynamically generate the mapping object for ObjectType to number
  export const enumeration: { [key in LocationChoiceType]: number } = locationChoiceTypes.reduce((acc, type, index) => {
    acc[type as LocationChoiceType] = index;
    return acc;
  }, {} as { [key in LocationChoiceType]: number });
  export const E = enumeration;

  export const senumeration: { [key in LocationChoiceType]: string } = locationChoiceTypes.reduce((acc, type, index) => {
    acc[type as LocationChoiceType] = type;
    return acc;
  }, {} as { [key in LocationChoiceType]: string });
  export const S = senumeration;


  // Function to get the index corresponding to the ObjectType
  export function index(type: LocationChoiceType): number {
    const n = enumeration[type];
    if (typeof n === 'undefined') {
      throw new Error(`LocationChoiceType ${type} is not defined`);
    }
    return n;
  }
}
/*
export class LocationChoiceTypex {
  // For consistency, represent the sides as choice types also
  static North = 0;
  static West = 1;
  static South = 2;
  static East = 3;
  static LastSideChoice = 3;

  // Each menu entry identifies a chest that can be opened at this location.
  // The consequences of opening are not inferable from the id.
  static OpenChest = 4;
}*/