/**
 * A chain trap object is anything that can be committed to the merkleised representation of a dungeon.
 * Chain trap objects facilitate choices that lead, verifably, to consequences.
 */

import type { ObjectType } from '../objecttypes.js';
import type { LocationChoiceType } from '../inputtypes.js';

export type LocationItemData = {
  location: number;
  side?: number;
  exit?: number;
}

export type ItemMeta = {
  notes: string[];
}

export type JSONLocationItem = {
  unique_name: string | undefined;
  labels: string[];
  type: ObjectType;
  choiceType: LocationChoiceType;
  data: LocationItemData;
  meta: ItemMeta;
}