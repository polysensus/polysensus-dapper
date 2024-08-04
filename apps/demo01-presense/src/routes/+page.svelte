<script>
  import * as env from '$env/static/public';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import {
    createKernelAccount,
    // createZeroDevPaymasterClient,
    // createKernelAccountClient,
    addressToEmptyAccount,
  } from "@zerodev/sdk";
  import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
  import {
    signerToEcdsaValidator,

    } from "@zerodev/ecdsa-validator"
  import { toAccount } from "viem/accounts"
  import { getChainId } from "viem/actions"
  import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
  import {
    http,
    createPublicClient,
  } from "viem"

  import { toECDSASigner } from "@zerodev/permissions/signers"
  import { toSudoPolicy } from "@zerodev/permissions/policies"
  import {
    deserializePermissionAccount,
    serializePermissionAccount,
    toPermissionValidator,
  } from "@zerodev/permissions"

  import { storedPresence } from '$lib/stores/presence.js';


  // framework imports
  import { setContext, getContext } from 'svelte';

  // framework components

  // application components

  // application imports

  // -- dungeon creation local state stores

  // --- constants
  const entryPoint = ENTRYPOINT_ADDRESS_V07; 
  // contexts
  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  let arena = getContext('arena');
  let chain;
  let publicClient;

  let isGameRunning=undefined;
  let currentRopePosition=0;
  let joinedSide=undefined;

  async function getApproval(sessionKeyAddress, signer) {

    // sessionKeyAddress = sessionKeyAddress.toLowerCase();
    // signer.account.address = signer.account.address.toLowerCase();
    console.log(`Getting approval for ${sessionKeyAddress} ${JSON.stringify(signer)} ${entryPoint}`);

    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      entryPoint: entryPoint,
      signer: signer.account,
    });

    sessionKeyAddress = sessionKeyAddress.toLowerCase();

    // Create an "empty account" as the signer -- you only need the public
    // key (address) to do this.
    const emptyAccount = addressToEmptyAccount(sessionKeyAddress)
    const emptySessionKeySigner = await toECDSASigner({ signer: emptyAccount })

    const permissionPlugin = await toPermissionValidator(publicClient, {
      entryPoint: entryPoint,
      signer: emptySessionKeySigner,
      policies: [
        // In this example, we are just using a sudo policy to allow everything.
        // In practice, you would want to set more restrictive policies.
        toSudoPolicy({}),
      ],
    })

    const sessionKeyAccount = await createKernelAccount(publicClient, {
      entryPoint: entryPoint,
      plugins: {
        sudo: ecdsaValidator,
        regular: permissionPlugin,
      },
    })

    return await serializePermissionAccount(sessionKeyAccount)
  }

  async function update() {
    currentRopePosition = await $arena.getCurrentRopePosition();
    isGameRunning = await $arena.isGameRunning();
  }

  async function tugowarPull() {
    if (!joinedSide)
      throw new Error(`side not chosen`);

    const presence = get(storedPresence);
    const resp = await fetch(`/api/tugowar/pull?chain=op-sepolia&side=${joinedSide}&session=${presence.sessionKeyAddress}&aproval=${presence.approval}`);
    const data = await resp.json();
    return data?.position;
  }

  async function tugowarJoin(side) {

    const presence = get(storedPresence);
    const resp = await fetch(`/api/tugowar/join?chain=op-sepolia&side=${side}&session=${presence.sessionKeyAddress}&aproval=${presence.approval}`);
    if (!resp.ok)
      throw new Error(`failed to join ${side}: ${resp}`);

    joinedSide = side;
    return joinedSide;
  }

  async function createSession() {

    const resp = await fetch(`/api/tugowar/create-session?chain=op-sepolia`);
    const data = await resp.json();
    const sessionKeyAddress = data?.sessionKeyAddress;
    const remoteSignerAddress = data?.remoteSignerAddress;

    let burnerKey;
    storedPresence.update((prev) => {
      // burner
      burnerKey = prev.burnerKey;
      if (!burnerKey)
        burnerKey = generatePrivateKey();
        
      return {...prev, sessionKeyAddress, remoteSignerAddress, burnerKey}
    });

    if (!burnerKey)
      throw new Error('burner key not set');

    // anvil well known key
    // burnerKey = "0xc23d69dca6cf8207c53e350cf1ce19807c0a4aee4bee0417fdae8bb0341f482e";

    const signerAccount = privateKeyToAccount(burnerKey);
    console.log("burner:", JSON.stringify(signerAccount));
    const signer = toECDSASigner({
      signer: signerAccount,
    });

    const approval = await getApproval(sessionKeyAddress, signer);
    console.log(`APPROVAL: ${approval}`);

    storedPresence.update((prev) => {
      return {...prev, approval}
    });
  }

  async function getChainConfig() {
    const resp = await fetch(`/api/chains/op-sepolia`);
    chain = await resp.json();
    return chain;
  }

  onMount(async () => {
    const chain = await getChainConfig();
    console.log(JSON.stringify(chain));
    publicClient = createPublicClient({
      transport: http(chain.bundlerUrl)
    });
  })

</script>
  <div class="h-56 grid content-center">
  <h2 class="h2 flex justify-center">Tug of War: AW '24 Hack</h2>
  <div class="flex justify-center gap-4">
    <button type="button" class="btn btn-sm preset-filled" on:click={async () => await createSession()}>Create Session</button>
    <button type="button" class="btn btn-sm preset-filled">Large</button>
  </div>
  <div class="flex justify-center">
  <button class="btn btn-sm preset-filled" on:click={async () => await update()}>Update</button>
  </div>
  <div class="flex justify-center">
  <ul class="list">
    <li>
      <span class="flex-auto">Contract</span>
      <span class="badge variant-filled">{$arena?.address}</span>
    </li>
    <li>
      <span class="flex-auto">Game in progress</span>
      <span class="badge variant-filled">{isGameRunning ? "no" : "yes"}</span>
    </li>
    <li>
      <span class="flex-auto">Rope Position</span>
      <span class="badge variant-filled">{currentRopePosition}</span>
    </li>
    {#if $storedPresence?.sessionKeyAddress}
    <li>
      <span class="flex-auto">Session</span>
      <span class="badge variant-filled">{$storedPresence.sessionKeyAddress}</span>
    </li>
    <li>
      <span class="flex-auto">approval</span>
      <span class="badge variant-filled">{$storedPresence.approval.slice(0, 16)}</span>
    </li>
    {/if}
    <!-- ... -->
  </ul>
  </div>

  </div>
  <!--
  <a href="/trial/create" class="btn variant-ringed-surface">Narrate</a>
  <a href="/trial/lobby" class="btn variant-ringed-surface">Raid</a>
  -->
<style>
  /* You can still add styles here using element selectors */
  body, html {
    height: 100%;
    margin: 0;
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full height of the viewport */
  }
</style>
