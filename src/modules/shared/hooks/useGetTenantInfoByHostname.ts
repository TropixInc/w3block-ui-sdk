import { useLocation } from 'react-use';

import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { usePixwayAPIURL } from './usePixwayAPIURL';

import { ICompanyInfo } from '../interfaces/ICompanyInfo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPublicAPI } from '../config/api';
import { getEnvVar } from '../utils/env';

export const useGetTenantInfoByHostname = () => {
  const { hostname: location } = useLocation();

  const apisUrl = usePixwayAPIURL();
  const baseUrl = apisUrl.w3blockIdAPIUrl;
  const enviroment = getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'developmento');

  const hostname =
    enviroment != 'development' && enviroment != 'production'
      ? 'foodbusters.com.br'
      : location;

  const apiUrl =
    baseUrl + PixwayAPIRoutes.TENANT_BY_HOSTNAME + '?hostname=' + hostname;

    console.log(apiUrl, "apiUrl")

  const queryClient = useQueryClient();

  if (!queryClient) {
    console.error(
      'No QueryClient found! Make sure QueryClientProvider is set up in your app.'
    );
    throw new Error(
      'QueryClient not found. Please wrap your app with QueryClientProvider.'
    );
  }

  return useQuery({
    queryKey: [apiUrl],
    queryFn: async (): Promise<ICompanyInfo> => {
      const info = await getPublicAPI(baseUrl).get(apiUrl);
      return info.data;
    },
    enabled:
      hostname != '' && hostname != undefined && typeof window !== 'undefined',
  });
};
