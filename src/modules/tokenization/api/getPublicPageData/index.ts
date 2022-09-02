import { AxiosInstance } from 'axios';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { DynamicFormConfiguration } from '../../interfaces/DynamicFormConfiguration';
import { DynamicFormFieldValue } from '../../interfaces/DynamicFormFieldState';

interface Config {
  chainId?: string;
  contractAddress?: string;
  tokenId?: string;
  RFID?: string;
  axios: AxiosInstance;
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
  };
  isMinted: boolean;
}

export const getPublicPageData = ({
  RFID = '',
  chainId = '',
  contractAddress = '',
  tokenId = '',
  axios,
}: Config) => {
  return axios
    .get<PublicTokenPageDTO>(
      RFID
        ? PixwayAPIRoutes.METADATA_BY_RFID.replace('{rfid}', RFID)
        : PixwayAPIRoutes.METADATA_BY_CHAINADDRESS_AND_TOKENID.replace(
            '{contractAddress}',
            contractAddress
          )
            .replace('{tokenId}', tokenId)
            .replace('{chainId}', chainId)
    )
    .then((res) => res.data);
};
