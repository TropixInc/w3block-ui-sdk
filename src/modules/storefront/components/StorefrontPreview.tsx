import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { useRouterConnect } from '../../shared';
import { ThemeContext, ThemeProvider } from '../contexts';
import { ModulesType, TemplateData, Theme } from '../interfaces';
import { Accordions } from './Accordions';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Footer } from './Footer';
import { Header } from './Header';
import { ImagePlusText } from './ImagePlusText';
import { Menu } from './Menu';
import { Paragraph } from './Paragraph';
import { ProductPage } from './ProductPage';
import { Products } from './Products';

interface StorefrontPreviewProps {
  params?: string[];
}

export const StorefrontPreview = ({ params }: StorefrontPreviewProps) => {
  return (
    <ThemeProvider>
      <Storefront params={params} />
    </ThemeProvider>
  );
};

const Storefront = ({ params }: StorefrontPreviewProps) => {
  const context = useContext(ThemeContext);
  const { asPath } = useRouterConnect();
  const [currentPage, setCurrentPage] = useState<TemplateData | null>(null);
  const [themeListener, setThemeListener] = useState<Theme | null>();
  const listener = ({
    data,
  }: MessageEvent<{ update: string; theme: Theme; page: TemplateData }>) => {
    if (data && data.theme) {
      setThemeListener(data.theme);
    }
    if (data && data.page) {
      setCurrentPage(data.page);
    }
    //setCurrentPage(data);
  };

  useEffectOnce(() => {
    addEventListener('message', listener);

    return () => removeEventListener('message', listener);
  });

  const data = { ...context?.pageTheme, ...currentPage };
  const themeContext = context?.defaultTheme;

  if (!themeContext) return null;
  const isProductPage =
    asPath.includes('/product/slug') && params?.[params?.length - 1] != 'slug';
  const theme = { ...context.defaultTheme, ...themeListener };
  console.log(data.modules);
  console.log(theme);
  return (
    <div
      style={{
        color: theme.configurations?.styleData.textColor ?? 'black',
        background: theme.configurations?.styleData.backgroundColor ?? 'white',
      }}
    >
      <Header
        data={
          theme.header ?? {
            id: '',
            name: 'header',
            type: ModulesType.HEADER,
            styleData: {},
          }
        }
      />
      <Cookies
        data={
          theme.cookies ?? {
            id: '',
            name: 'cookies',
            type: ModulesType.COOKIE,
            styleData: {},
            contentData: {},
          }
        }
      />
      {isProductPage && (
        <ProductPage
          params={params}
          data={
            theme.productPage ?? {
              id: '',
              name: 'productsPage',
              type: ModulesType.PRODUCT_PAGE,
              styleData: {},
            }
          }
        />
      )}
      <div className="pw-min-h-[calc(100vh-150px)]">
        {data.modules?.map((item) => {
          switch (item.type) {
            case ModulesType.CATEGORIES:
              return <Menu data={{ ...theme.categories, ...item }} />;
            case ModulesType.BANNER:
              return <Banner data={{ ...theme.banner, ...item }} />;
            case ModulesType.CARDS:
              return <Products data={{ ...theme.products, ...item }} />;
            case ModulesType.ACCORDIONS:
              return <Accordions data={{ ...theme.accordions, ...item }} />;
            case ModulesType.IMAGE_PLUS_TEXT:
              return (
                <ImagePlusText data={{ ...theme.imagePlusText, ...item }} />
              );
            case ModulesType.PARAGRAPH:
              return <Paragraph data={{ ...theme.paragraph, ...item }} />;
            default:
              break;
          }
        })}
      </div>
      <Footer
        data={
          theme.footer ?? {
            id: '',
            name: 'footer',
            type: ModulesType.FOOTER,
            styleData: {},
            contentData: {},
          }
        }
      />
    </div>
  );
};
