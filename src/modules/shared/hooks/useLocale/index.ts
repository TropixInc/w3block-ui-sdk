import { useContext } from 'react';

import { LocaleContext } from '../../../core/context/LocaleContext/LocaleContext';

export const useLocale = () => {
  return useContext(LocaleContext);
};
