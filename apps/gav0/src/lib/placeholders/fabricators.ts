import type { FabricatorComponentData } from '$lib/types';

import blueprintImgSrc0 from '$lib/assets/game-biomes/biomes-blueprint-0.png';
import blueprintImgSrc1 from '$lib/assets/game-biomes/biomes-blueprint-1.png';
import blueprintImgSrc2 from '$lib/assets/game-biomes/biomes-blueprint-2.png';
import blueprintImgSrc3 from '$lib/assets/game-biomes/biomes-blueprint-3.png';
const blueprintImages = [blueprintImgSrc0, blueprintImgSrc1, blueprintImgSrc2, blueprintImgSrc3];

import graffitSrc1 from '$lib/assets/icons-256x256/game-ico-1.png';
import graffitSrc2 from '$lib/assets/icons-256x256/game-ico-2.png';
import graffitSrc3 from '$lib/assets/icons-256x256/game-ico-3.png';
import graffitSrc4 from '$lib/assets/icons-256x256/game-ico-4.png';

const graffitiImages = [graffitSrc1, graffitSrc2, graffitSrc3, graffitSrc4];

const defaultStride = 2;

export const placeholders:{[key:string]:{
  [key:string]:{
    stride?: number,
    content:{image:{src: string, alt: string, styles?:{size?:string, shape?:string}}}[]}}} = {
    "biomes-2024":{
      "graffiti": {
        content: graffitiImages.map((src, i) => (
          {id: `${i}`, text: `Biomes graffiti ${i}`, image:{src, alt: `Biomes graffiti ${i}`}}))
      },
      "blueprints": {
        content: blueprintImages.map((src, i) => (
          {id: `${i}`, text: `Biomes blueprint ${i}`, image:{src, alt: `Biomes blueprint ${i}`}})),
        stride: 2,
      },
    }
}

export function fabricatorData(gameId: string, generator: string) {
  return placeholders[gameId][generator];
}

