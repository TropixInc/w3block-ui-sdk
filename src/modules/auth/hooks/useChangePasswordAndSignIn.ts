import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ResetPasswordPayload } from '../interface/resetPassword';
import { usePixwayAuthentication } from './usePixwayAuthentication';

export const useChangePasswordAndSignIn = () => {
  const { changePasswordAndSignIn } = usePixwayAuthentication();
  const [isExpired, setIsExpired] = useState(false);
  const results = useMutation(async (payload: ResetPasswordPayload) => {
    setIsExpired(false);
    const response = await changePasswordAndSignIn({
      ...payload,
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
