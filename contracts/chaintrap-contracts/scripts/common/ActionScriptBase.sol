// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;
import {Test} from "forge-std-1.9.4/Test.sol";
import {Script} from "forge-std-1.9.4/Script.sol";

contract ActionScriptBase is Script {

  string RPC;
  uint256 fork;

  function createFork(uint256 forkBlock) internal {
    RPC = vm.rpcUrl("rpc");
    fork = vm.createFork(RPC, forkBlock);
    vm.selectFork(fork);
  }

  function startBroadcast(string memory keyName) internal {
    // If keyName is not set, the script is assumed to be run with --ledger
    uint256 key = 0;
    if (bytes(keyName).length != 0)
      key = vm.envOr(keyName, uint256(0));
    if (key != 0) {
      vm.startBroadcast(key);
      return;
    }
    vm.startBroadcast();
  }
}
