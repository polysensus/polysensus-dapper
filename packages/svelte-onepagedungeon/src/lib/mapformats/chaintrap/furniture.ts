import { Furnishing } from "./furnishing.js";
import type { JSONLocationItem } from "./json/locationitem.js";
import type { JSONMapMeta } from "./json/mapmeta.js";
import type { ObjectType } from "./objecttypes.js";

type Data = {
  map: JSONMapMeta;
  items: JSONLocationItem[];
}

export class Furniture {

  mapmeta: JSONMapMeta;

  items: JSONLocationItem[];
  index: {
    types: Record<ObjectType, Furnishing[]>,
    identified: Record<string, Furnishing>,
    located: Record<number, Furnishing[]>,
    typeByIndex: Record<number, ObjectType>
  };

  static fromJSON(data: Data) {
    return new Furniture(data);
  }

  byName(name: string) {
    const it = this.index.identified[name];
    if (!it) throw new Error(`name ${name} not found`);
    return it;
  }

  byType(type: ObjectType) {
    const furns = this.index.types[type];
    if (!furns) throw new Error(`type ${type} not found`);
    return [...furns];
  }

  byLocation(location: number) {
    const furns = this.index.located[location];
    if (!furns) return [];
    return [...furns];
  }

  constructor(data: Data) {
    this.mapmeta = data.map;
    this.items = data.items;
    this.index = {
      types: {},
      identified: {},
      located: {},
      typeByIndex: {},
    };
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      const furn = new Furnishing(i, it);

      if (furn.unique) {
        if (furn.uniqueName in this.index.identified)
          throw new Error(`id ${furn.uniqueName} previously defined`);
        this.index.identified[furn.uniqueName] = furn;
      }
      this.index.typeByIndex[i] = furn.type;
      this.index.types[furn.type] = [
        ...(this.index.types[furn.type] ?? []),
        furn,
      ];

      if (typeof furn.location !== "undefined")
        this.index.located[furn.location] = [
          ...(this.index.located[furn.location] ?? []),
          furn,
        ];
    }
  }
}
