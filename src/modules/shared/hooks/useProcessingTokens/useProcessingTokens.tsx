import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { MediaInterface, MetadataInterface } from '../../interface';
import { useAxios } from '../useAxios';
import { useUserWallet } from '../useUserWallet';

interface TokensProccessingInterface {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
  };
  title: string;
  description: string;
  media: MediaInterface[];
  metadata: MetadataInterface;
}

export const useProcessingTokens = () => {
  const { mainWallet: wallet } = useUserWallet();
  const axios = useAxios(W3blockAPI.KEY);
  return useQuery(
    [
      PixwayAPIRoutes.METADATA_PROCESSING,
      wallet?.chainId as number,
      wallet?.address as string,
    ],
    () =>
      axios
        .get<TokensProccessingInterface[]>(
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
