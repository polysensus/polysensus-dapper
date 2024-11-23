// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test} from "forge-std-1.9.4/Test.sol";

import {ChaintrapArena} from "src/arena.sol";

contract Arena_init is Test {

   function test_newArena() public {
       ChaintrapArena a = new ChaintrapArena();
       a.idempotentInit();
   }
}