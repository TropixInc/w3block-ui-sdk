import { I18NLocaleEnum } from '@w3block/sdk-id';

/**
 * Locale implied by the browser language, safe to call during server
 * rendering. A bare `if (window)` throws ReferenceError on the server (the
 * identifier does not exist there), which made Next drop the whole server
 * HTML of the sign-up and complete-profile pages and render them on the
 * client ("Switched to client rendering because the server rendering
 * errored"). Without a browser we return pt-BR, the SDK default.
 */
export const detectBrowserLocale = (
  navigatorLanguage: string | undefined = typeof navigator !== 'undefined'
    ? navigator.language
    : undefined
): I18NLocaleEnum =>
  navigatorLanguage === undefined || navigatorLanguage === 'pt-BR'
    ? I18NLocaleEnum.PtBr
    : I18NLocaleEnum.En;
