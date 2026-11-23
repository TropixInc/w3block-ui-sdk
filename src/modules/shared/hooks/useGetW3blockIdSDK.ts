import { useCallback } from 'react';

import { W3blockIdSDK } from '@w3block/sdk-id';
import { useToken } from './useToken';
import { useCompanyConfig } from './useCompanyConfig';
import { useSessionUser } from './useSessionUser';
import { usePixwayAPIURL } from './usePixwayAPIURL';
import { createSessionIdSdk } from '../utils/authenticateIdSdk';


export const useGetW3blockIdSDK = () => {
  const token = useToken();
  const { companyId: tenantId } = useCompanyConfig();
  const user = useSessionUser();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();

  return useCallback(async () => {
    return createSessionIdSdk({
      baseURL: w3blockIdAPIUrl,
      authToken: user ? token : undefined,
      refreshToken: user?.refreshToken,
      tenantId,
    });
  }, [tenantId, token, user, w3blockIdAPIUrl]);
};
