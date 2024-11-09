// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {AvatarInitArgs, LibChaintrap} from './libchaintrap.sol';
import {TranscriptInitArgs, TranscriptStartArgs} from './libtranscript.sol';
import {TranscriptCommitment, TranscriptOutcome} from './libtranscript.sol';

contract ChaintrapArena {
    constructor() {}

    function idempotentInit() public /* onlyOwner */ {
        LibChaintrap.idempotentInit();
    }
    /// ---------------------------------------------------
    /// @dev Transcript# game setup creation & player signup
    /// ---------------------------------------------------
    function createAvatar(
        AvatarInitArgs calldata args /*whenNotPaused*/
    ) external returns (uint256) {
        return LibChaintrap.createAvatar(args);
    }
    function createGame(
        TranscriptInitArgs calldata initArgs /*whenNotPaused*/
    ) external returns (uint256) {
        return LibChaintrap.createGame(initArgs);
    }
    /// @notice register a participant (transcript2)
    /// @param profile profile information, not stored on chain but emmited in log of registration
    function registerTrialist(
        uint256 gid,
        bytes calldata profile
    ) public /*whenNotPaused*/ {
        return LibChaintrap.registerTrialist(gid, profile);
    }
    function startTranscript(
        uint256 gid,
        TranscriptStartArgs calldata args
    ) public /*whenNotPaused holdsToken(_msgSender(), gid)*/ {
        return LibChaintrap.startTranscript(gid, args);
    }

    function transcriptEntryCommit(
        uint256 gid,
        TranscriptCommitment calldata commitment /*whenNotPaused*/
    ) public returns (uint256) {
        return LibChaintrap.transcriptEntryCommit(gid, commitment);
    }
    function transcriptEntryResolve(
        uint256 gid,
        TranscriptOutcome calldata argument
    ) public /*whenNotPaused holdsToken(_msgSender(), gid)*/ {
        return LibChaintrap.transcriptEntryResolve(gid, argument);
    }
}
