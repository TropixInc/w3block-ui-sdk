import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { cleanObject } from '../../shared/utils/validators';
import { ErcTokenHistoryInterfaceResponse } from '../interface/ercTokenHistoryInterface';

export const useGetErcTokensHistory = (
  loyaltyId: string | undefined,
  filters: any
) => {
  const cleaned = cleanObject(filters);
  const queryString = new URLSearchParams(cleaned).toString();
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const { data: session } = usePixwaySession();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID,
      queryString,
      loyaltyId,
      companyId,
      session?.id,
    ],
    async (): Promise<ErcTokenHistoryInterfaceResponse> => {
      try {
        const response = await axios.get<ErcTokenHistoryInterfaceResponse>(
          PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID.replace(
            '{userId}',
            session?.id ?? ''
          )
            .replace('{companyId}', companyId)
            .replace('{loyaltyId}', loyaltyId!) +
            '?' +
            queryString
        );
        return response.data;
      } catch (error) {
        throw handleNetworkException(error);
      }
    },
    {
      enabled: !!loyaltyId && !!companyId && !!session?.id,
      refetchOnWindowFocus: false,
    }
  );
};
