import { ChainScan } from "../enums/ChainId";

const useAdressBlockchainLink = (chainId?: number, address?: string) => {
  if (!chainId || !address) return undefined;
  return `${ChainScan[chainId]}/address/${address}`;
};

export default useAdressBlockchainLink;
