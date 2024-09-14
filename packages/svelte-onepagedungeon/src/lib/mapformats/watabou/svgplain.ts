
import { getSvgBounds } from "./svgops.js";
/**
 * take the full, pretty, svg map and normalise it to a plain form that facilitates interaction and decomposition
 * @param svg 
 */
export function svgPlainify(svg: SVGElement): void {
  // remove non-map layers (notes, title, legends, etc)
  const removeNonMapLayers = (g: SVGGElement) => {
    const siblingLayer = g.nextElementSibling
    if (siblingLayer) {
      siblingLayer.remove()
      removeNonMapLayers(g)
    }
  }

  setDungeonAttributes(svg);
  removeNonMapLayers(svg.querySelector("#dungeon-layer") as SVGGElement)

}
export function setDungeonAttributes(svg: SVGElement): void {

  svg.setAttribute("id", "dungeon-svg")
  const gTransform = svg.querySelector(`g[transform]`) as SVGGElement
  if (!gTransform) throw new Error("No transform group found in svg");
  gTransform.setAttribute("id", "dungeon-layer")

  const gDungeon = gTransform.querySelector("g:nth-of-type(2)")
  if (!gDungeon) throw new Error("No dungeon-map group found in svg");

  gDungeon.setAttribute("id", "dungeon-map")

  svg.querySelector("rect")?.removeAttribute("fill") // the background of the dungeon should be controlled by the page

  // Fit the SVG's viewBox to its content
  const bounds = getSvgBounds(Array.from(svg.querySelectorAll("path")));
  // const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`

  // // replace width, height properties with viewBox for all elements that have them
  // const widthHeights = [...Array.from(svg.querySelectorAll("[width], [height]")), svg]
  // widthHeights.forEach((g) => {
  //   g.removeAttribute("width")
  //   g.removeAttribute("height")
  //   g.setAttribute("viewBox", viewBox)
  // })

  // remove transformations
  Array.from(svg.querySelectorAll("[transform]")).forEach((e) => e.removeAttribute("transform"))

  // This normalizes the apparent size of the rooms no matter the size of the map
  const width = bounds.right - bounds.left
  svg.style.width = `${width}px`
}