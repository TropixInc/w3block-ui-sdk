import { AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../../shared/hooks/usePrivateQuery';

interface EstimateTransferGasAPIResponse {
  totalGas: number;
  totalGasPrice: {
    fast: string;
    proposed: string;
    safe: string;
  };
}

export const useEstimateTransferGas = (
  editionId: string,
  toAddress: string,
  options: QueryConfig<AxiosResponse<EstimateTransferGasAPIResponse>> = {}
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const companyId = useCompanyId();

  return usePrivateQuery(
    [PixwayAPIRoutes.ESTIMATE_TRANSFER_GAS, companyId, editionId],
    () => {
      const response = axios.get<EstimateTransferGasAPIResponse>(
        PixwayAPIRoutes.ESTIMATE_TRANSFER_GAS.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{id}', editionId),
        {
          params: {
            toAddress,
          },
        }
      );

      return response;
    },
    {
      ...options,
    }
  );
};
