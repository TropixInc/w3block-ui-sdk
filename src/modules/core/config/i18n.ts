import { initReactI18next } from 'react-i18next';

import { createInstance } from 'i18next';

import ENDictionary from '../../../../public/locales/en/common.json';
import PTBRDictionary from '../../../../public/locales/pt-BR/common.json';

const i18n = createInstance({
  fallbackLng: 'en',
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

i18n.use(initReactI18next).init();

export default i18n;
