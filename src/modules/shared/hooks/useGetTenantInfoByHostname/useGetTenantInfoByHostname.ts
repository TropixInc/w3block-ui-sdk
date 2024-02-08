import { useQuery } from 'react-query';
import { useLocation } from 'react-use';

import { getPublicAPI } from '../../config/api';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { IcompanyInfo } from '../useGetTenantInfoById';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';

export const useGetTenantInfoByHostname = () => {
  const { hostname: location } = useLocation();
  const apisUrl = usePixwayAPIURL();
  const baseUrl = apisUrl.w3blockIdAPIUrl;
  const hostname =
    process.env.NEXT_PUBLIC_ENVIRONMENT != 'development' &&
    process.env.NEXT_PUBLIC_ENVIRONMENT != 'production'
      ? 'https://foodbusters.stg.w3block.io/'
      : location;
  const apiUrl =
    baseUrl + PixwayAPIRoutes.TENANT_BY_HOSTNAME + '?hostname=' + hostname;
  return useQuery(
    apiUrl,
    async (): Promise<IcompanyInfo> => {
      const info = await getPublicAPI(baseUrl).get(apiUrl);
      return info.data;
    },
    { enabled: hostname != '' && hostname != undefined }
  );
};
