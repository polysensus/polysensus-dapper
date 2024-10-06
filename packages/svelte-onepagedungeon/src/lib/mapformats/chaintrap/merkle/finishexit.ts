import { ObjectTypes } from "../objecttypes.js";
import { LocationExit } from "./locationexit.js";
import type { RefResolverOptions } from "./logicalref.js";
import type { PreparedObject } from "./etherscodec.js";

/**
 * [FINISH, [[REF(#L, i)]]]
 */
export class FinishExit extends LocationExit {
  static ObjectType = ObjectTypes.index("finish");

  prepare(options: RefResolverOptions): PreparedObject {
    return [FinishExit.ObjectType, this.encoded(options)];
  }
}
