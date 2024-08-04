import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

export function GET() {
  const chain = {
    name: 'op-garnet',
    description: 'TESTNET - Optimism Redstone',
    chainConfig: {
      chainNamespace: 'eip155'
    },
    currency: 'ETH',
    chainId: Number(env['PUBLIC_OP_GARNET_CHAINID']),
    polling: env['PUBLIC_OP_GARNET_POLLING'] ?? 2000,
    arenaProxy: env['PUBLIC_OP_GARNET_TUGAWAR_ADDRESS'],
    arenaDeployer: env['PUBLIC_OP_GARNET_TUGAWAR_DEPLOYER'],

  };
  if (secrets['OP_GARNET_URL'])
    chain.url = secrets['OP_GARNET_URL'];
  if (!chain.url && env['PUBLIC_OP_GARNET_URL'])
    chain.url = env['PUBLIC_OP_GARNET_URL'];
  if (chain.url)
    chain.chainConfig.rpcTarget = chain.url;
  if (env['PUBLIC_OP_GARNET_BRIDGE'])
    chain.bridge = env['PUBLIC_OP_GARNET_BRIDGE'];
  if (env['PUBLIC_OP_GARNET_ETHERSCAN_URL']) {
    chain.etherscanUrl = env['PUBLIC_OP_GARNET_ETHERSCAN_URL'];
    chain.chainConfig.blockExplorerUrl = chain.etherscanUrl;
  }
  return json(chain);
}
