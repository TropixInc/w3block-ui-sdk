import { useQuery } from 'react-query';

import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';

export const useGetTenantInputsBySlug = () => {
  const getSdk = useGetW3blockIdSDK();

  const { companyId } = useCompanyConfig();

  return useQuery([], async () => {
    const sdk = await getSdk();

    return sdk.api.tenantInput.listBySlugContext(companyId as string, 'signup');
  });
};
