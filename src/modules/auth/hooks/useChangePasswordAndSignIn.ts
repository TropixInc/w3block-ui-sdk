import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ResetPasswordPayload } from '../interface/resetPassword';
import { usePixwayAuthentication } from './usePixwayAuthentication';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

export const useChangePasswordAndSignIn = () => {
  const { changePasswordAndSignIn } = usePixwayAuthentication();
  const [isExpired, setIsExpired] = useState(false);
  const results = useMutation(async (payload: ResetPasswordPayload) => {
    setIsExpired(false);
    try {
      const response = await changePasswordAndSignIn({
        ...payload,
      });
      if (response.error) {
        throw response.error;
      }
      return response;
    } catch (error) {
      const exception = handleNetworkException(error);
      if (exception.statusCode === 410 || exception.message?.toLowerCase().includes('expired')) {
        setIsExpired(true);
      }
      throw exception;
    }
  });

  return useMemo(() => {
    return {
      ...results,
      isExpired,
    };
  }, [isExpired, results]);
};
