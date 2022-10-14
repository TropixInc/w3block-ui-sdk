import { useProfile } from '../../../shared';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { usePaginatedPrivateQuery } from '../../../shared/hooks/usePaginatedPrivateQuery';

interface Media {
  raw: string;
  gateway: string;
  thumbnail: string;
}

interface MetadataAtribute {
  value: string;
  trait_type: string;
}

export interface NFTByWalletDTO {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  balance: string;
  title: string;
  description: string;
  tokenUri: {
    raw: string;
    gateway: string;
  };
  media: Array<Media>;
  metadata: {
    image?: string;
    atributes?: Array<MetadataAtribute>;
    timeLastUpdated?: string;
  };
}

export const useGetNFTSByWallet = (chainId: number) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { data: profile } = useProfile();

  const address = profile?.data?.mainWallet?.address ?? '';

  return usePaginatedPrivateQuery<NFTByWalletDTO>(
    [PixwayAPIRoutes.NFTS_BY_WALLET, address, chainId],
    () => {
      return axios.get(
        PixwayAPIRoutes.NFTS_BY_WALLET.replace(
          '{chainId}',
          chainId.toString()
        ).replace('{address}', address)
      );
    }
  );
};
