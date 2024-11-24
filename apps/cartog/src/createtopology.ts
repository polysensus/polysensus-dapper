import {
  parseDungeon,
  facingDirection as watFacingDirection,
  LogicalTopology,
  Furnishing as CTFurnishing,
  // Furniture as CTFurniture,
  Furniture,
} from "@polysensus-dapper/svelte-onepagedungeon"
import type { Dungeon } from "@polysensus-dapper/svelte-onepagedungeon";

// import type { JSONConnection, Dungeon, ObjectType, Point, Door } from "@polysensus-dapper/svelte-onepagedungeon";
import type {
  JSONConnection as CTJSONConnection,
  JSONLocationItem as CTJSONLocationItem,
  JSONLocation as CTJSONLocation,
} from "@polysensus-dapper/svelte-onepagedungeon";

import type {
  Door as WatDoor,
  Room as WatRoom,
  Exit as WatExit,
} from "@polysensus-dapper/svelte-onepagedungeon";

import type { DungeonOptions } from "./jsondungeon.js";
import { loadJsonDugeon, dungeonName, resolveSeed } from "./jsondungeon.js";

export function buildTree(options: DungeonOptions) {
  const topo = loadTopology(options);
  return topo.commit();
}

export function loadTopology(options: DungeonOptions): LogicalTopology {
  const watabouJson = loadJsonDugeon(options.file);
  const name = dungeonName(watabouJson);
  const outputDir = options.output.replace("<name>", name);
  const seed = resolveSeed(options, watabouJson);
  const dungeon = parseDungeon(seed, watabouJson);
  return createTopology(dungeon, name);
}

export function createTopology(dungeon: Dungeon, name: string = "A Chaintrap Dungeon"): LogicalTopology {

  const opposite = (dir: string): string => {
    const opp = { "north": "south", "east": "west", "south": "north", "west": "east" }[dir];
    if (!opp) throw new Error(`Invalid direction ${dir}`);
    return opp;
  }

  // chaintrap direction codes are anti-clockwise, watabou are clockwise
  const ctdirnum = (dir: string): number => {
    const n = { "north": 0, "west": 1, "south": 2, "east": 3 }[dir];
    if (typeof n === 'undefined') throw new Error(`Invalid direction ${dir}`);
    return n;
  }
  const ctnumopposit = (dir: number): number => {
    const n = { 0: 2, 1: 3, 2: 0, 3: 1 }[dir];
    if (typeof n === 'undefined') throw new Error(`Invalid direction ${dir}`);
    return n;
  }

  // watabou direction codes are clockwise, chaintrap are anti-clockwise
  const watdirnum = (dir: string): number => {
    const n = { "north": 0, "east": 1, "south": 2, "west": 3 }[dir];
    if (typeof n === 'undefined') throw new Error(`Invalid direction ${dir}`);
    return n;
  }

  const connections: Record<number, CTJSONConnection & WatDoor & { id: number }> =
    dungeon.doors.reduce((acc: Record<number, CTJSONConnection & WatDoor & { id: number }>, door: WatDoor & { id: number }) => {
      const facing = watFacingDirection(door)
      const conn: CTJSONConnection & WatDoor & { id: number } = {
        id: door.id,
        type: door.type,
        dir: door.dir,
        x: door.x,
        y: door.y,
        joins: [-1, -1],
        join_sides: [-1, -1],
        points: [[door.x, door.y]],
      };
      acc[door.id] = conn;
      return acc;
    }, {});

  const watFinish: CTJSONLocation & WatRoom = {
    id: dungeon.rooms.length,
    description: "Finish",
    area: "1m x 1m",
    notes: [],
    exits: [],
    corridors: [[], [], [], []],
    main: false,
    inter: false,
    x: 0, y: 0, w: 0, h: 0, l: 0
  }


  // The relationship bewtween the watabou format and the chaintrap format is esesntially 1:1 for things that matter.
  // * Watabou room or area-rect has at most 4 exits - chain trap has arbitrary exits per side.
  // * Watabou sorts exits clockwise from the top - chaintrap sorts anti-clockwise.
  // * Watabou doors corresponds to a chaintrap connection/corridor
  // * Watabou doors (connections) are unit squares
  // * Watabou doors (connections) join only opposite sides, chaintrap joins allow for right angled corridor bends.
  const locations: Record<number, CTJSONLocation & WatRoom> = dungeon.rooms.reduce((acc: Record<number, CTJSONLocation & WatRoom>, room: WatRoom) => {
    const loc: CTJSONLocation & WatRoom = {
      id: room.id,
      description: room.description,
      comment: room.description,
      area: room.area,
      main: true,
      inter: false,
      notes: room.notes,
      exits: room.exits,
      corridors: [[], [], [], []],
      x: room.x,
      y: room.y,
      w: room.w,
      l: room.h,
      h: room.h,
    };
    room.exits.forEach((exit: WatExit) => {
      const iexit = ctdirnum(exit.towards)
      // watabou models connections as 1x1 locations, each of which has an id in
      // the same space as the rooms.  the connections are all numerically
      // larger than legit locations.
      loc.corridors[iexit].push((typeof exit.to === 'string') ? watFinish.id : exit.to);

      const ijoin = exit.isFacing ? 0 : 1;

      connections[exit.door.id].joins[ijoin] = room.id;

      // the join side is the opposite of the exit side
      connections[exit.door.id].join_sides[ijoin] = ctdirnum(opposite(exit.towards));

      return loc;
    })
    acc[room.id] = loc;
    return acc;
  }, {});

  // satisfies some merkle encoding requirements
  //locations[watFinish.id] = watFinish;

  // find the finish location
  const finish = Object.values(locations).filter((loc) => {
    // exits that lead outside are marked as via connection -1
    // watabou supports many, the merkleization currently only supports one
    for (const exit of loc.exits)
      if (exit.to === 'outside') return true;
    return false;
  })[0];
  const finishExit = finish.exits.filter((exit) => exit.to === 'outside')[0];
  const finishSide = ctdirnum(finishExit.towards);

  // clean up the entrances
  let dangling = [];
  for (const [id, conn] of Object.entries(connections)) {
    if (conn.joins[0] === -1 || conn.joins[1] === -1) {
      dangling.push(id);
      /*;
      if (conn.joins[0] === -1) {
        if (conn.joins[1] === -1) throw new Error("null connection");
        conn.joins = [watFinish.id, conn.joins[1]];
        conn.join_sides[0] = ctnumopposit(conn.join_sides[1]);
        watFinish.corridors[conn.join_sides[0]].push(conn.id);
      }
      if (conn.joins[1] === -1) {
        if (conn.joins[0] === -1) throw new Error("null connection");
        conn.joins = [conn.joins[1], watFinish.id];
        conn.join_sides[1] = ctnumopposit(conn.join_sides[0]);
        watFinish.corridors[conn.join_sides[1]].push(conn.id);
      }
    */}
  }

  // remove the corridor connection (watabou has one connection per side)
  // finish.corridors[finishSide] = [];

  const finishItem: CTJSONLocationItem = {
    unique_name: "finish_exit",
    labels: ["victory_condition"],
    type: "finish_exit",
    choiceType: "finish_exit",
    data: { location: finish.id, side: finishSide, exit: 0 },
    meta: { notes: [finishExit.description] },
  }
  if (typeof finishExit.note === 'string')
    finishItem.meta.notes.push(finishExit.note);

  const topo = new LogicalTopology();
  topo.extendJoins(Object.values(connections).sort((a, b) => a.id - b.id));
  topo.extendLocations(Object.values(locations).sort((a, b) => a.id - b.id));
  topo.placeFinish(new CTFurnishing(0, finishItem));
  topo.placeFurniture(new Furniture({ map: { name, beta: "" }, items: [finishItem] }));
  return topo;
}