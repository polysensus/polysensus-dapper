// @ts-check
import { describe, it, expect } from "vitest";

import { LogicalTopology } from "./logical.js";
//
import maps from "../json/tests/data/map02.json" assert { type: "json" };
// import { MerkleCodec } from "./etherscodec.js";
import { LeafObject } from "./leafobject.js";
import { ObjectTypes } from "../objecttypes.js";
// import type { ObjectType } from "../objecttypes.js";
import { Furniture } from "../furniture.js";
import { MerkleCodec, type PreparedObject } from "./etherscodec.js";
import { LocationChoices } from "./locationchoices.js";

const { map02 } = maps;

describe("LogicalTopology entryCommit tests", function () {
  it("Should build a location exit choice proof stack", async function () {

    // build and verify a proof stack showing that a specific location exits are bound to exit menu choice inputs
    const topo = new LogicalTopology();
    topo.extendJoins([{ joins: [0, 1], join_sides: [3, 1], points: [] }]); // rooms 0,1 sides EAST, WEST
    topo.extendLocations([
      { corridors: [[], [], [], [0]], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
      { corridors: [[], [0], [], []], main: true, inter: false, l: 0, w: 0, x: 0, y: 0 },
    ]);
    const furniture = new Furniture({
      map: { name: "test", beta: "0x" },
      items: [
        {
          unique_name: "finish_exit",
          labels: ["victory_condition"],
          type: "finish_exit",
          choiceType: "finish_exit",
          data: { location: 1, side: 3, exit: 0 },
          meta: { notes: ["The exit that leads to victory"] },
        },
      ],
    });
    topo.placeFurniture(furniture);
    const tree = topo.commit();

    // location
    const location0 = topo.leaf(ObjectTypes.S.location_choices, 0);
    const location0Prepared = topo.prepareLeaf(location0);
    const location0Proof = tree.getProof(location0Prepared);
    const location0Exit = topo.leaf(ObjectTypes.S.exit, topo.exitId(0, 3, 0));
    const location0ExitPrepared = topo.prepareLeaf(location0Exit);
    const location0ExitProof = tree.getProof(location0ExitPrepared);

    const location1 = topo.leaf(ObjectTypes.S.location_choices, 1);
    const location1Prepared = topo.prepareLeaf(location1);
    const location1Proof = tree.getProof(location1Prepared);
    const location1Exit = topo.leaf(ObjectTypes.S.exit, topo.exitId(1, 1, 0));
    const location1ExitPrepared = topo.prepareLeaf(location1Exit);
    const location1ExitProof = tree.getProof(location1ExitPrepared);
    const link = topo.leaf(ObjectTypes.S.link, topo.exitId(0, 3, 0));
    const linkPrepared = topo.prepareLeaf(link);
    const linkProof = tree.getProof(linkPrepared);

    const logit = (name: string, prepared: PreparedObject, proof: any) => {
      // remember, the inputs are indirect, so prepared != inputs

      console.log(`leafHash: ${MerkleCodec.leafHash(prepared)}`);
      console.log("proof", proof);
      console.log(`encoded:(${name})) ${MerkleCodec.leafEncoded(prepared)}`);
    };

    let egressChoices = [
      {
        typeId: location0Prepared[0],
        inputs: location0Prepared[1],
      },
    ];

    let egressProofs = [location0Proof];

    // const startArgs = [
    //   {
    //     rootLabel: this.gameInitArgs.rootLabels[0],
    //     choices: egressChoices,
    //     proofs: egressProofs,
    //     data: [msgpack.encode({ sides: [[], [], [], [0]] })],
    //   },
    // ];

    // the input is [[location], [side, exit], ... [side, exit]]
    let choice = egressChoices[0].inputs[(location0.leaf as LocationChoices).iChoices() + 0];

    // The guardian will know the current location id for all players. To
    // confirm a player exit choice the guardian must prove that the public
    // player choice selects an exit in the current location that is linked to
    // an exit in the next.

    // For maximum 'fog' the locations would be blinded uniquely for each
    // participant, and the relations would be duplicated in the trie for all
    // players.

    let leaves = [];
    let stack = [];

    const rootLabel = `onepage-dungeon:static`;

    // Let the player start location id be 0 (the first location added above)

    // Set STACK(0) to location0
    leaves.push({
      typeId: location0Prepared[0],
      inputs: location0Prepared[1],
    });
    stack.push({
      inputRefs: [],
      proofRefs: [],
      rootLabel,
      proof: location0Proof,
    });

    logit("location0", location0Prepared, stack[stack.length - 1]);

    // Set STACK(1) to EXIT proof
    // Obtain an exit proof linking the exit menu choice to a specific location exit
    // [EXIT, [[REF(#L, i)]]]
    // STACK(1) to the association of exit 0 with location 0 with exitMenu 0, choice 0.
    // note that the location proof is at STACK(0)
    leaves.push({
      typeId: location0ExitPrepared[0],
      inputs: MerkleCodec.conditionInputs([[0, 1]]),
    });
    stack.push({
      inputRefs: [0],
      proofRefs: [],
      rootLabel,
      proof: location0ExitProof,
    });

    logit("EXIT", location0ExitPrepared, location0ExitProof);

    // Set STACK(2) to location1
    leaves.push({
      typeId: location1Prepared[0],
      inputs: location1Prepared[1],
    });
    stack.push({
      inputRefs: [],
      proofRefs: [],
      rootLabel,
      proof: location1Proof,
    });

    logit("location1", location1Prepared, stack[stack.length - 1]);

    // Set STACK(3) to location 1 exit (ingress)
    leaves.push({
      typeId: location1ExitPrepared[0],
      inputs: MerkleCodec.conditionInputs([[2, 1]]),
    });
    stack.push({
      inputRefs: [0],
      proofRefs: [],
      rootLabel,
      proof: location1ExitProof,
    });

    // Set STACK(4) to link  exit (stack 1), exit (stack 3)
    leaves.push({
      typeId: linkPrepared[0],
      inputs: MerkleCodec.conditionInputs([
        [1], // STACK(1)
        [3], // STACK(3)
      ]),
    });
    stack.push({
      inputRefs: [],
      proofRefs: [0, 1],
      rootLabel,
      proof: linkProof,
    });
  });
});
