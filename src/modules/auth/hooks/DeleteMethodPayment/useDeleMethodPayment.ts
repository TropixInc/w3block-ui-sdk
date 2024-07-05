import { useMutation } from 'react-query';

import { useProfile } from '../../../shared';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

export const useDeleMethodPayment = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const getSDK = useGetW3blockIdSDK();
  return useMutation([], async (accountId: string) => {
    const sdk = await getSDK();
    return sdk.api.users.deleteUserWithdrawAccount(
      tenantId,
      profile?.data?.id ?? '',
      accountId
    );
  });
};
