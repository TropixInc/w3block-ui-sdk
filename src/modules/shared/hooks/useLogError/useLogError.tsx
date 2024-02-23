import { useContext } from 'react';

import { ErrorContext } from '../../../core/providers/ErrorProvider/ErrorProvider';

export const useLogError = () => {
  return useContext(ErrorContext);
};
