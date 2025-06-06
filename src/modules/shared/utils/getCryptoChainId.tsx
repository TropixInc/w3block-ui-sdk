import { ChainScan } from "../enums/ChainId";


export const getExtractLinkByChainId = (chainId: number, address: string) => {
  return `${ChainScan[chainId]}/address/${address}`;
};
