// Define an interface with the required methods
import type { SVGBound } from "./utilities.js";

interface ILayerSelector {
  selectBounds(svg: SVGElement): SVGBound[];
  groupSpecials(svg: SVGElement, bounds: SVGBound[], name: string): { [key: number]: SVGPathElement };
}