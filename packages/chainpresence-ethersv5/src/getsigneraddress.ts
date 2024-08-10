import { ethers } from 'ethers';
import { getLogger } from './log';

const log = getLogger('chainpresence');

export async function getSignerAddress(
  provider: ethers.providers.Web3Provider,
  addressOrIndex: string | number | undefined,
): Promise<{
  signer: ethers.Signer | undefined;
  signerAddress: string | undefined;
}> {
  let signer: ethers.Signer;
  let signerAddress: string;

  try {
    signer = provider.getSigner(addressOrIndex);
    signerAddress = await signer.getAddress();
    return { signer, signerAddress };
  } catch (err) {
    log.info(
      'failed to get signer and address from provider, not all providers support this',
    );
    return { signer: undefined, signerAddress: undefined };
  }
}
