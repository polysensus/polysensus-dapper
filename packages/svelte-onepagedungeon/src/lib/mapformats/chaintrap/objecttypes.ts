export const objectTypes = [
  'invalid',
  'resterved1', 'resterved2', 'resterved3', 'resterved4', 'resterved5',
  'location', 'exit', 'link', 'location_choices', 'finish', 'finish_exit', 'fatal_chest_trap', 'chest_treat_gain_life'];
export type ObjectType = (typeof objectTypes)[number];

export namespace ObjectTypes {
  export function isOpenable(type: ObjectType): boolean {
    switch (type) {
      case 'fatal_chest_trap':
      case 'chest_treat_gainlife':
        return true;
      default:
        return false;
    }
  }
  // Dynamically generate the mapping object for ObjectType to number
  export const enumeration: { [key in ObjectType]: number } = objectTypes.reduce((acc, type, index) => {
    acc[type as ObjectType] = index;
    return acc;
  }, {} as { [key in ObjectType]: number });

  export const senumeration: { [key in ObjectType]: string } = objectTypes.reduce((acc, type, index) => {
    acc[type as ObjectType] = type;
    return acc;
  }, {} as { [key in ObjectType]: string });

  /** field name symbol to enumerated number */
  export const E = enumeration;
  /** field name symbol to enumerated string */
  export const S = senumeration;

  // Function to get the index corresponding to the ObjectType
  export function index(type: ObjectType): number {
    const n = enumeration[type];
    if (typeof n === 'undefined') {
      throw new Error(`ObjectType ${type} is not defined`);
    }
    return n;
  }
}
/*
export class ObjectType {
  static Invalid = 0;
  static Location2 = 6;
  static Exit = 7;
  static Link2 = 8;
  static LocationChoices = 9;
  static Finish = 10;
  static FinishExit = 11;
  static FatalChestTrap = 12;
  static ChestTreatGainLife = 13;
}*/
