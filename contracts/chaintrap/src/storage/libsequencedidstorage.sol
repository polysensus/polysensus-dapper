// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

error IDSequenceNotInitialised(uint256 which);

library LibSequencedIDStorage {
    struct Layout {
        // Sequence counters
        mapping(uint256 => uint256) sequenceLast;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('LibSequencedIDStorage.storage.src.chaintrap.polysensus');

    function layout() internal pure returns (Layout storage s) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }

    function _sequenceNext(
        LibSequencedIDStorage.Layout storage s,
        uint256 counter
    ) internal returns (uint256) {
        if (s.sequenceLast[counter] == 0)
            revert IDSequenceNotInitialised(counter);
        // The current value is always the *next* unused value
        uint256 id = s.sequenceLast[counter];
        s.sequenceLast[counter] += 1;
        return id;
    }

    /// @notice idempotent initialisation for the zero states.
    function _idempotentInit(uint256[] storage types) internal {
        LibSequencedIDStorage.Layout storage s = layout();
        for (uint i = 0; i < types.length; i++) {
            _initSeq(s, types[i]);
        }
    }

    function _initSeq(
        LibSequencedIDStorage.Layout storage s,
        uint256 counter
    ) internal {
        if (s.sequenceLast[counter] != 0) return;
        s.sequenceLast[counter] = 1;
    }
}
