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
    bgColor: 'white',
    textColor: 'black',
  },
  banner: {
    bgColor: 'rgba(255,127,127,0.5)',
    textColor: 'rgba(20,10,255,1)',
  },
  hero: {
    data: 'text',
  },
};

const sampleTemplateData: TemplateData = {
  title: 'Home page',
  items: [
    {
      type: 'header',
      props: {
        brandText: 'W3block Storefront Custom',
        bgColor: 'white',
        textColor: 'black',
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
      type: 'hero',
      props: {
        bgColor: '',
        brandText: '',
        categories: [],
        data: '',
        links: [],
        textColor: '',
      },
    },
  ],
};
