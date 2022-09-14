import { useMemo } from 'react';

export const useEmailProtectedLabel = (email: string) => {
  return useMemo(() => {
    const emailSplitted = email.split('@');
    if (emailSplitted.length === 1) return emailSplitted;
    return emailSplitted[0]
      .substring(0, 2)
      .concat('****@')
      .concat(emailSplitted[1]);
  }, [email]);
};
