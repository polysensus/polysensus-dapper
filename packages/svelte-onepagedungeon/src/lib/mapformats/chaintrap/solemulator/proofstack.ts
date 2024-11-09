import { ethers } from "ethers";

import { MerkleCodec } from "../merkle/etherscodec.js";

// This implementation aligns with the solidity smart contract implementation originaly created for
// the Chaintrap Optimism grant.
const codec = ethers.AbiCoder.defaultAbiCoder();

// Uint256 pads left for solidity abi encoding
export type uint256 = Uint8Array & { length: 32 };
// Bytes32 pads right for solidity abi encoding
export type bytes32 = Uint8Array & { length: 32 };

export type ProofLeaf = {
  typeId: uint256;

  /**  @dev for regular inputs, each item is a single element array.For
  /// choice menu inputs, each item is a *pair* [path, value]. Eg,
  ///
  ///     regular inputs: [[value], [value], [value], ...]
  ///     choice menu: [[path, value], [path, value], ...]
  ///
  /// For the choice menu, the path encodes the depth first linearisation of a
  /// choice menu structure. It is suggested applications partion the path
  /// value evenly according to an application defined max menu depth. Eg, for
  /// a menu depth of 2, path should be a pair of packed bytes128's.
  ///  In both cases the 'value' portion of the input can be direct or it can
  /// be a reference. See StackProof for the details. */
  inputs: bytes32[][];
}

export type JSONProofLeaf = {
  typeId: number;
  inputs: string[][];
}

/** A StackProof is a proof where the proven node may be constructed from
/// elements of earlier proofs in the same stack.*/
export type StackProof = {
  /// @dev inputRefs are used to construct proofs linking 'choice' inputs from
  /// earlier StackProofs to their pre-committed consequences.  Each index in
  /// the array identifies an earler StackProof's. The value in the associated
  /// proof entry input indexes into the inputs of the an earlier StackProof.
  inputRefs: uint256[];
  proofRefs: uint256[]; // the value is read indirectly from the proven result identified by the value
  rootLabel: bytes32; // label
  proof: bytes32[];
}

/** javascript native rendering of the StackProof, used in client code  */
export type JSONStackProof = {
  inputRefs: number[];
  proofRefs: number[];
  rootLabel: string;
  proof: string[];
}

export type ChoiceProof = {
  choiceSetType: uint256;
  transitionType: uint256;
  stack: StackProof[];
  leaves: ProofLeaf[];
}

export type JSONChoiceProof = {
  choiceSetType: number;
  transitionType: number;
  stack: JSONStackProof[];
  leaves: JSONProofLeaf[];
}

export type StackState = {
  // note: this type uses number directly, as its mutable state for checking proofs.
  position: number;
  proven: bytes32[];
  // @dev refFloor is lastChoiceSet
  lastChoiceSet: number;
  floorBreached: number;
}

function bytescmp(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

export namespace ProofStacks {

  export function encodeChoiceProof(proof: JSONChoiceProof): ChoiceProof {
    return {
      choiceSetType: MerkleCodec.num2uint256(proof.choiceSetType) as uint256,
      transitionType: MerkleCodec.num2uint256(proof.transitionType) as uint256,
      stack: proof.stack.map((x) => encodeProof(x)),
      leaves: proof.leaves.map((x) => encodeProofLeaf(x)),
    };
  }

  export function encodeProof(proof: JSONStackProof): StackProof {
    return {
      inputRefs: proof.inputRefs.map((x) => MerkleCodec.num2uint256(x) as uint256),
      proofRefs: proof.proofRefs.map((x) => MerkleCodec.num2uint256(x) as uint256),
      rootLabel: ethers.getBytes(ethers.encodeBytes32String(proof.rootLabel)) as bytes32,
      proof: proof.proof.map((x) => ethers.getBytes(x) as bytes32),
    };
  }

  export function encodeProofLeaf(leaf: JSONProofLeaf): ProofLeaf {
    return {
      typeId: MerkleCodec.num2uint256(leaf.typeId) as uint256,
      inputs: leaf.inputs.map((x) => x.map((y) => ethers.getBytes(y) as bytes32)),
    };
  }

  export function check(
    args: ChoiceProof,
    roots: Record<string, bytes32>
  ): { state: StackState, ok: boolean } {
    var state: StackState = { position: 0, proven: [], lastChoiceSet: 0, floorBreached: 0 };

    if (!bytescmp(args.leaves[0].typeId, args.choiceSetType))
      throw new Error(`ProofStack_MustStartWithChoiceSet`);
    if (!bytescmp(args.leaves[args.leaves.length - 1].typeId, args.transitionType))
      throw new Error(`ProofStack_MustConcludeWithTransition`);

    for (let i = 0; i < args.stack.length; i++) {
      state.position = i;
      if (1 > 0) {
        if (args.leaves[i].typeId != args.choiceSetType) {
          // require that it has a back ref to ensure all entries
          // derived from a choice set form a logical chain through
          // the merkle tree.
          if (
            args.stack[i].inputRefs.length == 0 &&
            args.stack[i].proofRefs.length == 0
          ) throw new Error(`ProofStack_MustBeDerivedFromChoiceSet`);

          // TODO: consider making the reverse returns and letting the caller revert or not.
          // state.position + error code is enough info

          // note we check that the references are for the most recent
          // choice set  when resolving the indirection
        } else {
          // Note: generalising this so we can have transitions
          // contingent on choice combinations (choice a AND choice b
          // THEN choice set c) is a possible future direction. For
          // now choice a -> choice set new is enought for the
          // roll-your-own-adventure model of page location chioces we
          // are supporting.
          if (state.lastChoiceSet != 0)
            throw new Error(`ProofStack_TooManyChoiceSets`);
          state.lastChoiceSet = i;
        }
      }

      let merkleLeaf = entryLeafNode(args, state, i);
      // console.log("merkleLeaf & proof[0]:");
      // console.logBytes32(merkleLeaf);
      // console.logBytes32(args.stack[i].proof[0]);

      const proven = MerkleCodec.proven(merkleLeaf, args.stack[i].proof);
      if (!bytescmp(roots[MerkleCodec.bytes32(args.stack[i].rootLabel)], proven))
        return { state, ok: false };

      // if we have more than one choice set, require that the proof for
      // the most recent refers to leaves associated with the earlier
      // choice set (below the floor). Note: this clause alows for > 2
      // choice sets for now.
      if (
        i == args.stack.length - 1 &&
        state.lastChoiceSet > 1 &&
        state.floorBreached != 1
      ) throw new Error(`ProofStack_MustDeriveFromBothChoiceSet`);

      // console.log("proven %d", i);

      state.proven[i] = merkleLeaf;
    }

    return { state, ok: false };
  }

  export function encodeLeaf(typeId: uint256, inputs: bytes32[][]): Uint8Array {
    return ethers.getBytes(codec.encode(MerkleCodec.LeafABI, [typeId, inputs]));
  }

  export function directPreimage(
    leaf: ProofLeaf
  ): Uint8Array {
    return encodeLeaf(leaf.typeId, leaf.inputs);
  }

  export function directMerkleLeaf(
    leaf: ProofLeaf
  ): bytes32 {
    const encoded = directPreimage(leaf);
    return MerkleCodec.keccak(MerkleCodec.keccak(encoded)) as bytes32;
  }

  export function entryLeafNode(
    args: ChoiceProof,
    state: StackState,
    i: number
  ): bytes32 {

    if (args.stack[i].inputRefs.length == 0 && args.stack[i].proofRefs.length == 0)
      return directMerkleLeaf(args.leaves[i]);
    else
      return entryIndirectLeafNode(args, state, i);
  }

  function entryIndirectLeafNode(
    args: ChoiceProof, state: StackState, i: number): bytes32 {

    let item = args.stack[i];
    let leaf = args.leaves[i];

    let nextProofRef = 0;
    let nextInputRef = 0;

    // Note: memory expansion and copying from calldata could probably be
    // avoided with clever encoding. But it shouldn't be that bad for now.
    // https://ethereum.stackexchange.com/questions/92546/what-is-expansion-cost

    const inputs: bytes32[][] = [];
    // bytes32[][] memory inputs = new bytes32[][](leaf.inputs.length);

    for (let j = 0; j < leaf.inputs.length; j++) {

      // let j = MerkleCodec.num2uint256(jj);

      // inputs[j] = new bytes32[](leaf.inputs[j].length);

      // The inputs are interpreted like this
      // imediate input is [value0, ..., valueN]
      // proofRef input is [elements, stack-position]
      // inputRef input is [elements, stack-position, input-index]

      // is the next reference the input currently being collected ?
      if (
        nextProofRef < item.proofRefs.length &&
        item.proofRefs[nextProofRef] == MerkleCodec.num2uint256(j)
      ) {
        // console.log("STACK(%d)[%d] PROOF REF ---", i, j);
        if (leaf.inputs[j].length != 1)
          throw new Error('ProofStack_ProoRefInvalid')

        let value = MerkleCodec.bytesvalue(leaf.inputs[j][leaf.inputs[j].length - 1]);

        if (value < state.lastChoiceSet)
          if (i != args.stack.length - 1 || state.floorBreached != 0)
            // The transition references must span the floor, two below the floor or two above are both invalid.
            throw new Error('ProofStack_ReferenceFloorBreach');
          else
            state.floorBreached++;

        // It is a back reference to a node proven by a lower stack item.

        inputs[j] = [state.proven[value]];
        //inputs[j][0] = state.proven[value];
        // console.log("proof value %s", inputs[j][0]);

        nextProofRef++;
      } else if (
        nextInputRef < item.inputRefs.length &&
        item.inputRefs[nextInputRef] == MerkleCodec.num2uint256(j)
      ) {
        console.log("STACK(%d)[%d] INPUT REF ---", i, j);
        // Note: the value refered to here cannot be a reference. (or if it is it is not resolved to the target value)

        // It is an input ref there must be *at least* two values, the stack position and the input index.

        if (leaf.inputs[j].length < 2)
          throw new Error(`ProofStack_InputRefToShort`);

        // index back from the end of the input so we can have other values *before* the stack position
        let stackPos = MerkleCodec.bytesvalue(leaf.inputs[j][leaf.inputs[j].length - 2]);
        if (stackPos < state.lastChoiceSet)
          if (i != args.stack.length - 1 || state.floorBreached != 0)
            // Each choice set establishes a 'floor'. Transition
            // references, which result in a new choice set, must
            // span the floor in order to demonstrate a connection between
            // the twho choice sets.
            throw new Error(`ProofStack_ReferenceFloorBreach`);
          else
            state.floorBreached++;

        // console.log("proof index %d", stackPos);

        // The input reference is the last input item, henge length - 1
        let referedInput = args.leaves[stackPos].inputs[
          MerkleCodec.bytesvalue(leaf.inputs[j][leaf.inputs[j].length - 1])
        ];

        // allocate space for target leaf hash + refered inputs
        // inputs[j] = new bytes32[](referedInput.length + 1);
        inputs[j] = [state.proven[stackPos]];

        for (let k = 0; k < referedInput.length; k++) {
          inputs[j].push(referedInput[k])
          // inputs[j][k + 1] = referedInput[k];
          console.log("iref: inputs %d", k + 1);
          console.log(
            "proof input: %d, %d",
            k + 1,
            MerkleCodec.bytesvalue(inputs[j][k + 1])
          );
          // console.logBytes32(referedInput[k]);
        }
        nextInputRef++;
      } else {
        console.log("STACK (%d)[%d] DIRECT PROOF ---", i, j);
        for (let k = 0; k < leaf.inputs[j].length; k++) {
          inputs[j] = []
          inputs[j].push(leaf.inputs[j][k]);
          console.log(
            "noref: inputs %d, %d",
            k,
            MerkleCodec.bytesvalue(inputs[j][k])
          );
        }
      }
      // else the value is not a reference and it needs no further
      // resolution.
    }

    // let encoded = encodeLeaf(leaf.typeId, inputs);
    // console.log("encoded");
    //console.logBytes(encoded);
    return MerkleCodec.keccak(
      MerkleCodec.keccak(encodeLeaf(leaf.typeId, inputs))
    ) as bytes32;
  }
}