import { ReactNode, useContext, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { useRouterConnect } from '../../shared';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { ThemeContext, ThemeProvider } from '../contexts';
import { ModulesType, TemplateData, Theme } from '../interfaces';
import { Page404 } from './404';
import { Accordions } from './Accordions';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Footer } from './Footer';
import { Header } from './Header';
import { ImagePlusText } from './ImagePlusText';
import { Menu } from './Menu';
import { Midia } from './Midia';
import { Paragraph } from './Paragraph';
import { ProductPage } from './ProductPage';
import { Products } from './Products';

interface StorefrontPreviewProps {
  params?: string[];
  children?: ReactNode;
}

export const StorefrontPreview = ({
  params,
  children,
}: StorefrontPreviewProps) => {
  return (
    <ThemeProvider>
      <Storefront params={params}>{children}</Storefront>
    </ThemeProvider>
  );
};

const Storefront = ({ params, children }: StorefrontPreviewProps) => {
  const context = useContext(ThemeContext);
  const { asPath, pushConnect } = useRouterConnect();
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

  useEffect(() => {
    if (context?.isThemeError) {
      pushConnect(PixwayAppRoutes.SIGN_IN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.isThemeError]);

  useEffectOnce(() => {
    addEventListener('message', listener);

    return () => removeEventListener('message', listener);
  });

  const preventOutsideLinkClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      e.preventDefault();
    }
  };

  useEffectOnce(() => {
    const insideIframe = window.self !== window.top;
    if (insideIframe) {
      addEventListener('click', preventOutsideLinkClick);

      return () => removeEventListener('click', preventOutsideLinkClick);
    }
  });

  const data = { ...context?.pageTheme, ...currentPage };
  const themeContext = context?.defaultTheme;

  if (!themeContext) return null;
  const isProductPage =
    (asPath || '').includes('/product/slug') &&
    params?.[params?.length - 1] != 'slug';
  const theme = { ...context.defaultTheme, ...themeListener };
  const fontName = theme.configurations?.styleData.fontFamily;
  const fontFamily = fontName
    ? `"${fontName}", ${fontName === 'Aref Ruqaa' ? 'serif' : 'sans-serif'}`
    : 'sans-serif';

  const headerData = theme.header
    ? {
        ...theme.header,
        styleData: { ...theme.header.styleData, fontFamily },
      }
    : {
        id: '',
        name: 'header',
        type: ModulesType.HEADER,
        styleData: {},
      };
  return (
    <div
      style={{
        color: theme.configurations?.styleData.textColor ?? 'black',
        background: theme.configurations?.styleData.backgroundColor ?? 'white',
        padding: convertSpacingToCSS(theme.configurations?.styleData.padding),
        fontFamily,
      }}
    >
      <Header data={headerData} />

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
      {context.isError ? (
        <Page404 />
      ) : (
        <>
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
          {children ? (
            children
          ) : (
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
                    return (
                      <Accordions data={{ ...theme.accordions, ...item }} />
                    );
                  case ModulesType.IMAGE_PLUS_TEXT:
                    return (
                      <ImagePlusText
                        data={{ ...theme.imagePlusText, ...item }}
                      />
                    );
                  case ModulesType.PARAGRAPH:
                    return <Paragraph data={{ ...theme.paragraph, ...item }} />;
                  case ModulesType.MIDIA:
                    return <Midia data={{ ...theme.midia, ...item }} />;
                  default:
                    break;
                }
              })}
            </div>
          )}
        </>
      )}

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
