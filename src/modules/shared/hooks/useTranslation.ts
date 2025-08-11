/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation as usei18NextTranslation } from "react-i18next";
import { useThemeConfig } from "../../storefront/hooks/useThemeConfig";
import { getI18nString } from "../../storefront/hooks/useDynamicString";

const useTranslation = () => {
  const translateFn = usei18NextTranslation();
  const theme = useThemeConfig();
  const [translateI18n, i18n] = translateFn;
  const translate = (path: string, obj?: any) => {
    const newStr = "&&" + path;
    const str = getI18nString(newStr, i18n.language, theme);
    if (str?.text === newStr) {
      return translateI18n(path, obj);
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
