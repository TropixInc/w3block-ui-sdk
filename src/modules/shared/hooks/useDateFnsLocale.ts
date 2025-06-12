import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import useTranslation from './useTranslation';


const useDateFnsLocale = () => {
  const [_, locale] = useTranslation();
  return locale.language === 'pt-BR' ? ptBR : enUS;
};

export default useDateFnsLocale;
