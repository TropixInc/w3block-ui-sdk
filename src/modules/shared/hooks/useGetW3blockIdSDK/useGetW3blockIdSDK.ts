import { useCallback } from 'react';

import { W3blockIdSDK } from '@w3block/sdk-id';

import { useSessionUser } from '../useSessionUser';
import { useToken } from '../useToken';

export const useGetW3blockIdSDK = () => {
  const token = useToken();
  const user = useSessionUser();
  return useCallback(() => {
    return new W3blockIdSDK({
      credential: {
        email: '',
        tenantId: '',
        password: '',
      },
      autoRefresh: false,
      baseURL: process.env.NEXT_PUBLIC_API_ID_URL,
      tokens: {
        authToken: token,
        refreshToken: user?.refreshToken ?? '',
      },
    });
  }, [token, user]);
};
