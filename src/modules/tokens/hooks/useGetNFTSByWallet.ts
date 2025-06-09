import { PixwayAPIRoutes } from "../../modules/shared/enums/PixwayAPIRoutes";
import { W3blockAPI } from "../../modules/shared/enums/W3blockAPI";
import { useAxios } from "../../modules/shared/hooks/useAxios";
import { usePaginatedQuery } from "../../modules/shared/hooks/usePaginatedQuery";
import { useProfile } from "../../modules/shared/hooks/useProfile";
import { handleNetworkException } from "../../modules/shared/utils/handleNetworkException";

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
    collectionData: {
      id: string;
      name: string;
      pass: boolean;
    };
    tokenEditionData: {
      editionNumber: number;
      id: string;
      rfid: string;
    };
  };
}

export const useGetNFTSByWallet = (chainId: number | undefined) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { data: profile } = useProfile();

  const address = profile?.data?.mainWallet?.address;

  return usePaginatedQuery<NFTByWalletDTO>(
    [PixwayAPIRoutes.NFTS_BY_WALLET, address as string, chainId!],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.NFTS_BY_WALLET.replace(
            '{chainId}',
            chainId!.toString()
          ).replace('{address}', address as string) +
            '?onlyMintedByWeblock=true'
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar NFTs por wallet:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: address != undefined && chainId != undefined,
    }
  );
};
