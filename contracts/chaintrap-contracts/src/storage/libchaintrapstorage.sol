// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {LibSequencedIDStorage} from './libsequencedidstorage.sol';
import {TokenAuth} from '../libtokenauth.sol';

library LibChaintrapStorage {
    using LibSequencedIDStorage for LibSequencedIDStorage.Layout;

    struct Layout {
        uint initialised;
        // Sequences, separate for each type
        mapping(uint256 => TokenAuth) tokenAuth;
        uint256[] tokenTypes;
        string[] tokenTypeNames;
        mapping(uint256 => string) tokenNames;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('LibChaintrapStorage.storage.src.chaintrap.polysensus');

    function layout() internal pure returns (Layout storage s) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }

    function _init(
        LibChaintrapStorage.Layout storage s,
        uint256[] memory tokenTypes,
        string[] memory tokenTypeNames
    ) internal {
        if (tokenTypeNames.length != tokenTypes.length)
            revert('LibChaintrapStorage: length mismatch');

        if (s.initialised > 0) return;

        LibSequencedIDStorage.Layout storage seq = LibSequencedIDStorage
            .layout();
        // reserve 0
        s.tokenTypes.push(0);
        s.tokenTypeNames.push('RESERVED');
        // s.tokenNames[0] = LEAVE EMPTY

        for (uint256 i = 0; i < tokenTypes.length; i++) {
            s.tokenTypes.push(tokenTypes[i]);
            s.tokenTypeNames.push(tokenTypeNames[i]);
            s.tokenNames[tokenTypes[i]] = tokenTypeNames[i];
            seq._initSeq(tokenTypes[i]);
        }
        s.initialised = 1;
    }
}
