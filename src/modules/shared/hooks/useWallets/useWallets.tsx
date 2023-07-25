import { useContext } from 'react';

import { MetamaskProviderContext } from '../../../core';

export const useWallets = () => {
  const { claim, hasProvider, isConnected, wallet, connectMetamask } =
    useContext(MetamaskProviderContext);

  return {
    claim,
    hasProvider,
    isConnected,
    wallet,
    connectMetamask,
  };
};
