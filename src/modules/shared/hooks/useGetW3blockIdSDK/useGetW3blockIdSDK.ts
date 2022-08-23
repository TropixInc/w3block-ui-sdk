import { useCallback } from 'react';

import { W3blockIdSDK } from '@w3block/sdk-id';

import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import { useSessionUser } from '../useSessionUser';
import { useToken } from '../useToken';

export const useGetW3blockIdSDK = () => {
  const token = useToken();
  const user = useSessionUser();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  return useCallback(() => {
    return new W3blockIdSDK({
      credential: {
        email: '',
        tenantId: '',
        password: '',
      },
      autoRefresh: false,
      baseURL: w3blockIdAPIUrl,
      tokens: {
        authToken: token,
        refreshToken: user?.refreshToken ?? '',
      },
    });
  }, [token, user, w3blockIdAPIUrl]);
};
