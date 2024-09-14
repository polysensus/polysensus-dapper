/**
 * Various conveniences for working with Watabou map primitive types.
 * Note that these exclude those dependent on reg-ex processing of note text.
 */
import { hasProperty } from '../../idiomatic.js';
import type {
  Rect, Mortal, Player, Agent, Enemy, Note, DoorNote, CuriousNote, SecretNote, ContainerNote, BodyNote
} from './formatprimitives.js';
import { NoteType } from './formatprimitives.js';

export const isDoorNote = (note: Note): note is DoorNote => note.type === NoteType.door;
export const isCuriousNote = (note: Note): note is CuriousNote => note.type === NoteType.curious;
export const isItemNote = (note: Note): note is SecretNote | ContainerNote | BodyNote =>
  note.type !== 'none' && hasProperty(note, 'items', (value) => value !== undefined);

export const isPlayer = (mortal: Mortal): mortal is Player => !('id' in mortal);
export const isAgent = (mortal: Mortal): mortal is Agent => 'id' in mortal;
export const isEnemy = (agent: Agent): agent is Enemy =>
  'isEnemy' in agent && agent.isEnemy === true;

/** 1 x 1 rooms are connectors between different rooms */
export const is1x1 = (a: Rect) => a.w === 1 && a.h === 1

/** Return true if a and b share one edge */
const isAdjacent = (a: Rect, b: Rect): boolean => {
  if (!is1x1(a) && !is1x1(b)) return false // in this format, if rects are adjacent, one of them must by 1 x 1
  if (!is1x1(b)) return isAdjacent(b, a) // makes things easier if the 2nd is always the 1 x 1

  const left = a.x
  const top = a.y
  const right = a.x + a.w
  const bottom = a.y + a.h

  const isTop = b.y === top - 1
  const isRight = b.x === right
  const isBottom = b.y === bottom
  const isLeft = b.x === left - 1

  if (isTop || isBottom) return b.x >= a.x && b.x < right
  if (isRight || isLeft) return b.y >= a.y && b.y < bottom

  return false
}

export const randomPick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
export const areOpposite = (dir1: string, dir2: string): boolean => {
  return (
    (dir1 === "north" && dir2 === "south") ||
    (dir1 === "south" && dir2 === "north") ||
    (dir1 === "east" && dir2 === "west") ||
    (dir1 === "west" && dir2 === "east")
  )
}

/**
 * Checks if the 'to' rectangle is opposite to the 'from' rectangle across a door.
 *
 * @param {Rect} to - The target rectangle that we want to check if it's opposite to the 'from' rectangle.
 * @param {Rect} from - The source rectangle that is adjacent to the door.
 * @param {Door} door - The door between the 'to' and 'from' rectangles.
 * @returns {boolean} - Returns true if the 'to' rectangle is opposite to the 'from' rectangle across the door, otherwise false.
 */
export const isOpposite = (to: Rect, from: Rect, door: Door): boolean => {
  // Check if the 'to' and 'from' rectangles are adjacent to the door
  if (!isAdjacent(to, { ...door, w: 1, h: 1 }) || !isAdjacent(from, { ...door, w: 1, h: 1 })) return false
  const isDoorSouth = door.x >= from.x && door.x < from.x + from.w && door.y === from.y + from.h
  const isRoomSouth = from.y + from.h === door.y && door.x >= from.x && door.x < from.x + from.w
  if (isDoorSouth && isRoomSouth) return true
  const isDoorNorth = door.x >= from.x && door.x < from.x + from.w && door.y === from.y - 1
  const isRoomNorth = to.y + to.h === door.y && door.x >= to.x && door.x < to.x + to.w
  if (isDoorNorth && isRoomNorth) return true
  const isDoorWest = door.y >= from.y && door.y < from.y + from.h && door.x === from.x - 1
  const isRoomWest = to.x + to.w === door.x && door.y >= to.y && door.y < to.y + to.h
  if (isDoorWest && isRoomWest) return true
  const isDoorEast = door.y >= from.y && door.y < from.y + from.h && door.x === from.x + from.w
  const isRoomEast = from.x + from.w === door.x && door.y >= from.y && door.y < from.y + from.h
  if (isDoorEast && isRoomEast) return true

  return false
}

export const isInside = (pos: { x: number; y: number }, rect: Rect) =>
  pos.x >= rect.x && pos.x < rect.x + rect.w && pos.y >= rect.y && pos.y < rect.y + rect.h

export const getDir = <T extends Rect>(from: T | undefined, to: T): "north" | "south" | "east" | "west" => {
  if (!is1x1(to)) {
    console.error(`Unexpected argument to getDir ${to}`)
  }
  if (!isAdjacent(to, from)) {
    console.error(`Arguments to getDir are not adjacent: ${{ from: to, to: from }}`)
  }

  if (to.x === from.x - 1) return "west"
  if (to.x === from.x + from.w) return "east"
  if (to.y === from.y - 1) return "north"
  if (to.y === from.y + from.h) return "south"
}

export const doorFunc = (doors: Door[]) => (a: { x: number; y: number }) =>
  doors.find((door) => door.x === a.x && door.y === a.y)

/** Return every rect that is connected to 'a' along one edge */
export const getAdjacent = <T extends Rect>(a: T, rects: T[]) => rects.filter((rect) => isAdjacent(rect, a))

