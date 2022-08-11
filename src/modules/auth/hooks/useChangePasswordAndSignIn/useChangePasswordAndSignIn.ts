import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';

import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { usePixwayAuthentication } from '../usePixwayAuthentication';

interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  confirmation: string;
}

export const useChangePasswordAndSignIn = () => {
  const { signIn } = usePixwayAuthentication();
  const companyId = useCompanyId();
  const [isExpired, setIsExpired] = useState(false);
  const results = useMutation(async (payload: ResetPasswordPayload) => {
    setIsExpired(false);
    const response = await signIn({
      ...payload,
      companyId,
    });
    if (response.error) {
      if ((response.error as string).includes('expired')) {
        setIsExpired(true);
      }
      throw new Error();
    }
    return response;
  });

  return useMemo(() => {
    return {
      ...results,
      isExpired,
    };
  }, [isExpired, results]);
};
