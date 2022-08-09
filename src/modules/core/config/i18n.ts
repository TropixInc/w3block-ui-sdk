import { initReactI18next } from 'react-i18next';

import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ENDictionary from '../../../../public/locales/en/common.json';
import PTBRDictionary from '../../../../public/locales/pt-BR/common.json';

const i18n = createInstance({
  fallbackLng: 'pt-BR',
  resources: {
    en: {
      translation: ENDictionary,
    },
    'pt-BR': {
      translation: PTBRDictionary,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

i18n.use(initReactI18next).use(LanguageDetector).init();

export default i18n;
