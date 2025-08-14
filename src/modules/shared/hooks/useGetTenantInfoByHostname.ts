import { useLocation } from 'react-use';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getPublicAPI } from '../config/api';
<<<<<<< HEAD
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { ICompanyInfo } from '../interfaces/ICompanyInfo';
import { getEnvVar } from '../utils/env';
import { usePixwayAPIURL } from './usePixwayAPIURL';
=======
>>>>>>> aa296e7ea17392c8719d9405ce7b3374c582fc28

export const useGetTenantInfoByHostname = () => {
  const { hostname: location } = useLocation();

  const apisUrl = usePixwayAPIURL();
  const baseUrl = apisUrl.w3blockIdAPIUrl;

  const hostname = location?.includes('localhost')
    ? location?.replace('localhost', 'foodbusters.com.br')
    : location;

  const apiUrl =
    baseUrl + PixwayAPIRoutes.TENANT_BY_HOSTNAME + '?hostname=' + hostname;

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
