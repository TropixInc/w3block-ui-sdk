import { ChainScan } from '../../enums/ChainScan';

export const useChainScanLink = (chainId?: number, mintedHash?: string) => {
  if (!chainId || !mintedHash) return undefined;
  return `${ChainScan[chainId]}/tx/${mintedHash}`;
};
