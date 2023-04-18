import { useContext, useMemo } from 'react';

import { MetamaskProviderContext } from '../../providers';

export const useMetamask = () => {
  const context = useContext(MetamaskProviderContext);
  return useMemo(() => context, [context]);
};
