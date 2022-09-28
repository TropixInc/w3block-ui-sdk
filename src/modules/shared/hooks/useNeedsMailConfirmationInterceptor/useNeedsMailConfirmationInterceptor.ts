import { useContext } from 'react';

import { W3blockUISdkResendConfirmEmail } from '../../../core/context/ResendConfirmEmailContext';

export const useNeedsMailConfirmationInterceptor = () => {
  const interceptorContext = useContext(W3blockUISdkResendConfirmEmail);
  if (!interceptorContext) {
    throw new Error(
      'Interceptor needs to be called as a child of W3blockUISdkResendConfirmEmail provider'
    );
  }
  return interceptorContext;
};
