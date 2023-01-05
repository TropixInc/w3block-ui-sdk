import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from 'react-use';

import { ProductsData, Template, TemplateData } from '../../interfaces';

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
  categories: {
    bgColor: '',
    textColor: '',
  },
  products: {
    layout: 'carousel',
    autoSlide: false,
    itemsPerLine: 4,
    numberOfLines: 4,
    filterTag: 'best_seller',
    card: {
      category: true,
      description: true,
      name: true,
      price: true,
      hoverColor: 'white',
      button: true,
      url: '',
    },
    listOrdering: 'name',
    button: {
      bgColor: 'black',
      hoverColor: 'white',
      textColor: 'red',
    },
  },
  cookies: {
    cookiesBgColor: 'rgba(100, 133, 22, 1)',
    cookiesButtonBgColor: 'rgba(9, 133, 22, 1)',
    cookiesButtonTextColor: 'rgba(255, 34, 22, 1)',
    cookiesTextColor: 'rgba(255, 133, 220, 1)',
    privacyPolicyLinkColor: 'rgba(255, 133, 225, 1)',
  },
};

const products = new Array(45).fill(0).map((_, i) => {
  return {
    id: String(i + 1),
    img: 'https://i.ibb.co/gr1Qkkc/product.png',
    category: 'calçados',
    description: 'Lorem ipsum dolor sit amet',
    name: 'Tênis Easy Style Feminino Evoltenn Solado Trançado',
    hoverColor: 'white',
    price: '237,65',
  };
});

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
    {
      type: 'products',
      props: {
        title: 'Mais vendidos',
        filterTag: 'best_seller',
        layout: 'carousel',
        autoSlide: false,
        itemsPerLine: 3,
        numberOfLines: 3,
        listOrdering: 'name',
        card: {
          category: true,
          description: false,
          name: true,
          price: true,
          hoverColor: '#d4d7dc', //d4d7dc
          button: true,
          url: '',
        },
        button: {
          text: 'Comprar',
          bgColor: '#295BA6',
          hoverColor: '#64748B', //64748B
          textColor: '#ffffff',
        },
        products,
      } as ProductsData,
    },
    {
      type: 'cookies',
      props: {
        cookiesBgColor: '#DDE6F3',
        cookiesTextColor: '#000',
        cookiesButtonBgColor: '#0050FF',
        cookiesButtonTextColor: '#FFF',
        privacyPolicyLinkColor: '#0050FF',
        privacyPolicyLink: 'https://example.com',
        disclaimer:
          'Nós utilizamos cookies e outras tecnologias semelhantes para coletar dados durante a navegação para melhorar a sua experiência em nossos serviços. Saiba mais em nossa',
      },
    },
  ],
  // .filter(s => s.type === 'products'),
  // .filter(s => s.props?.ratio === '16:9'),
};
