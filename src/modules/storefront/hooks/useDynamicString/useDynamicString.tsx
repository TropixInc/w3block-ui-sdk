/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import _ from 'lodash';

import { useLocale } from '../../../shared/hooks/useLocale';
import { IThemeContext } from '../../contexts';
import { useDynamicApi } from '../../provider/DynamicApiProvider';
import { modifyStringPath } from '../../utils/modifyStringPath';
import { unescapeHtml } from '../../utils/unescapeHtml';
import { UseThemeConfig } from '../useThemeConfig/useThemeConfig';

export const useDynamicString = (input: string | undefined) => {
  const { isDynamic, datasource, loading, strapiLocalization } =
    useDynamicApi();
  const theme = UseThemeConfig();
  const locale = useLocale();
  const i18nJson =
    theme?.defaultTheme?.configurations?.contentData?.i18nJson?.values;
  const i18nLocales = theme?.defaultTheme?.configurations?.contentData?.i18nJson
    ?.locales as Array<any>;
  return useMemo(() => {
    if (input?.includes('&&') || input?.includes('&amp;&amp;')) {
      const inputToUse = input?.includes('&amp;&amp;')
        ? unescapeHtml(input)
        : input;
      const findItem = i18nJson?.find(
        (res: any) => res.jsonString === inputToUse
      );
      if (findItem) {
        const value = findItem[locale];
        if (value) return { text: value, loaded: true, loading: false };
        else {
          let value = '';
          i18nLocales.some((val) => {
            const string = findItem[val?.code];
            if (string) {
              value = string;
              return true;
            } else false;
          });
          if (value !== '')
            return { text: value, loaded: true, loading: false };
          else return { text: input, loaded: true, loading: false };
        }
      } else return { text: input, loaded: true, loading: false };
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
    i18nJson,
    locale,
    i18nLocales,
    datasource,
    strapiLocalization,
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
  if (input?.includes('&&')) {
    const findItem = i18nJson?.find((res: any) => res.jsonString === input);
    if (findItem) {
      const value = findItem[locale];
      if (value) return { text: value, loaded: true, loading: false };
      else {
        let value = '';
        i18nLocales.some((val) => {
          const string = findItem[val?.code];
          if (string) {
            value = string;
            return true;
          } else false;
        });
        if (value !== '') return { text: value, loaded: true, loading: false };
        else return { text: input, loaded: true, loading: false };
      }
    } else return { text: input, loaded: true, loading: false };
  }
  return { text: input, loaded: true, loading: false };
};
