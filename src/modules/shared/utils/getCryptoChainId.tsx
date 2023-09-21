import { ChainScan } from '../enums/ChainScan';

export const getExtractLinkByChainId = (chainId: number, address: string) => {
  return `${ChainScan[chainId]}/address/${address}`;
};
