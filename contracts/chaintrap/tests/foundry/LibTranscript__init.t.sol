// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test} from "forge-std-1.9.4/Test.sol";
import {Vm} from "forge-std-1.9.4/Vm.sol";
import {stdError} from "forge-std-1.9.4/StdError.sol";

import {Transcript2KnowProofUtils } from "tests/TranscriptUtils.sol";
import {TestLibTranscript_Facade } from "tests/LibTranscript_Facade.sol";
import {minimalyValidInitArgs} from "tests/TranscriptUtils.sol";

import {LibSequencedIDStorage} from "src/storage/libsequencedidstorage.sol";
import {LibTranscriptStorage} from "src/storage/libtranscriptstorage.sol";

import {Transcript_IsInitialised, Transcript_VerifyFailed} from "src/libtranscript.sol";
import {LibTranscript, Transcript, TranscriptInitArgs, TranscriptMerkleRootSet} from "src/libtranscript.sol";
import {TrialistInitArgs} from "src/libtrialiststate.sol";

contract LibGame__init is Test {
    using LibTranscript  for Transcript;
    using LibSequencedIDStorage for LibSequencedIDStorage.Layout;

    function test__init_RevertInitialiseTwice() public {

        TestLibTranscript_Facade t = new TestLibTranscript_Facade();
        uint256 gid = t.newId();
        t._init(gid, address(1), minimalyValidInitArgs());

        vm.expectRevert(Transcript_IsInitialised.selector);
        t._init(gid, address(1), minimalyValidInitArgs());
    }
    function test__init_RevertMoreRootsThanLabels() public {

        TestLibTranscript_Facade t = new TestLibTranscript_Facade();
        uint256 gid = t.newId();

        vm.expectRevert(stdError.indexOOBError); // array out of bounds
        t._init(gid, address(1), TranscriptInitArgs({
            tokenURI: "tokenURI",
            registrationLimit: 2,
            trialistArgs: TrialistInitArgs({flags: 0, lives: 1}),
            rootLabels:new bytes32[](1),
            roots:new bytes32[](2),
            choiceInputTypes: new uint256[](1),
            transitionTypes: new uint256[](2),
            victoryTransitionTypes: new uint256[](2),
            haltParticipantTransitionTypes: new uint256[](1),
            livesIncrement: new uint256[](1),
            livesDecrement: new uint256[](1)
            }
            ));
    }

    function test__init_NoRevertFewerRootsThanLabels() public {

        TestLibTranscript_Facade t = new TestLibTranscript_Facade();
        uint256 gid = t.newId();

        t._init(gid, address(1), TranscriptInitArgs({
            tokenURI: "tokenURI",
            registrationLimit: 1,
            trialistArgs: TrialistInitArgs({flags: 0, lives: 1}),
            rootLabels:new bytes32[](2),
            roots:new bytes32[](1),
            choiceInputTypes: new uint256[](1),
            transitionTypes: new uint256[](2),
            victoryTransitionTypes: new uint256[](2),
            haltParticipantTransitionTypes: new uint256[](1),
            livesIncrement: new uint256[](1),
            livesDecrement: new uint256[](1)
            }
            ));
    }

    function test__init_EmitSetMerkleRoot() public {
        TestLibTranscript_Facade t = new TestLibTranscript_Facade();
        uint256 gid = t.newId();

        vm.expectEmit(true, true, true, true);

        // Should get one emit for each root
        emit TranscriptMerkleRootSet(1, "", "");
        emit TranscriptMerkleRootSet(1, "", "");

        t._init(gid, address(1), TranscriptInitArgs({
            tokenURI: "tokenURI",
            registrationLimit: 2,
            trialistArgs: TrialistInitArgs({flags: 0, lives: 1}),
            rootLabels:new bytes32[](2),
            roots:new bytes32[](2),
            choiceInputTypes: new uint256[](1),
            transitionTypes: new uint256[](2),
            victoryTransitionTypes: new uint256[](2),
            haltParticipantTransitionTypes: new uint256[](1),
            livesIncrement: new uint256[](1),
            livesDecrement: new uint256[](1)
            }
            ));
    }
}
