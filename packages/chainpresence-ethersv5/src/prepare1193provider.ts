import { ethers } from 'ethers';

import { EIP1193ProviderContextInterface } from './types';
import { PreparedProvider } from './types';
import { Prepare1193ProviderConfig } from './types';

import { alwaysNumber } from './idioms';
import { etherrmsg } from './idioms';

import { getLogger } from './log';

const log = getLogger('chainpresence');

export async function prepare1193Provider(
  eip1193Provider: any,
  addressOrIndex: string | number,
  chainId: number | undefined,
  cfg: Prepare1193ProviderConfig,
): Promise<PreparedProvider> {
  const { accountsChanged, chainChanged, disconnected } = cfg;

  let request: (...args: any[]) => Promise<any>;
  // Get the eip 1193 compatible request method
  if (eip1193Provider?.request) {
    request = eip1193Provider.request.bind(eip1193Provider);
  } else if ((eip1193Provider as any).send) {
    // This is the ethers JsonRpcProvider api which predated eip 1193 and this package is made *for* ethers
    request = (r) => (eip1193Provider as any).send(r.method, r.params || []);
  } else {
    throw new Error(
      `EIP 1193 compatible providers must implement one of 'request' or 'send'`,
    );
  }

  if (eip1193Provider?.removeAllListeners)
    eip1193Provider?.removeAllListeners();

  // Ensure we always remove, though I believe this un-necessary
  removeListeners(eip1193Provider, {
    accountsChanged,
    chainChanged,
    disconnected,
  });
  let accounts: string[] | undefined;
  try {
    accounts = await request({ method: 'eth_requestAccounts' });
  } catch (err) {
    log.info(
      `eth_requestAccounts not available on provider ${eip1193Provider.constructor.name}`,
    );
  }

  if (addressOrIndex === undefined) {
    if (Array.isArray(accounts) && accounts.length) {
      addressOrIndex = accounts[0];
    }
  } else if (typeof addressOrIndex === 'number') {
    if (Array.isArray(accounts) && accounts.length) {
      addressOrIndex = accounts[addressOrIndex];
    }
  }

  if ((eip1193Provider as any).on) {
    // TODO handle disconnect/connect events
    if (accountsChanged)
      (eip1193Provider as any).on('accountsChanged', accountsChanged);
    if (chainChanged) (eip1193Provider as any).on('chainChanged', chainChanged);
    if (disconnected) (eip1193Provider as any).on('disconnect', disconnected);
  }

  if (!chainId) {
    try {
      const r = await request({ method: 'eth_chainId' });
      chainId = alwaysNumber(r);
    } catch (err) {
      log.info(`failed to get chainId`, etherrmsg(err));
    }
  } else {
    let currentChainId: number | undefined;
    try {
      const r = await request({ method: 'eth_chainId' });
      currentChainId = alwaysNumber(r);
    } catch (err) {
      log.info(`failed to check chainId`, etherrmsg(err));
    }

    if (chainId !== currentChainId) {
      throw new Error(
        `chain id mismatch. expected ${chainId}, have ${currentChainId}`,
      );
    }
  }

  return {
    evmProviderType: eip1193Provider?.constructor?.name,
    provider: new ethers.providers.Web3Provider(eip1193Provider),
    request: request,
    accounts: accounts || [],
    addressOrIndex,
    chainId,
    signer: null,
    signerAddress: '',
  };
}

export async function accountsChanged(
  ctx: EIP1193ProviderContextInterface,
): Promise<void> {
  await prepare1193Provider(
    ctx.eip1193Provider,
    Array.isArray(ctx.accounts) && ctx.accounts.length ? ctx.accounts[0] : 0,
    ctx.chainId,
    {
      accountsChanged: ctx.accountsChanged.bind(ctx),
      chainChanged: ctx.chainChanged.bind(ctx),
      disconnected: ctx.disconnected.bind(ctx),
    },
  );
}

export async function chainChanged(
  ctx: EIP1193ProviderContextInterface,
): Promise<void> {
  await prepare1193Provider(
    ctx.eip1193Provider,
    Array.isArray(ctx.accounts) && ctx.accounts.length ? ctx.accounts[0] : 0,
    ctx.chainId,
    {
      accountsChanged: ctx.accountsChanged.bind(ctx),
      chainChanged: ctx.chainChanged.bind(ctx),
      disconnected: ctx.disconnected.bind(ctx),
    },
  );
}

export function disconnected(
  ctx: EIP1193ProviderContextInterface,
  err: Error,
): void {
  log.info(
    `provider ${ctx.eip1193Provider?.constructor?.name} disconnected: ${err}`,
  );
}

export function removeListeners(
  eip1193Provider: any,
  { accountsChanged, chainChanged, disconnected }: Prepare1193ProviderConfig,
): void {
  if (!eip1193Provider?.removeListener) return;
  if (accountsChanged)
    eip1193Provider.removeListener('accountsChanged', accountsChanged);
  if (chainChanged)
    eip1193Provider.removeListener('chainChanged', chainChanged);
  if (disconnected) eip1193Provider.removeListener('disconnect', disconnected);
}
