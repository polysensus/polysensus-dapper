import { error } from '@sveltejs/kit';

import { ENTRYPOINT_ADDRESS_V07 as entryPoint } from "permissionless"
import {
  http,
  createPublicClient,
} from "viem"
import {
  optimismSepolia
} from "viem/chains";

import { KernelEIP1193Provider } from '@zerodev/sdk/providers';
import { ethers } from 'ethers';

import { toRemoteSigner, RemoteSignerMode } from "@zerodev/remote-signer"


import {toUpperCaseWords} from '$lib/idioms.js';

import { json, requireEnv, requireParam, requireChainEnv } from '$lib/server/request.js';
import {requireZeroDevApiKey} from '$lib/server/zerodev.js';

import tugawarSol from "$lib/abi/TugAWar.json";
const abi = new ethers.utils.Interface(tugawarSol.abi);


/** @type {import('./arena/$types').RequestHandler} */
export async function GET({fetch, request}) {

  console.log('BEGIN: join');
  console.log(request.url);

  const url = new URL(request.url);
  const cfg = await fetchChainConfigUrl(url, {fetch});
  console.log(`project id ${cfg.zeroDevProjectId}`);
  const apiKey = requireZeroDevApiKey(cfg);

  const approval = requireParam(url, "approval");
  const signerAddress = requireParam(url, "signer");
  const remoteSigner = await toRemoteSigner({
    apiKey,
    keyAddress: signerAddress,
    mode: RemoteSignerMode.Get
  });
   
  const sessionKeySigner = toECDSASigner({
    signer: remoteSigner,
  });

  const publicClient = createPublicClient({
    transport: http(cfg.bundlerUrl)
  });

  const sessionKeyAccount = await deserializePermissionAccount(
    publicClient,
    entryPoint,
    approval,
    sessionKeySigner
  );

  const kernelClient = createKernelAccountClient({
    account: sessionKeyAccount,
    entryPoint,
   
    // Replace with your chain
    chain: optimismSepolia,
   
    // Replace with your bundler RPC.
    // For ZeroDev, you can find the RPC on your dashboard.
    bundlerTransport: http(cfg.bundlerUrl),
   
    // Optional -- only if you want to use a paymaster
    // middleware: {
    //   sponsorUserOperation,  
    // },
  });

  const kernelProvider = new KernelEIP1193Provider(kernelClient);
 
  // Use the KernelProvider with ethers
  // const ethersProvider = new ethers.BrowserProvider(kernelProvider);
  // const signer = await ethersProvider.getSigner();
  const signer = await kernelProvider.getSigner();
  // excep all of this needs to be a UserOp

  const tugawar = new new ethers.Contract(address, tugawarSol.abi);
  const res = await tugawar.joinTheLight();

  return json({});
}
