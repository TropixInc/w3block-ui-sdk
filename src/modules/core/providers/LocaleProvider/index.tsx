import { ReactNode } from 'react';

import { LocaleContext, localeContext } from '../../context/LocaleContext';

interface Props {
  locale?: LocaleContext;
  children?: ReactNode;
}

export const LocaleProvider = ({ locale = 'en', children }: Props) => {
  return (
    <localeContext.Provider value={locale}>{children}</localeContext.Provider>
  );
};
