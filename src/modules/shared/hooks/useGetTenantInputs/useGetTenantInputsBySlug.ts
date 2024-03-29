import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

interface GetTenantInputsBySlugProps {
  slug: string;
}

export const useGetTenantInputsBySlug = ({
  slug,
}: GetTenantInputsBySlugProps) => {
  const getSdk = useGetW3blockIdSDK();

  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.TENANT_INPUTS_BY_SLUG, tenantId, slug],
    async () => {
      const sdk = await getSdk();

      return sdk.api.tenantInput.listBySlugContext(tenantId as string, slug);
    },
    { enabled: Boolean(tenantId && slug) }
  );
};
