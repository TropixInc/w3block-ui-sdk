enum ChainScan {
  'https://etherscan.io' = 1,
  'https://ropsten.etherscan.io' = 3,
  'https://rinkeby.etherscan.io' = 4,
  'https://kovan.etherscan.io' = 42,
  'https://mumbai.polygonscan.com' = 80001,
  'https://polygonscan.com' = 137,
}

export const useChainScanLink = (chainId?: number, mintedHash?: string) => {
  if (!chainId || !mintedHash) return undefined;
  return `${ChainScan[chainId]}/tx/${mintedHash}`;
};
