import { ExternalProvider } from '@ethersproject/providers';

const getGlobalObject = (): any => {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('[svelte-ethers-store] cannot find the global object');
};

export function getWindowEthereum(): ExternalProvider | undefined {
  try {
    if (getGlobalObject().ethereum) return getGlobalObject().ethereum;
  } catch (err) {
    console.error('no globalThis.ethereum object');
  }
}
