// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test} from "forge-std-1.9.4/Test.sol";

import {ChaintrapArena} from "src/arena.sol";
import {TrialistInitArgs} from "src/libtrialiststate.sol";
import {TranscriptInitArgs} from "src/libtranscriptstructs.sol";

import {TranscriptInitUtils} from "tests/TranscriptUtils.sol";

contract Arena_init is
    TranscriptInitUtils,
    Test {


   function test_createGame() public {
       ChaintrapArena a = new ChaintrapArena();
       a.idempotentInit();

       TranscriptInitArgs memory args = initArgsWith1Root(hex"aaaa", hex"141d529a677497c1e718dcaea00c5ee952720942c8a43e9fda2c38ab24cfb562");
       uint256 gid = a.createGame(args);
       assertEq(gid, 1);
   }
}