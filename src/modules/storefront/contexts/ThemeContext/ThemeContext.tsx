import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from 'react-use';

import { FooterData, Template, TemplateData } from '../../interfaces';

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
  footer: {
    bgColor: 'pink',
    textColor: 'red',
    menuHoverColor: 'rgba(20,10,255,1)',
    menuTextColor: 'rgba(10,10,255,1)',
    socialNetworkIconColor: 'blue',
    socialNetworkIconHoverColor: 'rgba(20,10,255,1)',
  },
};

const sampleTemplateData: TemplateData = {
  title: 'Home page',
  items: [
    {
      type: 'footer',
      props: {
        bgColor: '#0050FF',
        textColor: '#FFF',
        description:
          'O Clube não se trata de oferta de valores mobiliários ou investimento coletivo. A presente oferta de compra não se trata de recomendação de investimento e não foi concebida para prover lucro nem qualquer tipo de retorno financeiro e sim, tão e somente, o acesso ao clube de vantagens do XPTO.',
        menuTextColor: '#FFF',
        menuHoverColor: '#333',
        menuLinks: [
          {
            label: 'Política de privacidade',
            type: 'external',
            value: 'privacy',
          },
          {
            label: 'Termos e condições',
            type: 'internal',
            value: 'terms_conditions',
          },
          {
            label: 'FAQ',
            type: 'external',
            value: 'FAQ',
          },
          {
            label: 'Fale conosco',
            type: 'external',
            value: 'contact',
          },
        ],
        socialNetworkIconColor: '#000',
        socialNetworkIconHoverColor: '#333',
        socialNetworks: [
          {
            url: 'https://twitter.com/',
            type: 'twitter',
          },
          {
            url: 'https://web.telegram.org/',
            type: 'telegram',
          },
          {
            url: 'https://discord.com/',
            type: 'discord',
          },
          {
            url: 'https://www.instagram.com/',
            type: 'instagram',
          },
          {
            url: 'https://www.facebook.com/',
            type: 'facebook',
          },
          {
            url: 'https://www.linkedin.com/',
            type: 'linkedin',
          },
          {
            url: 'https://www.whatsapp.com/',
            type: 'whatsapp',
          },
          {
            url: 'https://example.com/',
            type: 'website',
          },
        ],
      } satisfies FooterData,
    },
  ],
};
