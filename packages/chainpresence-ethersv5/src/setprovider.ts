import { ethers } from 'ethers';
import { PreparedProvider } from './types';
import { SetProviderConfig } from './types';
import { constructedLikeClass } from './idioms';
import { getWindowEthereum } from './getwindowethereum';
import { getSignerAddress } from './getsigneraddress';
import { prepare1193Provider } from './prepare1193provider';

import { getLogger } from './log';

const log = getLogger('chainpresence');

export async function setProvider(
  provider: any,
  addressOrIndex: string | number = 0,
  { chainId, accountsChanged, chainChanged, disconnected }: SetProviderConfig,
): Promise<PreparedProvider> {
  if (!provider) {
    provider = getWindowEthereum();
    if (!provider)
      throw new Error(
        'Please authorize browser extension (Metamask or similar) or provide an RPC based provider',
      );
    provider.autoRefreshOnNetworkChange = false;
    const prepared = await prepare1193Provider(
      provider,
      addressOrIndex,
      chainId,
      {
        accountsChanged,
        chainChanged,
        disconnected,
      },
    );

    // Wrap the injected provider in a Web3 to make it behave consistently
    prepared.provider = new ethers.providers.Web3Provider(prepared.provider);
    const { signer, signerAddress } = await getSignerAddress(
      provider,
      addressOrIndex,
    );
    prepared.signer = signer;
    prepared.signerAddress = signerAddress;
    return prepared;
  }

  // If we already have a Web3Provider wrapper, prepare the original provider
  // again and make a fresh wrapper
  if (constructedLikeClass(provider, ethers.providers.Web3Provider)) {
    log.debug('EIP1193ProviderContext#setProvider: Web3Provider');
    const prepared = await prepare1193Provider(
      provider.provider as ethers.providers.ExternalProvider,
      addressOrIndex,
      chainId,
      {
        accountsChanged,
        chainChanged,
        disconnected,
      },
    );
    prepared.provider = new ethers.providers.Web3Provider(prepared.provider);
    const { signer, signerAddress } = await getSignerAddress(
      provider,
      addressOrIndex,
    );
    prepared.signer = signer;
    prepared.signerAddress = signerAddress;
    log.info(
      `EIP1193ProviderContext#setProvider: prepared.signerAddress: ${prepared.signerAddress}`,
    );
    return prepared;
  }
  log.debug('EIP1193ProviderContext#setProvider: NOT Web3Provider');

  // If the caller wants an explicitly provider type,eg the not-polling
  // StaticJsonRpcProvider, they can just instance it and pass it in and this
  // case deals with it.
  if (typeof provider === 'object' && (provider as any).request) {
    log.debug('EIP1193ProviderContext#setProvider: has request');

    const prepared = await prepare1193Provider(
      provider,
      addressOrIndex,
      chainId,
      {
        accountsChanged,
        chainChanged,
        disconnected,
      },
    );
    const { signer, signerAddress } = await getSignerAddress(
      provider,
      addressOrIndex,
    );
    prepared.signer = signer;
    prepared.signerAddress = signerAddress;
    log.info(
      `EIP1193ProviderContext#setProvider: prepared.signerAddress: ${prepared.signerAddress}`,
    );
    return prepared;
  }

  if (
    typeof provider !== 'object' ||
    (!constructedLikeClass(provider, ethers.providers.BaseProvider) &&
      !constructedLikeClass(provider, ethers.providers.JsonRpcProvider))
  ) {
    log.debug('EIP1193ProviderContext#setProvider: forcing json rpc');

    provider = new ethers.providers.JsonRpcProvider(provider as any);
  }
  log.debug('EIP1193ProviderContext#setProvider: assume generic 1193');

  const prepared = await prepare1193Provider(
    provider,
    addressOrIndex,
    chainId,
    {
      accountsChanged,
      chainChanged,
      disconnected,
    },
  );
  const { signer, signerAddress } = await getSignerAddress(
    provider,
    addressOrIndex,
  );
  prepared.signer = signer;
  prepared.signerAddress = signerAddress;
  log.info(
    `EIP1193ProviderContext#setProvider: prepared.signerAddress: ${prepared.signerAddress}`,
  );
  return prepared;
}
