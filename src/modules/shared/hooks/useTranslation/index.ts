import { useEffect } from 'react';
import { useTranslation as usei18NextTranslation } from 'react-i18next';

import { useLocale } from '../useLocale';

const useTranslation = () => {
  const locale = useLocale();
  const translate = usei18NextTranslation();
  useEffect(() => {
    const i18n = translate[1];
    if (i18n.resolvedLanguage !== locale) {
      translate.length >= 1 && i18n.changeLanguage(locale);
    }
  }, [locale, translate]);

  return translate;
};

export default useTranslation;
