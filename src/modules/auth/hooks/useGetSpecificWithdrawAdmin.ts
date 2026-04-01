import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

export const useGetSpecificWithdrawAdmin = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN],
    () =>
      axios.get(
        PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN.replace(
          '{companyId}',
          companyId
        ).replace('{id}', id)
      ),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );
};
