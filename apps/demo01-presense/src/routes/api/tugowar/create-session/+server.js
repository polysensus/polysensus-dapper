import { json } from '$lib/server/request.js';

import {fetchChainConfigUrl} from '$lib/server/chainconfig.js';
import {requireZeroDevApiKey} from '$lib/server/zerodev.js';
import { toRemoteSigner, RemoteSignerMode } from "@zerodev/remote-signer"
import { toECDSASigner } from "@zerodev/permissions/signers"

/** @type {import('./arena/$types').RequestHandler} */
export async function GET({fetch, request}) {

  console.log('BEGIN: create-session')
  console.log(request.url)
  const url = new URL(request.url);
  /** @type {{url:string,arenaProxy:string}} */
  const cfg = await fetchChainConfigUrl(url, {fetch});
  console.log(`got chain: ${Object.keys(cfg)}`);
  const apiKey = requireZeroDevApiKey(cfg);

  // We use the remote signer here so that we can have a stateless backend.
  // The key we generate here lives only for the session. But still, in a
  // serverless environment, there isn't a great place to put that unless we
  // put it in a db. We *can* do that, but zerodev offers a remote signer for
  // the session.
  //
  // The approver, back on the client side, can be any signer it wants.
  // Anything from a similarly ephemeral burner key to a metamaske or
  // web3auth signer
  //
  // The remote private key we establish here is only used for the *session*

  // https://docs.zerodev.app/sdk/permissions/transaction-automation
  const remoteSigner = await toRemoteSigner({
    apiKey,
    mode: RemoteSignerMode.Create
  })
   
  const sessionKeySigner = toECDSASigner({
    signer: remoteSigner,
  });
  const sessionKeyAddress = sessionKeySigner.account.address;
  // sessionKeyAddress === remoteSigner.address
  console.log(`sessionKeyAddress ${sessionKeyAddress}`);
  return json({sessionKeyAddress});
}

