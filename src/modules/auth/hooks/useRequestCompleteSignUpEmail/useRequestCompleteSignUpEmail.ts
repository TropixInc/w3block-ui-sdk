import { useMutation } from 'react-query';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

interface Payload {
  email: string;
  tenantId?: string;
}

export const useRequestCompleteSignUpEmail = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId } = useCompanyConfig();
  return useMutation(async ({ email, tenantId }: Payload) => {
    const sdk = await getSDK();
    return sdk.api.users.accountCompleteRetry({
      email,
      tenantId: tenantId ?? companyId,
    });
  });
};
