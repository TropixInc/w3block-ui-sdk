import { useContext } from 'react';

import { localeContext } from '../../../core/context/LocaleContext';

export const useLocale = () => {
  return useContext(localeContext);
};
