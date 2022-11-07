import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useUserWallet } from '../useUserWallet';

export const useProcessingTokens = () => {
  const { wallet } = useUserWallet();
  const axios = useAxios(W3blockAPI.KEY);
  return useQuery(
    [
      PixwayAPIRoutes.METADATA_PROCESSING,
      wallet?.chainId as number,
      wallet?.address as string,
    ],
    () =>
      axios
        .get(
          PixwayAPIRoutes.METADATA_PROCESSING.replace(
            '{address}',
            wallet?.address ?? ''
          ).replace('{chainId}', (wallet?.chainId ?? 80001).toString())
        )
        .then((data) => data.data),
    {
      retry: 1,
      enabled: wallet != undefined,
    }
  );
};
