// JSON prefix is used to avoid name conflicts with the model types, where map
// data is accepted in model type constructors.

export type JSONLocationExits = [number[], number[], number[], number[]];

export type JSONLocation = {
  comment?: string;
  corridors: JSONLocationExits;
  main: boolean;
  inter: boolean;
  l: number;
  w: number;
  x: number;
  y: number;
};
export type JSONRoom = JSONLocation;