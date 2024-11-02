// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {LibTranscript, Transcript} from "../libtranscript.sol";
import {TokenAuth} from "../libtokenauth.sol";

error IDSequenceNotInitialised(uint256 which);

library LibTranscriptStorage {
    struct Layout {
        // Sequences, separate for each type
        mapping(uint256 => uint256) sequenceLast;
        mapping(uint256 => TokenAuth) tokenAuth;
        // note: prefer maps, for upgrades, arrays are sensitive to changes in struct layout.
        // Sequenced id to Transcript's
        mapping(uint256 => Transcript) transcripts;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256("LibTranscriptStorage.storage.src.chaintrap.polysensus");

    function layout() internal pure returns (Layout storage s) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }

    function _sequenceNext(
        LibTranscriptStorage.Layout storage s,
        uint256 ty
    ) internal returns (uint256) {
        if (s.sequenceLast[ty] == 0) revert IDSequenceNotInitialised(ty);
        // The current value is always the *next* unused value
        uint256 id = s.sequenceLast[ty];
        s.sequenceLast[ty] += 1;
        return id;
    }

    /// @notice idempotent initialisation for the zero states.
    function _idempotentInit(uint256[] memory types) internal {
        LibTranscriptStorage.Layout storage s = layout();
        for (uint i=0; i< types.length; i++) {
            _initSeq(s, types[i]);
        }
    }

    function _initSeq(LibTranscriptStorage.Layout storage s, uint256 ty) internal {
        if (s.sequenceLast[ty] != 0) return;
        s.sequenceLast[ty] = 1;
    }
}
