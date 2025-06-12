interface Localization {
    [key: string]: any;
  }
  
  interface LocalizationData {
    data: Array<{ id: number; attributes: Localization }>;
  }
  
  interface InputItem {
    id: number;
    attributes: {
      [key: string]: any;
      locale: string;
      localizations: LocalizationData;
    };
  }
  
  export function processLocalizations(items: any[]): InputItem[] {
    return items.map((item) => {
      const { attributes } = item;
      const { localizations, locale: parentLocale, ...rest } = attributes;
      const splittedLocale = parentLocale.split('-')?.[0];
  
      const mergedLocalizations: { [locale: string]: Localization } = {
        [splittedLocale]: rest,
      };
  
      localizations?.data?.forEach(
        (localization: { attributes: Localization }) => {
          const locale = localization?.attributes?.locale.split('-')?.[0];
          mergedLocalizations[locale] = { ...rest, ...localization?.attributes };
        }
      );
  
      return {
        ...item,
        attributes: {
          ...attributes,
          localizations: mergedLocalizations,
        },
      };
    });
  }
  