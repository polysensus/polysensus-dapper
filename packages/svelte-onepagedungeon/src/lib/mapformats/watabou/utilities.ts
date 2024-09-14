import type { Room, Exit } from "./formatprimitives.js";
import { getRandomNumber } from "./rng.js";
import { hasProperty } from "$lib/idiomatic.js";

/**
 * Composes a sequence of functions that transform a single input value into a final output value.
 *
 * @template T The type of the input and output values.
 * @param {...((i: T) => T)[]} funcs An array of functions that take a single input parameter of type T and return an output of the same type T.
 * @param {T} initValue The initial input value to be passed to the first function in the sequence.
 * @param {(currentValue: T, nextFunc: (i: T) => T) => T} [wrapper=(currentValue, nextFunc) => nextFunc(currentValue)] A function that wraps each function in the sequence and allows for modification of the output before it is passed as input to the next function.
 * @returns {T} The final output value after applying all functions in the sequence to the initial input value.
 *
 * @example
 * // Define some simple functions to transform a string input
 * const addExclamation = (str: string) => str + "!";
 * const addQuestionMark = (str: string) => str + "?";
 * const addPeriod = (str: string) => str + ".";
 *
 * // Compose the functions into a sequence and apply them to an input value
 * const result = compose(addExclamation, addQuestionMark, addPeriod)("hello");
 *
 * // Output the final result
 * console.log(result); // "hello?!."
 *
 * @example
 * // Define a function that converts a string to uppercase
 * const toUpperCase = (str: string) => str.toUpperCase();
 *
 * // Define a wrapper function that appends "!" to the output of each function in the sequence
 * const addExclamation = (currentValue: string, nextFunc: (i: string) => string) => nextFunc(currentValue) + "!";
 *
 * // Compose the functions into a sequence and apply them to an input value
 * const result = compose(toUpperCase)("hello", addExclamation);
 *
 * // Output the final result
 * console.log(result); // "HELLO!"
 */
export const compose =
  <T>(...funcs: ((i: T) => T)[]) =>
    (initValue: T, wrapper = (currentValue: T, nextFunc: (i: T) => T) => nextFunc(currentValue)): T =>
      funcs.reduce<T>((currentValue: T, nextFunc) => wrapper(currentValue, nextFunc), initValue)

/** Compare two arrays and only return true if they each have the same elements, irrespective of order */
export const arrEqual = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) return false
  if (a.length === 0) return true
  const aPop = a[0]
  const bIndex = b.findIndex((b) => b === aPop)
  if (bIndex === -1) return false
  const bStripped = [...b.slice(0, bIndex), ...b.slice(bIndex + 1)]
  return arrEqual(a.slice(1), bStripped)
}

/** Shuffles an array */
export const shuffleArray = <T>(array: T[]): T[] =>
  array
    .map((value) => ({ value, random: getRandomNumber() }))
    .sort((a, b) => a.random - b.random)
    .map(({ value }) => value)

/** call arr.sort() on anything that has an id, such as a room, note or enemy */
export const sortById = <T extends { id: number }>(a: T, b: T) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0)

/** sort by the number of exits */
export const sortByExits = (a: Room, b: Room) =>
  a.exits.length > b.exits.length ? 1 : b.exits.length > a.exits.length ? -1 : 0

/** This gives an expected order to the exits when using numbers to specify them */
export const sortExitsClockwise =
  (room: { x: number; y: number }) =>
    (aExit: Exit, bExit: Exit): 1 | 0 | -1 => {
      const a = aExit.door
      const b = bExit.door
      const [ax, ay] = [a.x - room.x, a.y - room.y]
      const [bx, by] = [b.x - room.x, b.y - room.y]
      const angleA = Math.atan2(ay, ax)
      const angleB = Math.atan2(by, bx)
      return angleA < angleB ? -1 : angleA > angleB ? 1 : 0
    }

/** Take an object of the form { key: n } where n is a number, and
 * return an array of keys repeated n times.
 *
 * @example {a: 1, b: 3, c: 2} => ["a", "b", "b", "b", "c", "c"]
 */
export const expandTally = <T extends string>(obj: { [key in T]: number }): T[] => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value !== "number")
      throw new Error(`Invalid value type '${typeof value}' in keysRepeated ${key}:${value}`)
    if (value < 0) throw new Error(`Invalid value range '${value}' in keysRepeated ${key}:${value}`)
  })

  return Object.entries(obj).reduce((arr, [key, value]) => [...arr, ...Array(value).fill(key)], [])
}

export const tallyArray = (items: string[]): [number, string][] => {
  const counts = items.reduce((map, str) => {
    map.set(str, (map.get(str) || 0) + 1)
    return map
  }, new Map<string, number>())

  const pairs = Array.from(counts.entries()).map(([str, count]) => [count, str]) as [number, string][]

  return pairs
}

/** Given an value with an id, return the id. Otherwise return the value */
export const toId = (value: Room | number | string) => (value && hasProperty(value, "id") ? (value as Room).id : value)
/** Randomly choose one of the element's members */
export const getRandomElementOf = <T>(arr: T[]) => arr[Math.floor(getRandomNumber() * arr.length)]

/** Compare two arrays and return true if all elements of a are contained in b. Does not accommodate duplicates */
export const containsElementsOf = (a: unknown[], b: unknown[]): boolean => a.every((e) => b.includes(e))

/** Replace item in array with id */
export const replace = <T extends { id: number }>(e: T, arr: T[]) => arr.map((a) => (e.id === a.id ? e : a))

/** Remove duplicate elements */
export const unique = <T>(arr: T[]) => arr.reduce((out: T[], e: T) => (out.includes(e) ? out : [...out, e]), [])

// distributes x into arr.length buckets proportional the values of arr.
// e.g. (12, [1,2,3]) => [2,4,6]
const distributeProportionately = (x: number, arr: number[]): number[] => {
  const sum = arr.reduce((a, b) => a + b, 0)
  const proportions = arr.map((value) => value / sum)
  const distributed = arr.map((_, i) => Math.floor(proportions[i] * x))

  let remaining = x - distributed.reduce((a, b) => a + b, 0)
  while (remaining > 0) {
    const index = distributed.findIndex((_, i) => proportions[i] === Math.max(...proportions))
    distributed[index]++
    proportions[index] = -1
    remaining--
  }

  return distributed
}

/**
 * Distributes the given population into factions based on the available spaces.
 * If the population exceeds the total spaces, it will proportionately distribute the population among the spaces.
 * If the population is less than or equal to the total spaces, it will create factions within the given constraints:
 * - Ideally, there should be only 9 members in each faction.
 * - No faction should have more than 15 members nor less than 4.
 * - The faction populations should be divided as evenly as possible.
 * - There should be as few factions as possible.
 *
 * @param {SpaceConfig} config - A configuration object containing the population and spaces.
 * @param {number} config.population - The total population to be distributed.
 * @param {number[]} config.spaces - An array of numbers representing the available spaces in each faction.
 * @returns {number[]} An array representing the population of each faction after distribution.
 */
export const distributeFactionPopulation = (config: { population: number; spaces: number[] }): number[] => {
  const { population, spaces } = config
  const totalSpaces = spaces.reduce((a, b) => a + b, 0)

  if (population > totalSpaces) {
    return distributeProportionately(population, spaces)
  }

  const minSize = 4
  const maxSize = 15
  const idealSize = 9

  const minFactions = Math.ceil(population / maxSize)
  const maxFactions = Math.floor(population / minSize)

  let bestFactions = minFactions
  let bestDiff = Infinity

  for (let factions = minFactions; factions <= maxFactions; factions++) {
    const averageSize = population / factions
    const diff = Math.abs(averageSize - idealSize)

    if (diff < bestDiff) {
      bestDiff = diff
      bestFactions = factions
    }
  }

  const baseSize = Math.floor(population / bestFactions)
  const remainder = population % bestFactions
  const result: number[] = []

  for (let i = 0; i < bestFactions; i++) {
    const factionSize = i < remainder ? baseSize + 1 : baseSize
    result.push(factionSize)
  }

  return result
}

const getNeighbors = (rooms: [number, number[]][], roomId: number): number[] => {
  const roomData = rooms.find(([id]) => id === roomId)
  return roomData ? roomData[1] : []
}

/**
 * Returns an array of room IDs that are at a specified distance from a given room ID.
 *
 * @param {Array<[number, number[]]>} rooms - An array of tuples, where each tuple represents a room and its neighboring rooms.
 * @param {number} roomId - The ID of the starting room.
 * @param {number} distance - The distance from the starting room to find other rooms.
 * @param {Set<number>} [visited=new Set()] - A set of room IDs that have already been visited. Used only in recursion.
 * @returns {number[]} - An array of room IDs that are at a specified distance from the starting room.
 *
 * @example
 *
 * const rooms = [
 *   [1, [2, 3]],
 *   [2, [1, 4]],
 *   [3, [1]],
 *   [4, [2]]
 * ];
 *
 * const roomId = 1;
 * const distance = 2;
 *
 * const roomsAtDistance = getRoomsAtDistance(rooms, 1, 2);
 *
 * console.log(roomsAtDistance); // [4]
 */
export const getRoomsAtDistance = (
  rooms: [number, number[]][],
  roomId: number,
  distance: number,
  visited: Set<number> = new Set()
): number[] => {
  if (distance === 0) {
    return [roomId]
  }

  visited.add(roomId)

  const neighbors = getNeighbors(rooms, roomId).filter((neighbor) => !visited.has(neighbor))

  const roomsAtDistance = neighbors.flatMap((neighbor) =>
    getRoomsAtDistance(rooms, neighbor, distance - 1, new Set(visited))
  )

  return Array.from(new Set(roomsAtDistance))
}