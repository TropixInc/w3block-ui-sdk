
import { useLocation } from 'react-use';


import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { usePixwayAPIURL } from './usePixwayAPIURL';

import { ICompanyInfo } from '../interfaces/ICompanyInfo';
import { useQuery } from '@tanstack/react-query';
import { getPublicAPI } from '../config/api';


export const useGetTenantInfoByHostname = () => {
  const { hostname: location } = useLocation();

 
  const apisUrl = usePixwayAPIURL();
  const baseUrl = apisUrl.w3blockIdAPIUrl;
  const hostname =
    process.env.NEXT_PUBLIC_ENVIRONMENT != 'development' &&
    process.env.NEXT_PUBLIC_ENVIRONMENT != 'production'
      ? 'foodbusters.w3block.io'
      : location;

  const apiUrl =
    baseUrl + PixwayAPIRoutes.TENANT_BY_HOSTNAME + '?hostname=' + hostname;
  return useQuery(
    [apiUrl],
    async (): Promise<ICompanyInfo> => {
      const info = await getPublicAPI(baseUrl).get(apiUrl);
      return info.data;
    },
    { enabled: hostname != '' && hostname != undefined }
  );
};
