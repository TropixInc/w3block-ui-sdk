import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import useAxios from '../useAxios/useAxios';
import { usePrivateQuery } from '../usePrivateQuery/usePrivateQuery';

export const useCompanyById = (id: string) => {
  const axios = useAxios();
  return usePrivateQuery([PixwayAPIRoutes.COMPANY_BY_ID, id], () =>
    axios.get(PixwayAPIRoutes.COMPANY_BY_ID.replace('{companyId}', id))
  );
};
