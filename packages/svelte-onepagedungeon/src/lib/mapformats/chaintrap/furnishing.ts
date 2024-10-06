import type { ObjectType } from "./objecttypes.js";
import type { LocationChoiceType } from "./inputtypes.js";
import { ObjectTypes } from "./objecttypes.js";
import type { JSONLocationItem } from "./json/locationitem.js";

/**
 * All located furniture is instanced with this class. Note, this excludes the finish_exit
 */
export class Furnishing {
  id: number;
  item: JSONLocationItem;

  static isOpenableType(type: ObjectType) {
    return ObjectTypes.isOpenable(type);
  }
  static onOpenTransitionType(type: ObjectType) {
    if (Furnishing.isOpenableType(type)) return type;
    throw new Error(`furniture type ${type} is not openable`);
  }

  constructor(id: number, item: JSONLocationItem) {
    this.id = id;
    this.item = item;
  }

  get type(): ObjectType {
    return this.item.type;
  }
  get choiceType(): LocationChoiceType {
    return this.item.choiceType;
  }

  get location(): number {
    return this.item.data.location;
  }
  get uniqueName(): string {
    return this.item.unique_name ?? `furnishing-${this.id}`;
  }
  get unique(): boolean {
    return typeof this.item.unique_name !== "undefined";
  }
}
