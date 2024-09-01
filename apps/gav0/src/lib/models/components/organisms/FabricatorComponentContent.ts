import type { MessageWithImage } from "./MessageWithImage";

export type FabricatorComponentData = {
  // generatorTypes: string[];
  content: MessageWithImage[];
  stride?: number;
}

export type FabricatorPageData = {
  generatorTypes: string[];
  content: MessageWithImage[];
  stride: number;
}