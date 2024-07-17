import { useMutation, useQueryClient } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';

interface Props {
  userId: string;
  contextId: string;
}

const useApproveKYC = () => {
  const queryClient = useQueryClient();
  const { companyId: tenantId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return useMutation(
    [PixwayAPIRoutes.APROVE_KYC],
    async (body: Props) => {
      const sdk = await getSdk();
      return sdk.api.users.approveTenantContextByUserId(
        tenantId ?? '',
        body.userId,
        body.contextId,
        { reason: '' }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PixwayAPIRoutes.GET_DOCUMENTS_BY_USER]);
        queryClient.invalidateQueries([PixwayAPIRoutes.KYC_LIST]);

        queryClient.invalidateQueries(PixwayAPIRoutes.CONTEXT_BY_USER_ID);
      },
    }
  );
};

export default useApproveKYC;
