import { useContext } from 'react';

import { MetamaskProviderContext } from '../../../core/metamask/providers/MetamaskProviderUiSDK';

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
