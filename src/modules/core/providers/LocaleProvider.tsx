import { ReactNode } from 'react';
import { LocaleContext, PixwayUISdkLocale } from '../context/LocaleContext';

interface Props {
  locale?: PixwayUISdkLocale;
  children?: ReactNode;
}

export const LocaleProvider = ({ locale = 'en', children }: Props) => {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};
