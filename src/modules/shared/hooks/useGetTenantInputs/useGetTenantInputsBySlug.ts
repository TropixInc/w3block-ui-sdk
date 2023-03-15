import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

export const useGetTenantInputsBySlug = () => {
  const getSdk = useGetW3blockIdSDK();

  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.TENANT_INPUTS_BY_SLUG],
    async () => {
      const sdk = await getSdk();

      return sdk.api.tenantInput.listBySlugContext(
        companyId as string,
        'signup'
      );
    },
    { enabled: Boolean(companyId) }
  );
};
