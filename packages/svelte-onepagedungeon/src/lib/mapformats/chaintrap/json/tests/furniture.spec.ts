// @ts-check
import { describe, it, expect } from "vitest";

import { Furniture } from "../../furniture.js";
import furnishings from "./data/map02-furnishings.json" assert { type: "json" };

describe("Furniture tests", function () {
  it("Should load furnishings data", async function () {
    const f = new Furniture(furnishings);
    expect(f.items.length).to.equal(3);
    expect(f.index?.identified["finish_exit"]).to.exist;
    expect(f.index?.identified["chest_1"]).to.exist;
    expect(f.byName("finish_exit")).to.not.throw;
    expect(f.byName("chest_1")).to.not.throw;
    expect(f.byType("finish_exit").length).to.equal(1);
    expect(f.byType("fatal_chest_trap").length).to.equal(1);
  });
});
