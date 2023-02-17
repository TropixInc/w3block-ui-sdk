import { useMutation } from 'react-query';

import { AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

export enum AssetTarget {
  PRODUCT = 'product',
  ORDER_DOCUMENT = 'order_document',
  REFUND = 'refund',
  STOREFRONT_PAGE = 'storefront_page',
  STOREFRONT_THEME = 'storefront_theme',
}

type AssetsParams = {
  type: string;
  target?: AssetTarget;
};

interface Response {
  companyId: string;
  createdAt: string;
  directLink: string | null;
  id: string;
  provider: string;
  providerUploadParams: {
    apiKey: string;
    publicId: string;
    queryParams: {
      filename_override: string;
      public_id: string;
      timestamp: string;
      unique_filename: string;
    };
    signature: string;
    signedParams: string;
    timestamp: number;
  };
  status: string;
  updatedAt: string;
}

const useUploadAssets = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  return useMutation<AxiosResponse<Response, unknown>, AssetsParams, unknown>(
    (body: AssetsParams) => {
      return axios.post<Response>(
        PixwayAPIRoutes.COMPANIES_ASSETS.replace(
          '{companyId}',
          companyId ?? ''
        ),
        body
      );
    }
  );
};

export default useUploadAssets;
