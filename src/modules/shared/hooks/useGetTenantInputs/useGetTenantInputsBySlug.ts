import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';

export const useGetTenantInputsBySlug = () => {
  const getSdk = useGetW3blockIdSDK();

  const { companyId } = useCompanyConfig();

  return usePrivateQuery([], async () => {
    const sdk = await getSdk();

    return sdk.api.tenantInput.listBySlugContext(companyId as string, 'signup');
  });
};
