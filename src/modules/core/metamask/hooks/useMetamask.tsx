import { useContext, useMemo } from 'react';
import { MetamaskProviderContext } from '../providers/MetamaskProviderUiSDK';

export const useMetamask = (): any => {
  const context = useContext(MetamaskProviderContext);
  return useMemo(() => context, [context]);
};
