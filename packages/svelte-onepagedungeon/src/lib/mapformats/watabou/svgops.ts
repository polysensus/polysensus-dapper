import type { S } from "vitest/dist/chunks/config.DCnyCTbs"

export type SVGBound = {
  left: number
  right: number
  top: number
  bottom: number
}

export function is1x1SVGBound(rect: SVGBound): boolean {
  const w = Math.abs(rect.right - rect.left);
  const h = Math.abs(rect.top - rect.bottom);
  return w === 1 && h === 1
}

export function getTileSVGString(
  doc: Document, el: SVGPathElement, id: number, options: { margin?: number, bounds?: SVGBound },
): SVGElement {

  // doors are 1x1 rooms
  const tileBounds = getSvgBounds([el]);
  const bounds = options.bounds ?? tileBounds;
  const margin = options.margin ?? 0;
  const width = Math.abs((bounds.right ?? 0) - (bounds.left ?? 0)) + 2 * margin;
  const height = Math.abs((bounds.top ?? 0) - (bounds.bottom ?? 0)) + 2 * margin;

  const svgDoc = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svgDoc.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // svgDoc.setAttribute('width', width.toString());
  // svgDoc.setAttribute('height', height.toString());
  // svgDoc.setAttribute('stroke-linejoin', 'round');
  // svgDoc.setAttribute('stroke-linecap', 'round');
  // svgDoc.setAttribute('fill-rule', 'evenodd');
  // svgDoc.setAttribute('fill', 'none');

  // const rect = doc.createElement('rect');
  // rect.setAttribute('x', "0");
  // rect.setAttribute('y', "0");
  // rect.setAttribute('width', width.toString());
  // rect.setAttribute('height', height.toString());
  // svgDoc.appendChild(rect);
//  const style = doc.createElement('style');
//  style.textContent = `
//<![CDATA[@import url("https://fonts.googleapis.com/css2?family=Grenze:wght@700&display=swap");@import url("https://fonts.googleapis.com/css2?family=Neuton:ital@1&display=swap");@import url("https://fonts.googleapis.com/css2?family=Neuton&display=swap");@import url("https://fonts.googleapis.com/css2?family=Neuton:wght@800&display=swap");]]>
//`
// svgDoc.appendChild(style);

  // Clone the selected path and append it to the new SVG document
  const cloned = el.cloneNode(true) as SVGPathElement
  cloned.setAttribute("id", `tile-${id}`)
  if (is1x1SVGBound(tileBounds))
    cloned.setAttribute("data-room-id", `door-${id}`);
  else
    cloned.setAttribute("data-door-id", `room-${id}`);

  svgDoc.appendChild(cloned);
  return svgDoc;
}

/** Returns an array of paths that correspond to the dungeon rooms and
 * doors. The index of the element corresponds to that room or door's id */
export function getDungeonPathElements(svg: SVGElement): SVGPathElement[] {

  const gDungeon = svg.querySelector("#dungeon-map");
  if (!gDungeon) throw new Error("No dungeon-map group found in svg");
  const pathNodes = gDungeon.querySelectorAll("path");
  const paths = Array.from(pathNodes).slice(2)

  // const pathNodes = svg.querySelectorAll("path")
  // const paths = Array.from(pathNodes).slice(2)
  return paths
}

export function getSvgBounds(paths: SVGPathElement[]): SVGBound {

  type Bound = {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }

  const reduceToBound = (bound: Bound, [x, y]: [number, number]): Bound => {
    const boundleft = bound.left ?? x
    const boundright = bound.right ?? x
    const boundtop = bound.top ?? y
    const boundbottom = bound.bottom ?? y

    const left = boundleft > x ? x : boundleft
    const right = boundright < x ? x : boundright
    const top = boundtop > y ? y : boundtop
    const bottom = boundbottom < y ? y : boundbottom

    return { left, right, top, bottom }
  }

  const bounds: Bound = Array.from(paths)
    .map((path) => path.getAttribute("d"))
    .flatMap((d) => d.match(/[\d.-]*,[\d.-]*/g))
    .map((point) => point.split(",").map((p) => parseFloat(p)))
    .reduce(reduceToBound, {} as Bound)

  const svgBound: SVGBound = {
    left: bounds.left ?? 0,
    right: bounds.right ?? 0,
    top: bounds.top ?? 0,
    bottom: bounds.bottom ?? 0,
  }

  return svgBound;
}

/** A function used in an `array.reduce` that returns the input
 * array stripped of duplicates */
const unique = <T>(uq: T[], c: T) => (uq.some((u) => u === c) ? uq : [...uq, c])

/** Output an array of [x,y] coordinates representing the vertices of an svg "d" attribute */
export const getCoords = (d: string) =>
  d
    .split(" ")
    .filter((e) => e !== "M" && e !== "L" && e !== "")
    .reduce(unique, [])
    .map((e) => e.split(",").map((c: string) => parseInt(c)))

export const getMidPoint = (d: string) =>
  getCoords(d)
    .reduce(([sumX, sumY]: [number, number], [x, y]: [number, number]) => [sumX + x, sumY + y], [0, 0])
    .map((avg: number) => avg / getCoords(d).length)
