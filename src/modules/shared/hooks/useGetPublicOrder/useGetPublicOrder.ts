import { useQuery } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

export const useGetPublicOrder = (deliverId: string, enabled?: boolean) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  return useQuery(
    [PixwayAPIRoutes.PUBLIC_ORDER_BY_DELIVERID, companyId, deliverId],
    () =>
      axios.get(
        PixwayAPIRoutes.PUBLIC_ORDER_BY_DELIVERID.replace(
          '{companyId}',
          companyId
        ).replace('{deliverId}', deliverId)
      ),
    {
      enabled: !!deliverId && enabled,
      retry: false,
    }
  );
};
