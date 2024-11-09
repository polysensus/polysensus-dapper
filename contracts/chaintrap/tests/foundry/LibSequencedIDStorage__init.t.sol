// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {Test} from "forge-std-1.9.4/Test.sol";
import {LibSequencedIDStorage} from "src/storage/libsequencedidstorage.sol";
// import "forge-std/console2.sol";

uint256 constant TOKEN_TYPE0 = 0;
uint256 constant TOKEN_TYPE1 = 0;


contract LibSequencedIDStorage_init is Test {
    using LibSequencedIDStorage for LibSequencedIDStorage.Layout;

    uint256 []tokenTypes = [TOKEN_TYPE0, TOKEN_TYPE1];

    function test_initSeqLastFirstTime() public {
        LibSequencedIDStorage.Layout storage s = LibSequencedIDStorage.layout();
        // Note: there is no opinion asserted at the storage layout level
        // regarding valid 'types'
        s._initSeq(123);
        assertEq(s.sequenceLast[123], 1);
    }

    function test_initSeqIdempotent() public {
        LibSequencedIDStorage.Layout storage s = LibSequencedIDStorage.layout();
        s.sequenceLast[123] = 2;
        s._initSeq(123);
        assertEq(s.sequenceLast[123], 2);
    }

    function test_idempotentInitFirstTime() public {
        LibSequencedIDStorage.Layout storage s = LibSequencedIDStorage.layout();

        LibSequencedIDStorage._idempotentInit(tokenTypes);
        assertEq(s.sequenceLast[TOKEN_TYPE0], 1);
        assertEq(s.sequenceLast[TOKEN_TYPE1], 1);
    }
}
