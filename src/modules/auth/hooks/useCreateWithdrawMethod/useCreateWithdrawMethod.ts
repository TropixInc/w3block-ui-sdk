import { useMutation } from 'react-query';

import { AddWithdrawAccountDto } from '@w3block/sdk-id';

import { useProfile } from '../../../shared';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

export const useCreateWithdrawMethod = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const getSDK = useGetW3blockIdSDK();
  return useMutation([], async (payload: AddWithdrawAccountDto) => {
    const sdk = await getSDK();
    return sdk.api.users.addUserWithdrawAccount(
      tenantId,
      profile?.data?.id ?? '',
      payload
    );
  });
};
