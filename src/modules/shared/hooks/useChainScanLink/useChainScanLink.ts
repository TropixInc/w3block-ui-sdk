import { ChainScan } from '../../enums/ChainScan';

const useChainScanLink = (chainId?: number, mintedHash?: string) => {
  if (!chainId || !mintedHash) return undefined;
  return `${ChainScan[chainId]}/tx/${mintedHash}`;
};

export default useChainScanLink;
