/**
 * Deterministic RNG based on seed
 */
export class RandomNumberGenerator {
  private static instance: RandomNumberGenerator
  private seed: number

  private static readonly a: number = 1664525
  private static readonly c: number = 1013904223
  private static readonly m: number = 2 ** 32

  private constructor(seed: number) {
    this.seed = seed
  }

  /** Designed to be called once per dungeon, setting a seed makes the pseudorandom output deterministic.*/
  public static setSeed(seed: number): void {
    RandomNumberGenerator.instance = new RandomNumberGenerator(seed)
  }

  public static getInstance(): RandomNumberGenerator {
    if (!RandomNumberGenerator.instance) {
      throw new Error("Call RandomNumberGenerator.setSeed(<seed>) before getInstance()")
    }
    return RandomNumberGenerator.instance
  }

  public static hasInstance = (): boolean => !!RandomNumberGenerator.instance

  public getNext(): number {
    this.seed = (RandomNumberGenerator.a * this.seed + RandomNumberGenerator.c) % RandomNumberGenerator.m
    return this.seed / RandomNumberGenerator.m
  }

  public nextInt(min: number, max: number): number {
    return min + Math.floor(this.getNext() * (max - min))
  }
}

export const getRandomNumber = (): number => RandomNumberGenerator.getInstance().getNext()

/** Return a random value and the same random value each time until
 * calling determineRandomValue(true) */
export const determineRandomValue = (() => {
  let value: number
  return (reset?: boolean) => {
    if (value === undefined || reset === true) {
      value = getRandomNumber()
    }
    return value
  }
})()

/** Return a value according to the inverse power law */
export const inverseSquareRandom = (value = 0, power = 2): number => {
  if (value > 100) return value
  const prob = 1 / Math.pow(value + 2, power)
  // no terminating recursion!!! YOLO!! (｀◔ ω ◔´)ψ
  return getRandomNumber() < prob ? inverseSquareRandom(value + 1) : value
}