/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import _ from 'lodash';


import { IThemeContext } from '../../shared/interfaces/IThemeContext';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { useThemeConfig } from './useThemeConfig';
import { unescapeHtml } from '../utils/unescapeHtml';
import { modifyStringPath } from '../utils/modifyStringPath';


export const useDynamicString = (input: string | undefined) => {
  const { isDynamic, datasource, loading, strapiLocalization } =
    useDynamicApi();
  const theme = useThemeConfig();
  const [, i18n] = useTranslation();
  const [userLocale] = useLocalStorage('userLocale');
  const locale = (userLocale as string) || i18n.language;
  const i18nLocales = theme?.defaultTheme?.configurations?.contentData?.i18nJson
    ?.locales as Array<any>;
  return useMemo(() => {
    if (input?.includes('&&') || input?.includes('&amp;&amp;')) {
      const inputToUse = input?.includes('&amp;&amp;')
        ? unescapeHtml(input)
        : input;
      const value = getI18nString(inputToUse, locale, theme);
      return value;
    }
    // not dynamic, bypass
    if (!isDynamic) return { text: input, loaded: true, loading: false };

    const replacements = Array.from(
      (input ?? '').matchAll(new RegExp(/\{(.*?)\}/g))
    );
    let text = input ?? '';
    let loaded = true;
    replacements.forEach((item) => {
      const [q, key] = item;
      const [namespace] = (key || '').split('.');
      const hasFirstLoad = _.get(datasource, namespace);
      if (loaded && !hasFirstLoad) loaded = false;
      if (strapiLocalization) {
        const localeKey = modifyStringPath(
          key,
          `localizations.${locale.split('-')?.[0]}`
        );
        const value = _.get(datasource, localeKey, '');
        if (value) text = text.replace(q, value);
        else {
          let newValue = '';
          i18nLocales?.some((val) => {
            const modifiedKey = modifyStringPath(
              key,
              `localizations.${val?.code?.split('-')?.[0]}`
            );
            const valuelocale = _.get(datasource, modifiedKey, '');
            if (valuelocale) {
              newValue = valuelocale;
              return true;
            } else false;
          });
          if (newValue !== '') {
            text = text.replace(q, newValue);
          } else {
            text = text.replace(q, _.get(datasource, key, ''));
          }
        }
      } else {
        text = text.replace(q, _.get(datasource, key, ''));
      }
    });
    return { text, loaded, loading };
  }, [
    input,
    isDynamic,
    loading,
    locale,
    theme,
    datasource,
    strapiLocalization,
    i18nLocales,
  ]);
};

export const getDynamicString = (input: string | undefined, data: any) => {
  const replacements = Array?.from(
    (input ?? '')?.matchAll(new RegExp(/\{(.*?)\}/g))
  );
  let text = input ?? '';
  let loaded = true;
  replacements?.forEach((item) => {
    const [q, key] = item;
    const [namespace] = (key || '').split('.');
    const hasFirstLoad = _.get(data, namespace);
    if (loaded && !hasFirstLoad) loaded = false;
    text = text.replace(q, _.get(data, key, ''));
  });
  return { text, loaded };
};

export const getI18nString = (
  input: string | undefined,
  locale: string,
  theme: IThemeContext
) => {
  const i18nJson =
    theme?.defaultTheme?.configurations?.contentData?.i18nJson?.values;
  const i18nLocales = theme?.defaultTheme?.configurations?.contentData?.i18nJson
    ?.locales as Array<any>;
  if (input?.includes('&&') || input?.includes('&amp;&amp;')) {
    const inputToUse = input?.includes('&amp;&amp;')
      ? unescapeHtml(input)
      : input;
    const findItem = i18nJson?.find(
      (res: any) => res.jsonString === inputToUse
    );
    if (findItem) {
      const exactMatch = findItem[locale];
      if (exactMatch) {
        return { text: exactMatch, loaded: true, loading: false };
      }

      const baseLanguage = locale.split('-')[0];
      let relatedMatch = '';

      i18nLocales.some((val) => {
        const localeCode = val?.code;
        if (localeCode?.startsWith(baseLanguage + '-')) {
          const string = findItem[localeCode];
          if (string) {
            relatedMatch = string;
            return true;
          }
        }
        return false;
      });

      if (relatedMatch) {
        return { text: relatedMatch, loaded: true, loading: false };
      }

      const baseLanguageMatch = i18nLocales.find(
        (val) => val?.code === baseLanguage
      );
      if (baseLanguageMatch && findItem[baseLanguage]) {
        return { text: findItem[baseLanguage], loaded: true, loading: false };
      }

      let anyTranslation = '';
      i18nLocales.some((val) => {
        const string = findItem[val?.code];
        if (string) {
          anyTranslation = string;
          return true;
        }
        return false;
      });

      return {
        text: anyTranslation || input,
        loaded: true,
        loading: false,
      };
    } else return { text: input, loaded: true, loading: false };
  }
  return { text: input, loaded: true, loading: false };
};
