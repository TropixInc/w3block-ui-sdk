/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation as usei18NextTranslation } from 'react-i18next';

import { getI18nString } from '../../../storefront/hooks/useDynamicString';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';

const useTranslation = () => {
  const translateFn = usei18NextTranslation();
  const theme = UseThemeConfig();
  const [translateI18n, i18n] = translateFn;
  const translate = (path: string, obj?: any) => {
    const str = getI18nString(path, i18n.language, theme);
    if (str?.text === path) {
      if (str?.text?.indexOf('&&') === 0) {
        const str2 = path.slice(2, path.length);
        return translateI18n(str2, obj);
      } else {
        return translateI18n(path, obj);
      }
    }
    return str?.text as string;
  };
  const translationArray = [translate, i18n] as const;
  translationArray[Symbol.iterator] = function* () {
    yield translate;
    yield i18n;
  } as any;
  return translationArray;
};

export default useTranslation;
