import { ChainScan } from '../../enums/ChainScan';

const useAdressBlockchainLink = (chainId?: number, address?: string) => {
  if (!chainId || !address) return undefined;
  return `${ChainScan[chainId]}/address/${address}`;
};

export default useAdressBlockchainLink;
