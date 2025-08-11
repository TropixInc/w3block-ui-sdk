import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

export type PixwayUISdkLocale = 'pt-BR' | 'en';

export const LocaleContext = createSymlinkSafeContext<PixwayUISdkLocale>(
  '__LOCALE_CONTEXT__',
  'pt-BR'
);
