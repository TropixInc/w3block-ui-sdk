import { ptBR, enUS } from 'date-fns/locale';

import useTranslation from '../useTranslation';

const useDateFnsLocale = () => {
  const [_, locale] = useTranslation();
  return locale.language === 'pt-BR' ? ptBR : enUS;
};

export default useDateFnsLocale;
