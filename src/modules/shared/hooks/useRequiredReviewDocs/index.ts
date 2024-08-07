import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';

interface MutationProps {
  userId: string;
  contextId: string;
  inputIds: Array<string>;
  reason: string;
  userContextId: string;
}

export const useRequiredReviewDocs = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return useMutation(
    [PixwayAPIRoutes.REQUEST_REVIEW_KYC, tenantId],
    async ({
      contextId,
      inputIds,
      reason,
      userId,
      userContextId,
    }: MutationProps) => {
      const sdk = await getSdk();

      return sdk.api.users.requireReviewTenantContextByUserId(
        tenantId ?? '',
        userId,
        contextId,
        { inputIds: inputIds, reason: reason, userContextId: userContextId }
      );
    }
  );
};
