import { MerkleCodec } from "./etherscodec.js";
import type { PreparedObject } from "./etherscodec.js";
import { ObjectTypes } from "../objecttypes.js";
import type { LocationChoices } from "./locationchoices.js";
import type { FinishExit } from "./finishexit.js";
import type { LocationExit } from "./locationexit.js";
import type { LocationFurnishing } from "./locationfurnishing.js";
import type { LocationLink } from "./locationlink.js";
import type { RefResolverOptions } from "./logicalref.js";

type AccessLike = { location: number, side: number, exit: number };
type LinkLike = { a: AccessLike, b: AccessLike };

export class LeafObject {

  type: number;
  leaf: LocationChoices | LocationExit | FinishExit | LocationFurnishing | LocationLink;

  get ABI() {
    return MerkleCodec.LeafABI;
  }

  constructor(o) {
    this.type = o.type;
    this.leaf = o.leaf;
  }

  /**
   * Prepare the leaf object for encoding as a trie node
   * @returns {[number, ethers.utils.BytesLike]}
   */
  prepare(options: RefResolverOptions): PreparedObject {
    const [typeId, inputs] = this.leaf.prepare(options);

    return [typeId, inputs];
  }

  /**
   * @template {{location: number, side: number, exit: number}} AccessLike
   * @template {{a:AccessLike, b:AccessLike}} LinkLike
   * @param {LinkLike} link
   */
  static linkLeaf(link: LinkLike): LeafObject {
    return new LeafObject({ type: ObjectTypes.index("link"), leaf: link });
  }


}