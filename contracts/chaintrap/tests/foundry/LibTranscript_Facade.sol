// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {LibSequencedIDStorage} from "src/storage/libsequencedidstorage.sol";
import {LibTranscriptStorage} from "src/storage/libtranscriptstorage.sol";

import {TranscriptInitArgs} from "src/libtranscript.sol";
import {LibTranscript, Transcript, TranscriptStartArgs, TranscriptOutcome} from "src/libtranscript.sol";

import {TRANSCRIPT_TOKEN_TYPE} from "src/libchaintrap.sol";

// TestLibTrascript exists to enable LibTranscript test coverage for functions
// that accept calldata or are internal.
contract TestLibTranscript_Facade {
    using LibTranscript  for Transcript;
    using LibSequencedIDStorage for LibSequencedIDStorage.Layout;

    uint256[] types = [TRANSCRIPT_TOKEN_TYPE];

    constructor() {
        return LibSequencedIDStorage._idempotentInit(types);
    }

    function newId() public returns (uint256) {
        return LibSequencedIDStorage.layout()._sequenceNext(TRANSCRIPT_TOKEN_TYPE);
   }
    function transcript(uint256 gid) internal view returns (Transcript storage) {
        return LibTranscriptStorage.layout().transcripts[gid];
    }
    function _init(uint256 gid, address creator, TranscriptInitArgs calldata args) public {
        Transcript storage s = transcript(gid);
        s._init(gid, creator, args);
    }

    function checkRoot(uint256 gid, bytes32[] calldata proof, bytes32 label, bytes32 node) public view returns (bool) {
        Transcript storage s = transcript(gid);
        return s.checkRoot(proof, label, node);
    }

    function verifyRoot(uint256 gid, bytes32[] calldata proof, bytes32 label, bytes32 node) public view {
        Transcript storage s = transcript(gid);
        return s.verifyRoot(proof, label, node);
    }
}