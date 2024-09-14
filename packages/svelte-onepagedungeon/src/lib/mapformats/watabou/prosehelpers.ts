import type { EnemyClass, Exit, Room } from "./formatprimitives.js"

import { determineRandomValue } from "./rng.js"

const hasVerb = (str: string) => (/(holds|hides)/.test(str) ? "" : /^\w*s\s/.test(str) ? "are " : "is ")

/** Append "." to str and ensure there is only one, as long as there is not already a ! or ? */
export const period = (str: string): string =>
  str.length === 0
    ? ""
    : /[?!]$/.test(str.trim())
      ? str
      : /\.$/.test(str.trim())
        ? period(str.trim().slice(0, -1))
        : `${str}.`

/** Format the string using successive formats, e.g. formatString("an orc", toThe, isHere, period) // -> "The orc is here. " */
export const formatString = (str: string, ...rest: ((str: string) => string)[]): string =>
  rest?.length === 0 ? str : formatString(rest[0](str), ...rest.slice(1))

/** Alias for 'formatString' */
export const fmt = formatString

export const toTitleCase = (str: string): string => {
  const smallWords = [
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "en",
    "for",
    "if",
    "in",
    "of",
    "on",
    "or",
    "the",
    "to",
    "v",
    "via",
    "vs",
  ]
  const words = str.toLowerCase().split(" ")
  const titleCasedWords = words.map((word, index) => {
    if (index === 0 || !smallWords.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    } else {
      return word
    }
  })
  return titleCasedWords.join(" ")
}

/** Add a 'is/are here at the end of a sentence */
export const isHere = (str: string) => (str.startsWith("The") ? str : `${capitalize(str)} ${hasVerb(str)} here`)

/** Add a 'Here is/are at the beginning of a sentence */
export const hereIs = (str: string) => (str.startsWith("The") ? str : `Here ${hasVerb(str)}${deCapitalize(str)}.`)

/** add a 'There is/are ... here. */
export const thereIs = (str: string) =>
  str.startsWith("The") ? str : `There ${hasVerb(str)}${deCapitalize(str)} here.`

/** Make only the first letter lower-case */
export const deCapitalize = (str: string) => `${str.charAt(0).toLowerCase() + str.slice(1)}`

/** Capitalize the string */
export const capitalize = (str: string) => `${str.charAt(0).toUpperCase() + str.slice(1)}`

/** Replace 'a' with 'the' */
export const toThe = (str: string) => str.replace(/\b[Aa]n?\b/g, "the")

/** add a or an depending on the string */
export const aAn = (str: string) =>
  ["a", "e", "i", "o", "u"].includes(str.charAt(0).toLowerCase()) ? `an ${str}` : `a ${str}`

/** remove a or an from the front of a string */
export const deAAn = (str: string) => str.replace(/^[Aa]n?\s+/, "")

/** to singular */
export const singularize = (word: string) => {
  const exceptions: { [key: string]: string } = {
    sphinxes: "sphinx",
  }

  const singular = exceptions[word] ?? word.replace(/ves$/, "f").replace(/s$/, "")
  return singular
}

export const toWords = (num: number) => {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

  if (num >= 100) return "many"
  if (num === 0) return "zero"
  if (num < 20) return [...ones, ...teens][num]

  const numTens = Math.floor(num / 10)
  const numOnes = num - numTens * 10

  return `${tens[numTens]} ${ones[numOnes]}`.trim()
}

/** Add count number and properly pluralize an item */
export const addCount = (count: number, word: string): string => {
  if (count === 1 || isNaN(count)) return word
  if (word === "some gold") {
    if (count === 2) return "gold"
    return "a lot of gold"
  }

  // non-count mass items will not start with a/an
  if (deAAn(word) === word) return word

  const countword = toWords(count)

  // takes care of properly pluralizing the correct object
  // {object: 'an eldritch potion', prepositional: ' of healing'} => "eldritch potions of healing"
  const { object, prepositional } = word.match(/(?<object>[\w\s,]+)(?<prepositional> of (?:an? )?\w+)/)?.groups || {
    object: word,
  }

  const pluralObject = pluralize(deAAn(object))

  if (prepositional) {
    const isACreature = /of an? /.test(prepositional)
    if (isACreature && count !== 1) {
      const { creature } = word.match(/[\w\s,]+ of an? (?<creature>\w+)/)?.groups ?? {}
      return `the ${pluralObject} of ${countword} ${pluralize(deAAn(creature))}`
    } else return `${countword} ${pluralObject}${prepositional}`
  }

  return `${countword} ${pluralObject}`
}

const pluralize = (word: string) => {
  const irregular: { [key: string]: string } = {
    // Add more irregular plurals if needed
    cherub: "cherubim",
    dice: "dice",
    die: "dice",
    hero: "heroes",
    mage: "magi",
    ophan: "ophanim",
    seraph: "seraphim",
  }

  if (irregular[word]) {
    return irregular[word]
  }

  if (/man$/i.test(word)) {
    return word.replace(/man$/, "men")
  }

  if (/(s|x|z|sh|ch)$/i.test(word)) {
    return word + "es"
  }

  if (/y$/i.test(word) && !/[aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + "ies"
  }

  if (/ff$/i.test(word)) {
    return word.slice(0, -2) + "ves"
  }

  if (/f$/i.test(word)) {
    return word.slice(0, -1) + "ves"
  }

  if (/fe$/i.test(word)) {
    return word.slice(0, -2) + "ves"
  }

  return word + "s"
}
/** comma list */
export const toList = (items: string[]): string => {
  if (items.length === 0) return "nothing"
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${deCapitalize(items[1])}`
  return `${items[0]}, ${toList(items.slice(1))}`
}

// `the looted corpse of the orc`
// `the corpse of the orc`
// `an orc`

export const groupAgents = (agentDescriptions: string[]) => {
  const tally = tallyArray(agentDescriptions)
  const wordCounts = tally.map(([count, item]) => addCount(count, item))
  const list = `${toList(wordCounts)} ${agentDescriptions.length === 1 ? "is" : "are"} here.`
  return capitalize(list)
}

/** Create inventory message */
export const inventoryMessage = (inventory?: string[]) => {
  if (!inventory) return ""
  const keySort = (a: string, b: string) => (a.endsWith("key") ? -1 : b.endsWith("key") ? 1 : 0) // keys should always be the first item listed
  const itemCount = inventory
    // .map((item) => item.toLowerCase())
    .sort(keySort)
    .reduce((acc: { [key: string]: number }, curr: string) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }), {})
  const items = Object.entries(itemCount).map(([item, count]: [string, number]) => addCount(count, item))
  return toList(items)
}

/** Do keys match keyholes */
export const doKeysMatchKeyholes = (keyholes: string, keys: string[]) => {
  if (keyholes.startsWith("a") && keys.length) return true
  if (keyholes.startsWith("two") && keys.length === 2) return true
  if (keyholes.startsWith("three") && keys.length === 3) return true
  if (keyholes.startsWith("four") && keys.length === 4) return true
  return false
}

const pastToPreset = (verb: string) => {
  switch (verb) {
    case "examined":
    case "stroked":
    case "shaken":
    case "solved":
    case "inhaled":
    case "breathed":
      return verb.slice(0, -1)
    case "lit":
      return "light"
    case "drank":
      return "drink"
    case "sat":
      return "sit"
    case "struck":
      return "strike"

    default:
      return verb.replace(/(ed)$/, "")
  }
}

export const curiousImperative = ({ feature, trigger, object }: { [key: string]: string }): string => {
  const directObject = object ? `the ${object}` : feature
  switch (trigger) {
    case "the candles on it are lit":
      return `Light the candles on ${toThe(directObject)}`
    case "a sacrifice is made":
      return `Make a sacrifice on ${toThe(directObject)}`
    case "the lever is pulled":
      return `Pull the lever of ${toThe(directObject)}`
    case "the knob is touched":
      return `Open ${toThe(directObject)}`
    case "a coin is dropped into it":
      return `Drop a coin into ${toThe(directObject)}`
    case "struck hard":
      return `Strike the ${object} hard`

    default: {
      const [past, preposition] = trigger.split(" ")
      const verb = pastToPreset(past)
      const addSpace = (str: string) => (str ? `${str} ` : "")
      return `${capitalize(verb)} ${addSpace(preposition)}${toThe(directObject)}`
    }
  }
}

export const curiousMessage = ({ trigger, action, feature, object }: { [key: string]: string }): string => {
  const imperative = curiousImperative({ feature, action, trigger, object })
  const actionResult = action.replace(/a person/, "you").replace(/\bhis\b/, "your")
  if (trigger === "the knob is touched") return `When you touch the knob, ${toThe(feature)} ${actionResult}`
  return `When you ${deCapitalize(imperative)}, it ${actionResult}.`
}

const bossAdj = [
  "serpent",
  "viper",
  "spider",
  "raven",
  "dread",
  "mad",
  "shadow",
  "dark",
  "blood",
  "cursed",
  "iron",
  "golden",
  "diamond",
  "jade",
  "storm",
  "fire",
  "ice",
  "void",
  "purple",
  "black",
  "red",
  "white",
  "vampire",
  "undead",
  "zombie",
  "silent",
  "moon",
  "immortal",
  "shadow",
  "fallen",
  "obsidian",
  "scarlet",
  "great",
  "one-eyed",
  "lich",
  "amber",
  "leper",
  "grey",
  "blind",
  "demon",
  "blasphemous",
]

const bossNoun = [
  "king",
  "queen",
  "prince",
  "emperor",
  "lord",
  "lady",
  "baron",
  "magus",
  "savant",
  "titan",
  "god",
  "dragon",
  "one",
  "master",
  "general",
  "beast",
  "knight",
  "witch",
  "lady",
  "reaper",
  "messiah",
  "priest",
  "oracle",
]

const angels = ["seraph", "cherub", "ophan", "potentate", "archangel", "angel"]
/**
    Alu: Akkadian, 2000-1000 BCE, malevolent spirits associated with disease and illness
    Aswang: Filipino, pre-colonial era, shapeshifting demon who preys on pregnant women and children
    Churel: South Asian, pre-Islamic era, female ghost or demon who died during childbirth and preys on children and men
    Dybbuk, Jewish folklore, 16th century - a malevolent spirit that possesses a living person.
    Ekimmu (Assyrian/Babylonian, 1350-610 BCE): ghosts of those who were not buried properly, said to cause disease and plague.
    Empusa (Greek, 8th-4th century BCE): a demoness who preyed on young men, often depicted with one leg made of bronze and the other of an ass.
    Empusa: Greek, 5th century BCE, shapeshifting female demon who preys on men
    Gallu (Babylonian, 2000-1000 BCE): demons associated with the underworld and often depicted with wings and talons.
    Gidim (Sumerian/Babylonian, 4000-2000 BCE): spirits of the dead who wandered the earth, often associated with disease and misfortune.
    Imp, European, Medieval Europe, A mischievous, often malevolent spirit, similar to a fairy, that is said to be able to shape shift and cause chaos. Lilin, Jewish folklore, 5th century BC - a class of female demons who prey on men and babies.
    Incubus: Medieval Europe, 12th century CE, male demon who seduces women in their dreams
    Jinn: Islamic, 7th century CE, supernatural creatures with free will who can be benevolent or malevolent
    Kappa (Japanese, pre-7th century CE): a water spirit that kidnapped and drowned children and livestock, often depicted with a beak-like mouth and a bowl-like depression on the top of its head.
    Keres (Greek, 8th-4th century BCE): spirits of violent or cruel death, often associated with war and battlefields.
    Lamia (Greek, 8th-4th century BCE): a child-eating demoness, often depicted with a serpent's tail and multiple breasts.
    Lemure, Roman, Ancient Rome, A malevolent spirit or ghost of the deceased who was not properly buried or who was murdered, causing them to become restless and vengeful.
    Lilu (Akkadian, 2334-2154 BCE): malevolent night spirits that caused disease and death, often associated with sexual desire and nocturnal emissions.
    Mara, Buddhist and Hindu mythology, 1st century AD - a demon that brings nightmares and sleep paralysis.
    Mormo (Greek, 8th-4th century BCE): a female vampire who attacked children and infants, often depicted with a grotesque appearance and disheveled hair.
    Nuckelavee, Scottish folklore, 16th century - a malevolent spirit that is half-human and half-horse.
    Oni, Japanese folklore, 7th century - a type of malevolent spirit or demon that causes trouble and misfortune.
    Rakshasa: Hindu, pre-400 BCE, shapeshifting demon who preys on humans and eats human flesh
    Rusalka, Slavic mythology, pre-Christian era - a female water spirit that drowns people.
    Strix (Roman, 753 BCE-476 CE): a bird-like demoness that drank the blood of infants and young children.
    Succubus (European, Middle Ages): a demon that preyed on sleeping men, often depicted as a female with bat wings and a serpent's tail.
    Tengu (Japanese, pre-7th century CE): bird-like spirits that caused mischief and chaos, often depicted with long noses and wings.
    Utukki (Babylonian, 2000-1000 BCE): a group of malevolent spirits that caused various afflictions, such as disease, possession, and misfortune.
    Wendigo, Native American mythology, pre-colonial era - a malevolent spirit associated with cannibalism and winter.
    Yōkai: Japanese, pre-8th century CE, a class of supernatural beings that includes malevolent spirits and demons
    */

const demons = [
  "alu",
  "aswang",
  "churel",
  "dybbuk",
  "ekimmu",
  "empusa",
  "empusa",
  "gallu",
  "gidim",
  "imp",
  "incubus",
  "jinn",
  "kappa",
  "keres",
  "lamia",
  "lemure",
  "lilu",
  "mara",
  "mormo",
  "nuckelavee",
  "oni",
  "rakshasa",
  "rusalka",
  "strix",
  "succubus",
  "tengu",
  "utukki",
  "wendigo",
  "yōkai",
]

const religiousElites = [
  "acolyte",
  "novitiate",
  "cleric",
  "monk",
  "paladin",
  "preacher",
  "prophet",
  "templar",
  "zealot",
]

const royalElites = [
  "duke",
  "earl",
  "marquess",
  "baron",
  "viscount",
  "prince",
  "count",
  "archduke",
  "chancellor",
  "admiral",
  "commander",
  "captain",
  "lieutenant",
  "general",
  "colonel",
  "major",
  "captain",
  "lieutenant",
  "sergeant",
  "knight",
]
const magusEliteClass: string[] = [
  "acolyte",
  "apprentice",
  "cultist",
  "enchanter",
  "invoker",
  "mage",
  "magician",
  "occultist",
  "prodigy",
  "sage",
  "seer",
  "sorcerer",
  "spellbinder",
  "thaumaturge",
  "warlock",
  "wizard",
  "necromancer",
  "conjuror",
]

const powerfulBeingsElite = [
  "champion",
  "exarch",
  "sentinel",
  "oracle",
  "vindicator",
  "arbiter",
  "prodigy",
  "paragon",
  "zealot",
  "scion",
  "crusader",
  "harbinger",
  "mystic",
  "ascendant",
  "paladin",
]

const militaryElite = [
  "berserker",
  "champion",
  "crusader",
  "exemplar",
  "gladiator",
  "myrmidon",
  "paladin",
  "templar",
  "warden",
  "warrior",
]

export const getEliteNoun = (bossNoun?: string) => {
  const format = (arr: string[]) => capitalize(getRandomElementOf(arr))
  switch (bossNoun) {
    // Royalty bosses
    case "king":
    case "queen":
    case "prince":
    case "emperor":
      return format(royalElites)

    // Magic-user bosses
    case "magus":
    case "savant":
    case "witch":
      return format(magusEliteClass)

    // God boss
    case "god":
      return format(angels)

    // Powerful being bosses
    case "titan":
    case "dragon":
    case "reaper":
      return format(powerfulBeingsElite)

    // Military bosses
    case "lord":
    case "lady":
    case "baron":
    case "general":
    case "knight":
      return format(militaryElite)

    // Religious figure bosses
    case "messiah":
    case "oracle":
    case "priest":
      return format(religiousElites)

    // Default case for unrecognized boss types
    default:
      return getRandomElementOf(demons)
  }
}

const raiders = ["orc", "goblin", "hobgoblin", "kobold", "gnoll", "pirate", "bandit", "cultist", "thug"]

export const getRandomRaider = (() => {
  let raider: string
  return (reset?: boolean) => {
    if (raider === undefined || reset === true) {
      // Generate a new random value on the first call
      raider = getRandomElementOf(raiders)
    }
    return raider
  }
})()

export const getRandomBossName = () =>
  `${capitalize(getRandomElementOf(bossAdj))} ${capitalize(getRandomElementOf(bossNoun))}`

const beastAdj = ["huge", "giant", "terrifying", "fearsome", "undead"]
const monsterAdj = [
  "venomous",
  "mutant",
  "man-eating",
  "albino",
  "blood-sucking",
  "spectral",
  "soul-eating",
  "intelligent",
  "fire-breathing",
  "invisible",
]

const monsterNoun = [
  "dragon",
  "basilisk",
  "manticore",
  "beholder",
  "sphinx",
  "chimera",
  "hydra",
  "wyvern",
  "wyrm",
  "ogre",
]

export const isMonster = (name: string) => name && monsterNoun.some((noun) => name.includes(noun))
export const hasMonsterAttributes = (name: string) => name && monsterAdj.some((adj) => name.includes(adj))

export const getRandomMonsterName = (beast?: string) => {
  if (beast && !isMonster(beast)) {
    // if there's a beast, then it's going to be a "big, scary beast"
    const bigAdj = getRandomElementOf(beastAdj)
    const monAdj = hasMonsterAttributes(beast) ? "" : `${getRandomElementOf(monsterAdj)} `
    const name = `${monAdj}${beast}`
    const monsterName = bigAdj ? `${bigAdj}, ${name}` : name
    return aAn(monsterName)
  }
  // otherwise it's rarely going to be a "spectral monster" and even more rarely a "big, spectral monster"
  const monster = beast ?? monsterNoun[Math.floor(determineRandomValue() * monsterNoun.length)]
  const monsterRandom = getRandomNumber()
  if (monsterRandom <= 0.01) {
    const bigAdj = getRandomElementOf(beastAdj)
    const monAdj = hasMonsterAttributes(monster) ? "" : `${getRandomElementOf(monsterAdj)} `
    const name = `${monAdj}${monster}`
    const monsterName = bigAdj ? `${bigAdj}, ${name}` : name
    return aAn(monsterName)
  } else if (monsterRandom <= 0.1) {
    const monAdj = hasMonsterAttributes(monster) ? "" : `${getRandomElementOf(monsterAdj)} `
    const monsterName = `${monAdj}${monster}`
    return aAn(monsterName)
  } else return aAn(monster)
}
const treasureItems = [
  "box",
  "bracelet",
  "brooch",
  "chain",
  "chess piece",
  "comb",
  "crown",
  "dice",
  "egg",
  "figurine",
  "gems",
  "idol",
  "mask",
  "medallion",
  "mirror",
  "necklace",
  "pin",
  "ring",
  "some gold",
  "statuette",
  "tiara",
]

export const getRandomTreasureItem = () => getRandomElementOf(treasureItems)

export const isTreasure = (item: string) =>
  treasureItems.some((treasure) => item.match(new RegExp(`\\b${treasure}\\b`)))

const weapons = [
  "axe",
  "blade",
  "bow",
  "dagger",
  "flail",
  "glaive",
  "halberd",
  "hammer",
  "javelin",
  "katana",
  "knife",
  "mace",
  "rapier",
  "scimitar",
  "spear",
  "staff",
  "sword",
]

export const isWeapon = (item: string) => weapons.some((weapon) => new RegExp(`\\b${weapon}\\b`).test(item))

const armors = [
  "breastplate",
  "cape",
  "chainmail",
  "cloak",
  "helm",
  "leather armor",
  "mantle",
  "robe",
  "scale mail",
  "scarf",
  "shield",
]
export const isArmor = (item: string) => armors.some((armor) => new RegExp(`\\b${armor}\\b`).test(item))

const magicItems = [
  "amulet",
  "ball",
  "book",
  "cape",
  "carpet",
  "censer",
  "coin",
  "compass",
  "cube",
  "doll",
  "flute",
  "gem",
  "grimoire",
  "horn",
  "hourglass",
  "lamp",
  "lantern",
  "looking glass",
  "needle",
  "orb",
  "quill",
  "relic",
  "rod",
  "scroll",
  "skull",
  "spellbook",
  "stone",
  "tablet",
  "tarot deck",
  "tome",
  "wand",
]
export const isMagic = (item: string) =>
  [
    "eldritch",
    "enchanted",
    "holy",
    "life stealing",
    "lightning",
    "magic",
    "mysterious",
    "slaying",
    "smiting",
    "strange",
    "uncanny",
    "unholy",
    "vengeance",
    "venom",
    "vorpal",
    "weird",
    ...magicItems,
  ].some((magic) => new RegExp(`\\b${magic}\\b`).test(item))

export const getInventory = (enemyClass: EnemyClass): string[] => {
  const chance = getRandomNumber()
  const getRandomPeonItem = () =>
    getRandomElementOf(["a potion of healing", "a potion of healing", aAn(getRandomElementOf([...weapons, ...armors]))])
  const getRandomMagicArmament = () =>
    aAn(`${getRandomElementOf(["magic", "eldritch", "glowing"])} ${getRandomElementOf([...weapons, ...armors])}`)
  const getRandomMonsterItem = () => aAn(getRandomElementOf([...magicItems, ...armors, ...weapons]))

  switch (enemyClass) {
    case "peon":
      if (chance < 0.01) return [getRandomPeonItem(), getRandomPeonItem()]
      if (chance < 0.2) return [getRandomPeonItem()]
      if (chance < 0.3) return ["some gold"]
      break

    case "monster":
      if (chance < 0.01) return [getRandomMonsterItem(), getRandomMonsterItem(), getRandomMonsterItem()]
      if (chance < 0.1) return [getRandomMonsterItem(), getRandomMonsterItem()]
      if (chance < 0.5) return [getRandomMonsterItem(), "a potion of healing"]
      break

    case "elite":
      if (chance < 0.1) return [getRandomMagicArmament(), getRandomMagicArmament()]
      if (chance < 0.5) return [getRandomMagicArmament(), "a potion of healing"]
      break

    case "boss": {
      return [
        getRandomMagicArmament(),
        getRandomMonsterItem(),
        getRandomMagicArmament(),
        getRandomMagicArmament(),
        getRandomMonsterItem(),
        getRandomMagicArmament(),
      ]
    }
    default:
      return []
  }
  return []
}
