import { SVGLayerId } from "./dungeonlayers.js";
import { SVGUtils } from "./utilities.js";
import type { SVGBound } from "./utilities.js";
import { SVGDungeonLayer } from "./dungeonlayers.js";
import { LocationLayers, layerSelectors } from "./locationlayers.js";

export class SVGDungeonModel {

  // The original doc
  doc: Document;

  // The original svg
  origSVG: SVGElement;

  // The plainified svg
  svg: SVGElement

  // The bounding rectables of the rooms, this is derived from the outline layer
  // The index is also the room id
  locationBounds: SVGBound[];

  locationLayers: LocationLayers;

  emptyDungeon: SVGElement

  get locationCount(): number {
    return this.locationBounds.length;
  }

  constructor(doc: Document) {
    this.doc = doc;
    const svg: SVGElement | null = this.doc.querySelector("svg");
    if (!svg) throw new Error(`No SVG found document`);

    this.origSVG = svg;
    this.svg = this.origSVG.cloneNode(true) as SVGElement;
    SVGDungeon.plainify(this.svg);

    this.emptyDungeon = SVGDungeon.emptyClone(this.svg);

    this.locationBounds = SVGDungeon.roomBoundaries(this.svg);
    this.locationLayers = SVGDungeon.locationLayers(this.svg, this.locationBounds);


    console.log(`Room count: ${this.locationCount}`)
  }

  getLocation(id: number, options?: { wrapped?: boolean, viewBox?: boolean }): SVGElement {

    const bounds = this.getBounds(id);
    const g = this.doc.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let i = SVGLayerId.Hatching; i < SVGLayerId.LastLayer; i++) {
      const paths = this.locationLayers.locationPaths(id, { [i]: true });
      const el = SVGDungeon.groupPath(this.doc, paths);
      el.setAttribute("id", `location-${id}`)
      el.setAttribute("layer-id", SVGLayerId[i].toLowerCase())
      if (SVGUtils.isBound1x1(bounds))
        el.setAttribute("data-door-id", `door-${id}`);
      else
        el.setAttribute("data-room-id", `room-${id}`);
      g.appendChild(el);

    }

    // note: ignore bounds if not wrapped
    if (!options?.wrapped) return g;
    const root = this.emptyDungeon.cloneNode(true) as SVGElement;
    SVGDungeon.insertElement(root, g);

    if (!options?.viewBox) return root;
    const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
    root.querySelector("rect")?.setAttribute("viewBox", viewBox);

    return root;
  }

  getLayer(layer: SVGLayerId, options?: { wrapped: boolean, viewBox: boolean }): SVGElement {

    const paths = layerSelectors[layer].selectPaths(this.svg);
    const el = SVGDungeon.groupPath(this.doc, paths);
    if (!options?.wrapped) return el;
    const root = this.emptyDungeon.cloneNode(true) as SVGElement;
    SVGDungeon.insertElement(root, el);

    if (!options?.viewBox) return root;

    const bounds = SVGUtils.pathBounds(paths);
    const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
    root.querySelector("rect")?.setAttribute("viewBox", viewBox);

    return root;
  }

  /**
   * Wrap the element as
   * @returns 
   */
  wrapForBoundsView(bounds: SVGBound, el: SVGElement): SVGElement {
    const root = this.emptyDungeon.cloneNode(true) as SVGElement;
    const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
    root.querySelector("rect")?.setAttribute("viewBox", viewBox);
    SVGDungeon.insertElement(root, el);
    return root;
  }

  getBounds(id: number): SVGBound {
    return this.locationBounds[id];
  }
}

namespace SVGDungeon {
  /**
   * take the full, pretty, svg map and normalise it to a plain form that facilitates interaction and decomposition
   * @param svg 
   */
  export function plainify(svg: SVGElement): void {
    // remove non-map layers (notes, title, legends, etc)
    const removeNonMapLayers = (g: SVGGElement) => {
      const siblingLayer = g.nextElementSibling
      if (siblingLayer) {
        siblingLayer.remove()
        removeNonMapLayers(g)
      }
    }

    setAttributes(svg);
    removeNonMapLayers(svg.querySelector("#dungeon-layer") as SVGGElement)
  }

  export function roomBoundaries(svg: SVGElement): SVGBound[] {
    return SVGUtils.enlargeByUnits(layerSelectors[SVGLayerId.Hatching].selectBounds(svg), 2);
  }

  export function locationLayers(svg: SVGElement, bounds: SVGBound[]): LocationLayers {
    return new LocationLayers(svg, layerSelectors, bounds);
  }

  /**
   * Create an SVGBound for each item in pathBounds, then break each path into sub paths according to which bound they are in.
   * This is provided as a convenience where the bounds are typically derived from the paths themselves, then other paths are grouped by those bounds.
   * @param forBounds 
   * @param toGroup 
   */
  export function groupSubPaths(pathBounds: SVGPathElement[], path: SVGPathElement): { bounds: SVGBound[], groups: (SVGPathElement | null)[] } {
    const bounds = pathBounds.map((path) => SVGUtils.pathBounds([path]));
    return { bounds, groups: SVGUtils.groupLinePath(bounds, path) }
  }

  /** Returns a single path outlining the entire dungeon */
  export function getOutline(svg: SVGElement): SVGPathElement {

    const gDungeon = svg.querySelector("#dungeon-map");
    if (!gDungeon) throw new Error("No dungeon-map group found in svg");
    const pathNodes = gDungeon.querySelectorAll("path");
    return Array.from(pathNodes)[1]
  }

  /** Returns an array of paths that correspond to the dungeon rooms and
   * doors. The index of the element corresponds to that room or door's id */
  export function getPathElements(svg: SVGElement): SVGPathElement[] {

    const gDungeon = svg.querySelector("#dungeon-map");
    if (!gDungeon) throw new Error("No dungeon-map group found in svg");
    return Array.from(gDungeon.querySelectorAll("path"));
  }

  export function addTileAttributes(
    el: SVGPathElement, id: number,
  ): SVGPathElement {

    // doors are 1x1 rooms
    const tileBounds = SVGUtils.pathBounds([el]);

    // Clone the selected path and append it to the new SVG document
    const cloned = el.cloneNode(true) as SVGPathElement
    cloned.setAttribute("id", `tile-${id}`)
    if (SVGUtils.isBound1x1(tileBounds))
      cloned.setAttribute("data-room-id", `door-${id}`);
    else
      cloned.setAttribute("data-door-id", `room-${id}`);

    return cloned;
  }

  export function emptyClone(svg: SVGElement): SVGElement {
    const clone = svg.cloneNode(true) as SVGElement
    // Select the node with id #dungeon-layer, creating a deep clone of it
    const dungeonLayer = (svg.querySelector('#dungeon-layer') as SVGGElement)?.cloneNode(true) as SVGGElement;
    if (!dungeonLayer) throw new Error("No dungeon-layer group found in cloned svg");

    // Remove all children of the #dungeon-layer node
    while (dungeonLayer.firstChild) {
      dungeonLayer.removeChild(dungeonLayer.firstChild);
    }

    // Remove all groups from the clone
    for (const el of Array.from(clone.querySelectorAll("g"))) {
      el.remove();
    }

    // Add the dungeon-layer node to the clone
    clone.appendChild(dungeonLayer);
    return clone;
  }

  export function insertElement(svg: SVGElement, el: SVGElement): void {
    const dungeonLayer = svg.querySelector('#dungeon-layer') as SVGGElement;
    if (!dungeonLayer) throw new Error("No dungeon-layer group found in cloned svg");
    dungeonLayer.appendChild(el);
  }

  export function groupPath(doc: Document, path: SVGPathElement[]): SVGGElement {
    const g = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    path.forEach((p) => g.appendChild(p));
    return g
  }

  export function setAttributes(svg: SVGElement): void {

    svg.setAttribute("id", "dungeon-svg")
    const gTransform = svg.querySelector(`g[transform]`) as SVGGElement
    if (!gTransform) throw new Error("No transform group found in svg");
    gTransform.setAttribute("id", "dungeon-layer")

    const gDungeon = gTransform.querySelector("g:nth-of-type(2)")
    if (!gDungeon) throw new Error("No dungeon-map group found in svg");

    gDungeon.setAttribute("id", "dungeon-map")

    svg.querySelector("rect")?.removeAttribute("fill") // the background of the dungeon should be controlled by the page

    // Fit the SVG's viewBox to its content
    const bounds = SVGUtils.pathBounds(Array.from(svg.querySelectorAll("path")));
    const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`

    // replace width, height properties with viewBox for all elements that have them
    const widthHeights = [...Array.from(svg.querySelectorAll("[width], [height]")), svg]
    widthHeights.forEach((g) => {
      g.removeAttribute("width")
      g.removeAttribute("height")
      g.setAttribute("viewBox", viewBox)
    })

    // remove transformations
    Array.from(svg.querySelectorAll("[transform]")).forEach((e) => e.removeAttribute("transform"))

    // This normalizes the apparent size of the rooms no matter the size of the map
    const width = bounds.right - bounds.left
    svg.style.width = `${width}px`
  }
}

export { SVGDungeon }