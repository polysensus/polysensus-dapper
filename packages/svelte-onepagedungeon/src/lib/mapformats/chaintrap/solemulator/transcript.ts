// This implementation aligns with the solidity smart contract implementation originaly created for
// the Chaintrap Optimism grant.

import type { uint256 } from "./proofstack.js";

export type address = Uint8Array & { length: 20 };

export type Transcript = {};
export type TranscriptInitArgs = {};

export namespace Transcripts {

  export function create(id: uint256, creator: address, args: TranscriptInitArgs): void {
  }
}