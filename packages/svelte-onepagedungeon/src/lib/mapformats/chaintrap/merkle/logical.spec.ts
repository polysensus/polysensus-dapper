// @ts-check
import { describe, it, expect } from "vitest";

import { LogicalTopology } from "./logical.js";
//create a new databas
import maps from "../json/tests/data/map02.json" assert { type: "json" };
import furnishings from "../json/tests/data/map02-furnishings.json" assert { type: "json" };

import { Furniture } from "../furniture.js";
import type { JSONLocation } from "../json/location.js";
import type { JSONConnection } from "../json/connection.js";
import { ObjectTypes } from "../objecttypes.js";

const { map02 } = maps;

describe("LogicalTopology tests", function () {
  it("Should build merkle for standard test map", function () {
    const topo = new LogicalTopology();
    topo.extendJoins(map02.model.corridors as JSONConnection[]); // rooms 0,1 sides EAST, WEST
    topo.extendLocations(map02.model.rooms as JSONLocation[]);
    const furniture = new Furniture(furnishings);
    topo.placeFinish(furniture.byName("finish_exit"));
    const tree = topo.commit();

    for (const [i, v] of tree.entries()) {
      const proof = tree.getProof(i);
      // console.log("Value:", v);
      // console.log("Proof:", proof);
    }
  });

  it("Should build merkle for standard furnished test map", function () {
    const topo = new LogicalTopology();
    topo.extendJoins(map02.model.corridors as JSONConnection[]); // rooms 0,1 sides EAST, WEST
    topo.extendLocations(map02.model.rooms as JSONLocation[]);
    const furniture = new Furniture(furnishings);
    topo.placeFinish(furniture.byName(ObjectTypes.S.finish_exit));
    topo.placeFurniture(furniture);
    const tree = topo.commit();

    for (const [i, v] of tree.entries()) {
      const proof = tree.getProof(i);
      // console.log("Value:", v);
      // console.log("Proof:", proof);
    }
  });

  it("Should throw because join and location access disagree", function () {
    const topo = new LogicalTopology();
    topo.extendJoins([{ joins: [0, 1], join_sides: [3, 1], points: [] }]); // rooms 0,1 sides EAST, WEST
    topo.extendLocations([
      { corridors: [[], [], [], [0]], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
      { corridors: [[], [3], [], []], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
    ]);

    // Note the which=0 end of the join is fine
    const access = topo.joinAccess(0, 0);
    expect(access.location).to.equal(0);
    expect(access.side).to.equal(3);
    expect(access.exit).to.equal(0);

    // But the location referred to by the which=1 end doesn't have an entry in
    // the access list for the side corresponding to the join.
    expect(() => topo.joinAccess(0, 1)).to.throw(
      /join 0 does not have a corresponding access/
    );
  });

  it("Should return join access for minimal two location topology", function () {
    const topo = new LogicalTopology();
    topo.extendJoins([{ joins: [0, 1], join_sides: [3, 1], points: [] }]); // rooms 0,1 sides EAST, WEST
    topo.extendLocations([
      { corridors: [[], [], [], [0]], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
      { corridors: [[], [0], [], []], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
    ]);

    let access = topo.joinAccess(0, 0);
    expect(access.location).to.equal(0);
    expect(access.side).to.equal(3);
    expect(access.exit).to.equal(0);

    access = topo.joinAccess(0, 1);
    expect(access.location).to.equal(1);
    expect(access.side).to.equal(1);
    expect(access.exit).to.equal(0);
  });

  it("Should error because the join is not referenced by the location it indicates", function () {
    const topo = new LogicalTopology();

    // @ts-ignore
    expect(() => topo.joinAccess(0, 3)).to.throw(/which must be 0 or 1, not 3/);
    expect(() => topo.joinAccess(1, 0)).to.throw(/join index 1 is out.*/);
  });

  it("Should error because which or join i is out of range", function () {
    const topo = new LogicalTopology();
    // @ts-ignore
    expect(() => topo.joinAccess(0, 3)).to.throw(/which must be 0 or 1, not 3/);
    expect(() => topo.joinAccess(1, 0)).to.throw(/join index 1 is out.*/);
  });
});
