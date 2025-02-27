import { useQuery } from 'react-query';

import { AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';
import { DynamicFormFieldValue } from '../interfaces/DynamicFormFieldValue';
import { getPublicTokenDataQueryKey } from '../utils/getPublicTokenDataQueryKey';

interface TokenData {
  rfid?: string;
  contractAddress?: string;
  chainId?: string;
  tokenId?: string;
  enabled?: boolean;
}

export interface CompanyTheme {
  headerLogoUrl: string | null;
  headerBackgroundColor: string;
  bodyCardBackgroundColor: string;
}

export interface PublicTokenPageDTO {
  company: {
    id: string;
    name: string;
    theme: CompanyTheme;
  };
  group: {
    categoryName: string;
    categoryId: string;
    subcategoryName: string;
    subcategoryId: string;
    collectionId: string;
    collectionPass: boolean;
  };
  information: {
    title: string;
    mainImage: string | null;
    description: string;
    contractName: string;
  };
  dynamicInformation: {
    tokenData: Record<string, DynamicFormFieldValue>;
    publishedTokenTemplate: DynamicFormConfiguration;
  };
  edition: {
    total: number;
    currentNumber: string;
    rfid: string;
    isMultiple: boolean;
    mintedAt?: string;
    mintedHash?: string;
  };
  token?: {
    tokenId?: string;
    address?: string;
    chainId?: number;
    firstOwnerAddress?: string;
  };
  isMinted: boolean;
}

export const usePublicTokenData = ({
  rfid,
  chainId,
  contractAddress,
  tokenId,
  enabled = true,
}: TokenData) => {
  const axios = useAxios(W3blockAPI.KEY);

  return useQuery<AxiosResponse<PublicTokenPageDTO>>(
    getPublicTokenDataQueryKey({
      contractAddress,
      rfid,
      tokenId,
    }),
    async () => {
      try {
        const endpoint = rfid
          ? PixwayAPIRoutes.METADATA_BY_RFID.replace('{rfid}', rfid)
          : PixwayAPIRoutes.METADATA_BY_CHAINADDRESS_AND_TOKENID.replace(
              '{contractAddress}',
              contractAddress ?? ''
            )
              .replace('{tokenId}', tokenId ?? '')
              .replace('{chainId}', chainId ?? '');

        const response = await axios.get<PublicTokenPageDTO>(endpoint);
        return response;
      } catch (err) {
        console.error('Erro ao buscar dados públicos do token:', err);
        throw handleNetworkException(err);
      }
    },
    {
      staleTime: Infinity,
      enabled:
        contractAddress != undefined &&
        tokenId != undefined &&
        chainId != undefined &&
        contractAddress != '' &&
        tokenId != '' &&
        chainId != '' &&
        enabled,
    }
  );
};
