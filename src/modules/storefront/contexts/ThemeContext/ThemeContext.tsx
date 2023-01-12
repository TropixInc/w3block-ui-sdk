import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from 'react-use';

import { useRouterConnect } from '../../../shared';
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

  const router = useRouterConnect();
  // o nome do arquivo que usa o componente StorefrontPreview precisa ser o mesmo que 'page'
  // no connect temos storefront/[...page].tsx
  // fazemos a requisição com o nome da página pra pegar os dados e estilos para exibir
  const pageQueries = router.query?.page;

  useEffect(() => {
    if (Array.isArray(pageQueries)) setPageName(pageQueries[0]);
  }, [pageQueries]);

  useEffectOnce(() => {
    // // requisição pra pegar valores default
    // const baseURL = "https://api.w3block.io";
    // const location = "primesea.io";
    // const url = `${baseURL}/storefrontTheme?site=${location}`;
    setDefaultTheme(sampleTemplate);
  });

  useEffect(() => {
    // if (!pageName) return;
    // // requisição pra pegar valores do user/página
    // const baseURL = "https://api.w3block.io";
    // const location = "primesea.io";
    // const url = `${baseURL}/storeFrontPage?site=${location}&path=${pageName}`;

    (sampleTemplateData.items[0] as any).brandText = pageName.includes('one')
      ? 'one'
      : 'two';
    const clone = { ...sampleTemplateData };

    setPageTheme(clone);
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
  page: {
    bgColor: 'white',
    overlayColor: 'white',
    textColor: 'black',
  },
  header: {
    bgColor: 'white',
    textColor: 'black',
  },
  footer: {
    bgColor: 'pink',
    textColor: 'red',
    menuHoverColor: 'rgba(20,10,255,1)',
    menuTextColor: 'rgba(10,10,255,1)',
    socialNetworkIconColor: 'blue',
    socialNetworkIconHoverColor: 'rgba(20,10,255,1)',
  },
  menu: {
    bgColor: 'rgba(255,127,127,0.5)',
    textColor: 'rgba(20,10,255,1)',
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

const bigDescription =
  'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet';
const smallDescription = 'Lorem ipsum dolor sit amet';

const smallName = 'Tênis Easy Style Feminino';
const bigName =
  'Tênis Easy Style Feminino Evoltenn Solado Trançado Feminino Evoltenn Solado Trançado';

const name = (i: number) => (i % 2 === 0 ? smallName : bigName);
const description = (i: number) =>
  i % 2 === 0 ? smallDescription : bigDescription;

const products = new Array(45).fill(0).map((_, i) => {
  return {
    id: String(i + 1),
    img: 'https://i.ibb.co/gr1Qkkc/product.png',
    category: 'calçados',
    description: description(i),
    name: name(i),
    hoverColor: 'white',
    price: '237,65',
  };
});

const sampleTemplateData: TemplateData = {
  title: 'Home page',
  items: [
    {
      type: 'page',
      bgColor: 'white',
      overlayColor: 'white',
      textColor: 'black',
      media: '',
    },
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
        {
          bgColor: '#0ea5e9',
          title: 'Nós empoderamos a arte com tecnologia!',
          titleColor: 'white',
          alignment: 'right',
          overlayColor: 'rgba(1, 1, 1, 0.5)',
          subtitle: 'Lorem ipsum dolor sit amet',
          subtitleColor: 'white',
          media: '',
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
    {
      type: 'footer',
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
    },
  ],
};
