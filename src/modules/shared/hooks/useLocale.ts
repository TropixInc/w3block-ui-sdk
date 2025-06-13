import { useContext } from 'react';
import { LocaleContext } from '../../core/context/LocaleContext';




export const useLocale = () => {
  return useContext(LocaleContext);
};
