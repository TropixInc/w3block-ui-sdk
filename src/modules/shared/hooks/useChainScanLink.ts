import { ChainScan } from '../enums/ChainId';

export const useChainScanLink = (chainId?: number, mintedHash?: string) => {
  if (!chainId || !mintedHash) return undefined;
  return `${ChainScan[chainId]}/tx/${mintedHash}`;
};
