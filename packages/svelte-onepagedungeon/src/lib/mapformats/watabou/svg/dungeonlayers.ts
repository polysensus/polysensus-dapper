export enum SVGLayerId {
  Undefined,
  Hatching,
  Outline,
  Grid,
  Clippath,
  CornerDetails,
  Furniture,
  FaintOutline,
  Exits,
  LastLayer,
}

namespace SVGDungeonLayer {
  export function name(layer: SVGLayerId): string {
    return SVGLayerId[layer].toLowerCase();
  }

  export function id(layer: SVGLayerId): string {
    return `geom-${name(layer)}`;
  }

  export function select(svg: SVGElement, layer: SVGLayerId): SVGElement {

    const dungeon: SVGElement | null = svg.querySelector("g[transform]");
    if (!dungeon) throw new Error("No transform group found in svg");

    const g: SVGElement | null = dungeon.querySelector(`g:nth-of-type(${layer})`);
    if (!g) throw new Error(`No transform group found in svg for layer ${name(layer)}`);
    return g;
  }

  export function selectPaths(svg: SVGElement, layer: SVGLayerId): SVGPathElement[] {
    const g = select(svg, layer);
    const pathNodes = g.querySelectorAll("path");
    const paths = Array.from(pathNodes);
    return paths;
  }
}

export { SVGDungeonLayer }