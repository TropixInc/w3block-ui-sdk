import { useMemo } from 'react';

import {
  PASSWORD_HAS_CAPITALIZED_LETTER,
  PASSWORD_HAS_NUMBER,
  PASSWORD_HAS_UNCAPITALIZED_LETTER,
  PASSWORD_MIN_LENGTH,
} from '../utils/passwordConstants';

export const usePasswordMeetsCriteria = (password: string) => {
  return useMemo(() => {
    return {
      passwordHasNumber: PASSWORD_HAS_NUMBER.test(password),
      passwordHasCapitalizedLetter:
        PASSWORD_HAS_CAPITALIZED_LETTER.test(password),
      passwordHasUncapitalizedLetter:
        PASSWORD_HAS_UNCAPITALIZED_LETTER.test(password),
      passwordHasMinEightNumbers: password.length >= PASSWORD_MIN_LENGTH,
    };
  }, [password]);
};
