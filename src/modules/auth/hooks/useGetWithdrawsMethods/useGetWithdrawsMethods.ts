import { W3blockAPI } from '../../../shared';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePaginatedQuery } from '../../../shared/hooks/usePaginatedQuery';

const useGetWithdrawsMethods = (userId: string, type: string) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId: tenantId } = useCompanyConfig();

  return usePaginatedQuery(
    [PixwayAPIRoutes.WITHDRAWS_METHODS, userId, type],
    () =>
      axios.get(
        PixwayAPIRoutes.WITHDRAWS_METHODS.replace(
          '{tenantId}',
          tenantId
        ).replace('{userId}', userId)
      )
  );
};

export default useGetWithdrawsMethods;
