// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {console2 as console} from "forge-std-1.9.4/Script.sol";
import {DeployScriptBase} from "./common/DeployScriptBase.sol";

import {ChaintrapArena} from "src/arena.sol";

import "./constants.sol";

contract DeployChaintrapArenaScript is DeployScriptBase {

    ChaintrapArena arena; // saved by _run() for the benefit of test() methods

    function help() public pure {
      console.log("-s run() -s test() | -s env() | -s testenv()");
    }

  function run() public {
    startBroadcast();
    _env(false);
    _run();
    vm.stopBroadcast();
  }

  function runf() public {
    startFork();
    _env(false);
    _run();
    vm.stopPrank();
  }

  function _run() public {

    arena = new ChaintrapArena();
    arena.idempotentInit();
    console.log("%x", address(arena));
  }

  function test() public {
    runf();
  }

  // --- environments

  function env() public view {_env(true);}

  function _env(bool show) public view {
      // !NOTE: That env file parsing in foundry is super senstive to syntax errors
      // - miss a 0x prefix and the key wont be available to envUint
      // - make a // comment instead of a # bash style and the whole env will
      //   be missing

      // run env

      // test env
      // holderPub = vm.envOr("HOLDER_PUB", vm.envOr("POLYZONE_PUB", address(0)));
      // account deployment env
    
      if (!show)
        return;

      console.log("--- chain:");
      console.log("FORK_BLOCK: %d", FORK_BLOCK);
      console.log("RPC", vm.rpcUrl("rpc"));

      console.log("--- game:");
      console.log("CHAINTRAP_ADDR: %x", address(arena));
    }
}

