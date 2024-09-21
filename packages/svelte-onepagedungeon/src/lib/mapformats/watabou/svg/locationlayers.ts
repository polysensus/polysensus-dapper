/**
 * @module SvelteOnePageDungeon/MapFormats/Watabou/SVG/LocationLayers
 * @desc This module contains classes and functions for selecting and working
 * with dungeon locations and layers of elements grouped by those locations.
 */
import { SVGUtils } from "./utilities.js";
import type { SVGBound } from "./utilities.js";
import { SVGLayerId, SVGDungeonLayer } from "./dungeonlayers.js";

export const defaultLayerMask: { [key: number]: boolean } = {
  [SVGLayerId.Hatching]: true,
  [SVGLayerId.Outline]: true,
  [SVGLayerId.Grid]: true,
  [SVGLayerId.Clippath]: false,
  [SVGLayerId.CornerDetails]: true,
  [SVGLayerId.Furniture]: true,
  [SVGLayerId.FaintOutline]: false,
  [SVGLayerId.WallShading]: true,
}
export class LayerSelector {
  id: SVGLayerId;
  range: [number, number | undefined];
  specials: { [key: string]: number };
  constructor(id: SVGLayerId, range: [number, number | undefined], specials: { [key: string]: number }) {
    this.id = id;
    this.range = range;
    this.specials = specials;
  }

  selectPaths(svg: SVGElement): SVGPathElement[] {
    return SVGDungeonLayer.selectPaths(svg, this.id);
    const regular = SVGDungeonLayer.selectPaths(svg, this.id).slice(...this.range);
    const special = this.selectSpecials(svg)
    return [...regular, ...special]
  }

  selectLocationPaths(svg: SVGElement): SVGPathElement[] {
    const selection = SVGDungeonLayer.selectPaths(svg, this.id);
    return selection.slice(...this.range);
  }

  selectSpecials(svg: SVGElement): SVGPathElement[] {
    const selection = SVGDungeonLayer.selectPaths(svg, this.id);
    const paths: SVGPathElement[] = [];
    for (const i of Object.values(this.specials)) {
      const p = selection[i];
      if (!p)
        continue
      paths.push(selection[i])
    }
    return paths;
  }
  selectBounds(svg: SVGElement): SVGBound[] {
    return this.selectLocationPaths(svg).map((path) => SVGUtils.pathBounds([path]));
  }

  /** returns an object, keyed by indices into the bounds array, where each value is the portion of the special in the associated bound*/
  groupSpecials(svg: SVGElement, bounds: SVGBound[], name?: string): { [key: number]: SVGPathElement } {

    // Default assumes there is only one special or that it doesn't matter which is used.
    name = name ?? Object.keys(this.specials)[0];

    const special = SVGDungeonLayer.selectPaths(svg, this.id).slice(this.specials[name])[0];
    return SVGUtils.groupLinePath(bounds, special)
      .reduce<{ [key: number]: SVGPathElement }>((acc, group, i) => {
        if (group == null) return acc;
        acc[i] = group;
        return acc;
      }, {});
  }

  groupPaths(svg: SVGElement, bounds: SVGBound[]): { [key: number]: SVGPathElement[] } {
    const paths = this.selectLocationPaths(svg);
    return SVGUtils.groupPaths(bounds, paths);
  }

}

export class LocationLayers {


  // outer map is for each layer, inner map has keys for each room and the
  // single specialy grouped path for that room. if inner key is absent, the room has no special path.
  specials: { [key: number]: { [key: number]: SVGPathElement } };

  // outer map is for each layer, inner array has keys for each room.
  regular: { [key: number]: { [key: number]: SVGPathElement[] } };

  // combines the specials and regular maps
  all: { [key: number]: { [key: number]: SVGPathElement[] } };

  constructor(svg: SVGElement, selectors: { [key: number]: LayerSelector }, roomBounds: SVGBound[]) {
    this.specials = {};
    this.regular = {};
    this.all = {};
    for (let i = SVGLayerId.Hatching; i < SVGLayerId.LastLayer; i++) {
      this.specials[i] = selectors[i].groupSpecials(svg, roomBounds);
      this.regular[i] = SVGUtils.groupPaths(roomBounds, selectors[i].selectLocationPaths(svg));
      this.all[i] = { ...this.regular[i] };
      for (let j = 0; j < roomBounds.length; j++) {
        if (!this.specials[i][j]) continue;
        if (!this.all[i][j]) this.all[i][j] = [];
        this.all[i][j].push(this.specials[i][j]);
      }
    }
  }

  locationPaths(id: number, mask?: { [key: number]: boolean }): SVGPathElement[] {
    if (!mask) mask = defaultLayerMask;
    const paths: SVGPathElement[] = [];
    for (const [istr, select] of Object.entries(mask)) {
      if (!select) continue;
      const i = Number(istr);
      // for (let i = SVGLayerId.Hatching; i < SVGLayerId.LastLayer; i++) {
      if (!this.all[i][id]) continue;
      paths.push(...this.all[i][id]);
    }
    return paths;
  }
}

export const layerSelectors: { [key: number]: LayerSelector } = {
  [SVGLayerId.Hatching]: new LayerSelector(SVGLayerId.Hatching, [2, -1], { "hatching": -1 }),
  [SVGLayerId.Outline]: new LayerSelector(SVGLayerId.Outline, [2, undefined], { "outline": 1 }),
  [SVGLayerId.Grid]: new LayerSelector(SVGLayerId.Grid, [1, -1], { "grid": -1 }),
  [SVGLayerId.Clippath]: new LayerSelector(SVGLayerId.Clippath, [2, undefined], { "special": 1 }),
  [SVGLayerId.CornerDetails]: new LayerSelector(SVGLayerId.CornerDetails, [2, undefined], { "special": 1 }),
  [SVGLayerId.Furniture]: new LayerSelector(SVGLayerId.Furniture, [1, undefined], {}),
  [SVGLayerId.FaintOutline]: new LayerSelector(SVGLayerId.FaintOutline, [2, undefined], { "outline": 1 }),
  [SVGLayerId.WallShading]: new LayerSelector(SVGLayerId.WallShading, [1, undefined], {}),
}