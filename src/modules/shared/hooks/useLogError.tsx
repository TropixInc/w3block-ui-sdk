import { useContext } from 'react';
import { ErrorContext } from '../../core/providers/ErrorProvider';



export const useLogError = (): any => {
  return useContext(ErrorContext);
};
