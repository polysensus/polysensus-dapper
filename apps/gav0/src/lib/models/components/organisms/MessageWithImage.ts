import type { ImageSource } from "./ImageSource";

export type MessageWithImage = {
  id: number;
  text: string;
  image: ImageSource;
}