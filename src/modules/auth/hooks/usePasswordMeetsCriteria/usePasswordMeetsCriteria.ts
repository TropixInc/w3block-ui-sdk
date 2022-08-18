import { useMemo } from 'react';

export const usePasswordMeetsCriteria = (password: string) => {
  return useMemo(() => {
    return {
      passwordHasNumber: /\d/g.test(password),
      passwordHasCapitalizedLetter: /[A-Z]/g.test(password),
      passwordHasUncapitalizedLetter: /[a-z]/g.test(password),
      passwordHasMinEightNumbers: password.length >= 8,
    };
  }, [password]);
};
