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
    bgColor: 'white',
    textColor: 'black',
  },
  footer: {
    footerBgColor: 'pink',
    footerTextColor: 'red',
    menuHoverColor: 'rgba(20,10,255,1)',
    menuTextColor: 'rgba(10,10,255,1)',
    socialNetworkIconColor: 'blue',
    socialNetworkIconHoverColor: 'rgba(20,10,255,1)',
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
      type: 'footer',
      props: {
        bgColor: '#0050FF',
        textColor: '#FFF',
        description:
          'O Clube não se trata de oferta de valores mobiliários ou investimento coletivo. A presente oferta de compra não se trata de recomendação de investimento e não foi concebida para prover lucro nem qualquer tipo de retorno financeiro e sim, tão e somente, o acesso ao clube de vantagens do XPTO.',
        menuTextColor: '#FFF',
        menuHoverColor: 'red',
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
        socialNetworkIconHoverColor: 'red',
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
