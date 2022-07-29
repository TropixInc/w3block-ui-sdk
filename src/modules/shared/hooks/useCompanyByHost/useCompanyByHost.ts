import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import useAxios from '../useAxios/useAxios';

interface CompanyTheme {
  headerLogoUrl: string | null;
  headerBackgroundColor: string;
  bodyCardBackgroundColor: string;
}

export interface CompanyByHostDTO {
  name: string;
  id: string;
  theme: CompanyTheme;
}

export const getCompanyByHostQueryName = (host: string) => {
  return [PixwayAPIRoutes.COMPANY_BY_HOST, host];
};

export const useCompanyByHost = (host: string) => {
  const axios = useAxios();
  return useQuery(getCompanyByHostQueryName(host), () =>
    axios.get<CompanyByHostDTO>(PixwayAPIRoutes.COMPANY_BY_HOST, {
      params: {
        host,
      },
    })
  );
};
