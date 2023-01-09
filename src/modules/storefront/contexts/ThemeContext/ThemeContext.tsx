import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from 'react-use';

import { TemplateDefault, TemplateData } from '../../interfaces';

export const ThemeContext = createContext<IThemeContext | null>(null);
interface IThemeContext {
  defaultTheme: TemplateDefault | null;
  pageTheme: TemplateData | null;
  setPageName: Dispatch<SetStateAction<string>>;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [defaultTheme, setDefaultTheme] = useState<TemplateDefault | null>(
    null
  );
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

const sampleTemplate: TemplateDefault = {
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
    slideStyle: {
      alignment: 'center',
      bgColor: 'white',
      buttonBgColor: 'blue',
      buttonHrefType: 'external',
      buttonTextColor: 'white',
      overlayColor: 'white',
      subtitleColor: 'black',
      titleColor: 'black',
    },
    autoSlide: false,
  },
  products: {
    layoutProducts: 'carousel',
    autoSlide: false,
    itemsPerLine: 4,
    numberOfLines: 4,
    filterTag: 'best_seller',
    cardHoverColor: 'white',
    buttonBgColor: 'blue',
    buttonHoverColor: 'white',
    buttonText: '',
    buttonTextColor: 'white',
    cardUrl: '',
    showCardButton: true,
    showCardCategory: true,
    showCardDescription: true,
    showCardName: true,
    showCardPrice: true,
    listOrdering: 'name',
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
          media:
            'https://imobiliario.cshg.com.br/wp-content/uploads/sites/327/2020/06/Centro-Empresarial-Seneca.mp4',
          buttonBgColor: 'white',
          buttonHref: 'https://example.com',
          buttonText: 'Clique aqui',
          buttonTextColor: '#353945',
        },
      ],
    },
    {
      type: 'products',
      title: 'Mais vendidos',
      filterTag: 'best_seller',
      layoutProducts: 'carousel',
      autoSlide: false,
      itemsPerLine: 3,
      numberOfLines: 3,
      listOrdering: 'name',
      showCardCategory: true,
      showCardDescription: true,
      showCardName: true,
      showCardPrice: true,
      cardHoverColor: '#d4d7dc',
      cardUrl: '',
      showCardButton: true,
      buttonText: 'Comprar',
      buttonBgColor: '#295BA6',
      buttonHoverColor: '#64748B',
      buttonTextColor: '#ffffff',
      products,
    },
    {
      type: 'cookies',
      cookiesBgColor: '#DDE6F3',
      cookiesTextColor: '#000',
      cookiesButtonBgColor: '#0050FF',
      cookiesButtonTextColor: '#FFF',
      privacyPolicyLinkColor: '#0050FF',
      privacyPolicyLink: 'https://example.com',
      disclaimer:
        'Nós utilizamos cookies e outras tecnologias semelhantes para coletar dados durante a navegação para melhorar a sua experiência em nossos serviços. Saiba mais em nossa',
    },
  ],
};
