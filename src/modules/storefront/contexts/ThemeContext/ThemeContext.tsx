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
  menu: {
    menuBgColor: 'rgba(255,127,127,0.5)',
    menuTextColor: 'rgba(20,10,255,1)',
  },
  banner: {
    ratio: '16:9',
    layout: 'full_width',
    slides: {
      bgColor: 'rgba(255, 133, 22, 1)',
      titleColor: 'rgba(111, 222, 1, 1)',
      alignment: 'left',
      overlayColor: 'white',
      subtitleColor: 'black',
      button: {
        hrefType: 'internal',
        bgColor: 'blue',
        textColor: 'black',
      },
    },
    autoSlide: false,
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
      type: 'menu',
      props: {
        bgColor: '#0050FF',
        textColor: 'white',
        categories: [
          {
            label: 'Vestuário',
            slug: 'a',
          },
          {
            label: 'Sapatos',
            slug: 's',
          },
          {
            label: 'Sacolas',
            slug: 'd',
          },
          {
            label: 'Vestuário',
            slug: 'f',
          },
          {
            label: 'Sapatos',
            slug: 'g',
          },
          {
            label: 'Sacolas',
            slug: 'h',
          },
          {
            label: 'Vestuário',
            slug: 'j',
          },
          {
            label: 'Sapatos',
            slug: 'k',
          },
          {
            label: 'Sacolas',
            slug: 'l',
          },
          {
            label: 'informática e acessórios',
            slug: 'e',
          },
          {
            label: 'Sapatos',
            slug: 'q',
          },
          {
            label: 'Sacolas',
            slug: 'w',
          },
          {
            label: 'Vestuário',
            slug: 'r',
          },
          {
            label: 'Sapatos',
            slug: 't',
          },
          {
            label: 'Sacolas',
            slug: 'y',
          },
          {
            label: 'utilidades domésticas',
            slug: 'u',
          },
          {
            label: 'Sapatos',
            slug: 'i',
          },
          {
            label: 'Sacolas',
            slug: 'o',
          },
          {
            label: 'utilidades domésticas',
            slug: 'p',
          },
          {
            label: 'Sapatos',
            slug: 'z',
          },
          {
            label: 'Sacolas',
            slug: 'x',
          },
          {
            label: 'informática e acessórios',
            slug: 'c',
          },
          {
            label: 'Sapatos',
            slug: 'v',
          },
          {
            label: 'utilidades domésticas',
            slug: 'b',
          },
          {
            label: 'Vestuário',
            slug: 'n',
          },
          {
            label: 'Sapatos',
            slug: 'm',
          },
          {
            label: 'informática e acessórios',
            slug: '1',
          },
        ],
      },
    },
    {
      type: 'banner',
      props: {
        layout: 'fixed',
        ratio: '20:9',
        slides: [
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'right',
            overlayColor: 'rgba(1, 1, 1, 0.5)',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            // media: 'https://i.ibb.co/527J0CW/bg.png',
            media:
              'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: '',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            // media: 'https://i.ibb.co/527J0CW/bg.png',
            media:
              'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
        ],
      },
    },
    {
      type: 'banner',
      props: {
        layout: 'fixed',
        ratio: '16:9',
        slides: [
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'center',
            overlayColor: 'rgba(1, 1, 1, 1)',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            // media: 'https://i.ibb.co/527J0CW/bg.png',
            media:
              'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              hrefType: 'internal',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media: 'https://i.ibb.co/527J0CW/bg.png',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
        ],
      },
    },
    {
      type: 'banner',
      props: {
        layout: 'full_width',
        ratio: '4:1',
        slides: [
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            // media: 'https://i.ibb.co/527J0CW/bg.png',
            media:
              'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media: 'https://i.ibb.co/527J0CW/bg.png',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
        ],
      },
    },
    {
      type: 'banner',
      props: {
        layout: 'fixed',
        ratio: '3:1',
        slides: [
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media: '',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              hrefType: 'internal',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media: 'https://i.ibb.co/527J0CW/bg.png',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              hrefType: 'external',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
        ],
      },
    },
    {
      type: 'banner',
      props: {
        layout: 'full_width',
        ratio: 'default',
        slides: [
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media:
              'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
          {
            bgColor: '#0ea5e9',
            title: 'Nós empoderamos a arte com tecnologia',
            titleColor: 'white',
            alignment: 'left',
            overlayColor: 'white',
            subtitle: 'Lorem ipsum dolor sit amet',
            subtitleColor: 'white',
            media: 'https://i.ibb.co/527J0CW/bg.png',
            button: {
              bgColor: 'white',
              href: 'https://example.com',
              text: 'Clique aqui',
              textColor: '#353945',
            },
          },
        ],
      },
    },
  ],
  // .filter(s => s.props?.ratio === '16:9'),
};
