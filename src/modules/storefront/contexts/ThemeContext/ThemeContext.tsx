import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from 'react-use';

import { Template, TemplateData } from '../../interfaces';

export const ThemeContext = createContext<IThemeContext | null>(null);
interface IThemeContext {
  defaultTheme: Template | null;
  pageTheme: TemplateData | null;
  setPageName: Dispatch<SetStateAction<string>>;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [defaultTheme, setDefaultTheme] = useState<Template | null>(null);
  const [pageTheme, setPageTheme] = useState<TemplateData | null>(null);
  const [pageName, setPageName] = useState('');

  useEffectOnce(() => {
    //requisição pra pegar valores default
    // const baseURL = "https://api.w3block.io";
    // const location = "primesea.io";
    // const url = `${baseURL}/storefrontTheme?site=${location}`;
    setDefaultTheme(sampleTemplate);
  });

  useEffect(() => {
    // requisição pra pegar valores do user/página
    // const baseURL = "https://api.w3block.io";
    // const location = "primesea.io";
    // const url = `${baseURL}/storeFrontPage?site=${location}&path=${pageName}`;

    setPageTheme(sampleTemplateData);
  }, [pageName]);

  return (
    <ThemeContext.Provider
      value={{
        defaultTheme,
        pageTheme,
        setPageName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const sampleTemplate: Template = {
  header: {
    bgColor: 'rgba(255,127,127,0.5)',
    textColor: 'rgba(20,10,255,1)',
  },
  banner: {
    bgColor: 'rgba(255,127,127,0.5)',
    textColor: 'rgba(20,10,255,1)',
  },
  hero: {
    data: 'text',
  },
  footer: {
    bgColor: 'rgba(255,127,127,0.5)',
    textColor: 'rgba(20,10,255,1)',
  },
};

const sampleTemplateData: TemplateData = {
  title: 'Home page',
  items: [
    {
      type: 'header',
      props: {
        brandText: 'W3block Storefront Custom',
        bgColor: 'rgba(255,127,127,0.5)',
        textColor: 'rgba(20,10,255,1)',
        links: [
          {
            label: 'Sobre',
            type: 'internal',
            value: 'about',
            newWindow: false,
          },
          {
            label: 'Nossos parceiros',
            type: 'external',
            value: 'https://www.nossosparceiros.com.br',
            newWindow: true,
          },
        ],
      },
    },
    {
      type: 'footer',
      props: {
        bgColor: 'rgba(20,10,255,1)',
        textColor: '#fff',
        description:
          'O Clube não se trata de oferta de valores mobiliários ou investimento coletivo. A presente oferta de compra não se trata de recomendação de investimento e não foi concebida para prover lucro nem qualquer tipo de retorno financeiro e sim, tão e somente, o acesso ao clube de vantagens do XPTO.',
        links: [
          {
            label: 'Política de privacidade',
            type: 'external',
            value: 'privacy',
            newWindow: true,
          },
          {
            label: 'Termos e condições',
            type: 'internal',
            value: 'terms_conditions',
            newWindow: false,
          },
          {
            label: 'FAQ',
            type: 'external',
            value: 'FAQ',
            newWindow: true,
          },
          {
            label: 'Fale conosco',
            type: 'external',
            value: 'contact',
            newWindow: true,
          },
        ],
        defaultSocialNetworks: [
          {
            id: 'facebook',
            url: '',
            type: 'facebook',
          },
          {
            id: 'twitter',
            url: '',
            type: 'twitter',
          },
          {
            id: 'whatsapp',
            url: '',
            type: 'whatsapp',
          },
          {
            id: 'linkedin',
            url: '',
            type: 'linkedin',
          },
          {
            id: 'link',
            url: '',
            type: 'url',
          },
        ],
      },
    },
  ],
};
