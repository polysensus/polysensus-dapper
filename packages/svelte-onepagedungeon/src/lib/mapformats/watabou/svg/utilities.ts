import { gcd } from "../utilities.js";

export type SVGBound = {
  left: number
  right: number
  top: number
  bottom: number
}

type Point = { x: number, y: number };
type LineSegment = { start: Point, end: Point };

namespace SVGUtils {

  export function enlargeBound(bound: SVGBound, amount: number): SVGBound {
    return {
      left: bound.left - amount,
      right: bound.right + amount,
      top: bound.top - amount,
      bottom: bound.bottom + amount
    }
  }

  export function minBound(bounds: SVGBound[]): SVGBound {
    return bounds.reduce((acc, bound) => {
      const w = Math.abs(bound.right - bound.left);
      if (w === 0) return acc;
      const h = Math.abs(bound.bottom - bound.top);
      if (h === 0) return acc;
      const aw = Math.abs(acc.right - acc.left);
      if (aw === 0) return bound; // if acc is 0, bound is the first non-zero bound
      const ah = Math.abs(acc.bottom - acc.top);
      if (ah === 0) return bound; // if acc is 0, bound is the first non-zero bound
      if (w * h < aw * ah) return bound;
      return acc;
    }, bounds[0])
  }

  export function unionBound(bounds: SVGBound[]): SVGBound {
    return bounds.reduce((acc, bound) => {
      return {
        left: Math.min(acc.left, bound.left),
        right: Math.max(acc.right, bound.right),
        top: Math.min(acc.top, bound.top),
        bottom: Math.max(acc.bottom, bound.bottom)
      }
    }, bounds[0]);
  }

  /**
   * The grid unit is established by taking the GCD of the max and min bounds.
   * The average of the width and height of the min max bounds is used the input
   * to GCD to avoid issues with skinny rectangles.
   * @param bounds 
   * @param amount 
   * @returns 
   */

  export function gridUnit(bounds: SVGBound[]): number {
    const max = unionBound(bounds);
    // average them to avoid issues with skiny bounds
    const maxu = (Math.abs(max.right - max.left) + Math.abs(max.bottom - max.top)) / 2;

    const min = minBound(bounds);
    const w = Math.abs(min.right - min.left);
    const h = Math.abs(min.bottom - min.top);
    // average them to avoid issues with skiny bounds
    const minu = (w + h) / 2;
    return gcd(maxu, minu);
  }

  /**
   * Enlarge each bounds by the common grid unit.
   * The grid unit is established by taking the GCD of the max and min bounds.
   * The average of the width and height of the min max bounds is used the input
   * to GCD to avoid issues with skinny rectangles.
   * @param bounds 
   * @param amount 
   * @returns 
   */
  export function enlargeByUnits(bounds: SVGBound[], amount: number): SVGBound[] {
    const u = gridUnit(bounds);

    return bounds.map(bound => enlargeBound(bound, amount * u * 0.5));
  }

  export function isBound1x1(rect: SVGBound): boolean {
    const w = Math.abs(rect.right - rect.left);
    const h = Math.abs(rect.top - rect.bottom);
    return w === 1 && h === 1
  }

  export function isInside(bound: SVGBound, candidate: SVGBound): boolean {
    return (
      bound.left <= candidate.left &&
      bound.right >= candidate.right &&
      bound.top <= candidate.top &&
      bound.bottom >= candidate.bottom
    )
  }

  export function isPointInside(bound: SVGBound, point: Point): boolean {
    return point.x >= bound.left && point.x <= bound.right && point.y <= bound.bottom && point.y >= bound.top;
  }

  export function linesInside(bound: SVGBound, segments: LineSegment[]): LineSegment[] {
    return segments.filter(segment => {
      return isPointInside(bound, segment.start) && isPointInside(bound, segment.end);
    });
  }

  export function linePathData(segments: LineSegment[]): string {
    return segments.map(segment => `M ${segment.start.x},${segment.start.y} L ${segment.end.x},${segment.end.y}`).join(' ');
  }

  export function parsePathData(d: string): LineSegment[] {
    const commands = d.match(/[ML]\s*[-\d.,\s]+/g);
    if (!commands) return [];

    const lineSegments: LineSegment[] = [];
    let lastPoint: Point | null = null;

    for (const command of commands) {
      const parts = command.trim().split(/[\s,]+/);
      const type = parts.shift();
      const points = parts.map(Number);

      for (let i = 0; i < points.length; i += 2) {
        const currentPoint: Point = { x: points[i], y: points[i + 1] };

        if (type === 'L' && lastPoint) {
          lineSegments.push({ start: lastPoint, end: currentPoint });
        }

        lastPoint = currentPoint;
      }
    }
    return lineSegments;
  }

  export function groupLinePath(
    bounds: SVGBound[], path: SVGPathElement): (SVGPathElement | null)[] {
    const groups: (SVGPathElement | null)[] = [];
    const d = path.getAttribute('d')
    if (!d) throw new Error('No path data found');
    const segments = parsePathData(d);

    for (const bound of bounds) {
      // by considering them all each time, we duplicate lines that straddle bounds
      const grouped = linesInside(bound, segments);
      if (grouped.length === 0) {
        groups.push(null);
        continue;
      }
      const subPath = path.cloneNode() as SVGPathElement;
      subPath.setAttribute('d', linePathData(grouped));
      groups.push(subPath);
    }
    return groups;
  }

  export function groupPaths(bounds: SVGBound[], paths: SVGPathElement[]): { [key: number]: SVGPathElement[] } {
    return paths.reduce<{ [key: number]: SVGPathElement[] }>((acc, path) => {
      const location = pathBoundsCheck(bounds, path);
      if (!location) return acc;
      if (!acc[location]) acc[location] = [];
      acc[location].push(path);
      return acc;
    }, {});
  }

  /** Return the first indices of all bounds which contain the path */
  export function pathBoundsCheck(
    bounds: SVGBound[], path: SVGPathElement): number | undefined {
    const pathBounds = SVGUtils.pathBounds([path]);
    for (let i = 0; i < bounds.length; i++) {
      if (isInside(bounds[i], pathBounds)) return i;
    }
  }

  export function setBoundsRect(root: SVGElement, bounds: SVGBound) {
    const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
    root.querySelector("rect")?.setAttribute("viewBox", viewBox);
  }

  export function elementBounds(g: SVGElement): SVGBound {

    const nodes = g.querySelectorAll("path");
    const paths = Array.from(nodes);
    return pathBounds(paths);
  }
  export function pathBounds(paths: SVGPathElement[]): SVGBound {

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
  export const dCoords = (d: string) =>
    d
      .split(" ")
      .filter((e) => e !== "M" && e !== "L" && e !== "")
      .reduce(unique, [])
      .map((e) => e.split(",").map((c: string) => parseInt(c)))

  export const getMidPoint = (d: string) =>
    dCoords(d)
      .reduce(([sumX, sumY]: [number, number], [x, y]: [number, number]) => [sumX + x, sumY + y], [0, 0])
      .map((avg: number) => avg / dCoords(d).length)

}
export { SVGUtils };