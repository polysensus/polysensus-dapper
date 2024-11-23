// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {LibTranscriptStorage} from './storage/libtranscriptstorage.sol';
import {LibChaintrapStorage} from './storage/libchaintrapstorage.sol';
import {LibSequencedIDStorage} from './storage/libsequencedidstorage.sol';

import {LibTranscript, Transcript} from './libtranscript.sol';
import {TRANSCRIPT_CURSOR_HALTED} from './libtranscript.sol';
import {TranscriptInitArgs, TranscriptStartArgs} from './libtranscript.sol';
import {TranscriptCommitment, TranscriptOutcome} from './libtranscript.sol';

error InsufficientBalance(address addr, uint256 id, uint256 balance);
error ArenaError(uint);

uint256 constant HOLDER_TOKEN_TYPE = 1;
string constant HOLDER_TOKEN_NAME = 'CHAINTRAP_HOLDER';
uint256 constant TRANSCRIPT_TOKEN_TYPE = 2;
string constant TRANSCRIPT_TOKEN_NAME = 'CHAINTRAP_TRANSCRIPT';

struct AvatarInitArgs {
    bytes profile;
}

library LibChaintrap {
    using LibChaintrapStorage for LibChaintrapStorage.Layout;
    using LibSequencedIDStorage for LibSequencedIDStorage.Layout;
    using LibTranscript for Transcript;

    function _msgSender() internal view returns (address sender) {
        return msg.sender;
    }

    function idempotentInit() internal {
        uint256[] memory tokenTypes = new uint256[](2);
        string[] memory tokenTypeNames = new string[](2);
        tokenTypes[0] = HOLDER_TOKEN_TYPE;
        tokenTypeNames[0] = HOLDER_TOKEN_NAME;
        tokenTypes[1] = TRANSCRIPT_TOKEN_TYPE;
        tokenTypeNames[1] = TRANSCRIPT_TOKEN_NAME;
        LibChaintrapStorage.layout()._init(tokenTypes, tokenTypeNames);
    }

    /// ---------------------------------------------------
    /// @dev Transcript# game setup creation & player signup
    /// ---------------------------------------------------
    function createAvatar(
        AvatarInitArgs calldata /*args*/
    ) internal returns (uint256) {
        // TODO: assign a token to the caller
        uint id = LibSequencedIDStorage.layout()._sequenceNext(
            HOLDER_TOKEN_TYPE
        );
        return id;
    }

    /// @notice mint a new game
    function createGame(
        TranscriptInitArgs calldata initArgs
    ) internal returns (uint256) {
        // TODO: record caller as creator/owner
        uint256 gid = LibSequencedIDStorage.layout()._sequenceNext(
            TRANSCRIPT_TOKEN_TYPE
        );
        LibTranscriptStorage.layout().transcripts[gid]._init(
            gid,
            _msgSender(),
            initArgs
        );
        return gid;
    }

    /// @notice register a participant (transcript2)
    /// @param profile profile information, not stored on chain but emmited in log of registration
    function registerTrialist(uint256 gid, bytes calldata profile) internal {
        LibTranscriptStorage.Layout storage s = LibTranscriptStorage.layout();
        s.transcripts[gid].register(_msgSender(), profile);
    }

    function startTranscript(
        uint256 gid,
        TranscriptStartArgs calldata args
    ) internal {
        LibTranscriptStorage.Layout storage s = LibTranscriptStorage.layout();
        s.transcripts[gid].start(args);
    }

    function transcriptEntryCommit(
        uint256 gid,
        TranscriptCommitment calldata commitment
    ) internal returns (uint256) {
        LibTranscriptStorage.Layout storage s = LibTranscriptStorage.layout();
        return s.transcripts[gid].entryCommit(_msgSender(), commitment);
    }

    function transcriptEntryResolve(
        uint256 gid,
        TranscriptOutcome calldata argument
    ) internal {
        LibTranscriptStorage.Layout storage s = LibTranscriptStorage.layout();

        Transcript storage t = s.transcripts[gid];
        t.entryReveal(_msgSender(), argument);

        // if there was any issue with the proof, entryReveal reverts

        if (
            LibTranscript.arrayContains(
                t._transitionTypes().victoryTransitions,
                argument.proof.transitionType
            )
        ) {
            // 1. if the choice type was declared as a victory condition,
            // complete the game and transfer ownership to the participant.

            // All other participants are trapped in the dungeon.
            t.haltAllExcept(argument.participant);

            // complete is an irreversible state, no code exists to
            // 'un-complete'. this method can only be called by the current
            // holder of the game transcript token
            t.complete();

            // ownership transfer *from* the current holder (the guardian)
            // TODO: remember to disperse and release bound tokens appropriately when we do treats
            // see _beforeTokenTransfer in the ERC1155ArenaFacet

            revert('ArenaError: Victory action not implemented');
            /*
            address from = _msgSender();
            _safeTransfer(
                from,
                from,
                argument.participant,
                gid,
                1,
                argument.data
            );*/
        } else if (
            LibTranscript.arrayContains(
                t._transitionTypes().livesIncrement,
                argument.proof.transitionType
            )
        ) {
            // 3. Add a single life.
            t.trialistAddLives(argument, 1);
        } else if (
            // 4. remove a single life, and halt if the participant lives are exhausted.
            LibTranscript.arrayContains(
                t._transitionTypes().livesDecrement,
                argument.proof.transitionType
            )
        ) {
            // 3. Remove a single life or consume a free life bonus.
            if (!t.trialistApplyFatality(argument)) {
                return; // not fatal
            }
            // then the player ran out of lives
            t.haltParticipant(argument);

            // If all participants are now halted the narrator is victorious
            if (t.countHalted() == t.registered.length) t.complete();
        } else if (
            LibTranscript.arrayContains(
                t._transitionTypes().haltParticipantTransitions,
                argument.proof.transitionType
            )
        ) {
            // 2. if the choice type was declared as a participant halt condition,
            // halt the participant. Note that this by passes lives

            t.haltParticipant(argument);
            // If all participants are now halted the narrator is victorious
            if (t.countHalted() == t.registered.length) t.complete();
        } else {
            // "reveal" the choices. we say reveal, but he act of including them
            // in the call data has already done that. this just emits the logs
            // signaling proof completion.
            t.revealChoices(argument);
        }
    }
}
