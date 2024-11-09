// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {LibTranscript, Transcript} from '../libtranscript.sol';

library LibTranscriptStorage {
    struct Layout {
        mapping(uint256 => Transcript) transcripts;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('LibTranscriptStorage.storage.src.chaintrap.polysensus');

    function layout() internal pure returns (Layout storage s) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
}
