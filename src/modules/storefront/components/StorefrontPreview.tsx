import { ReactNode, useContext, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { useRouterConnect } from '../../shared';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { ThemeContext, ThemeProvider } from '../contexts';
import {
  MainModuleThemeInterface,
  ModulesType,
  TemplateData,
  Theme,
} from '../interfaces';
import { Page404 } from './404';
import { Accordions } from './Accordions';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Footer } from './Footer';
import { GridItemArea } from './GridItemArea';
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
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export const StorefrontPreview = ({
  params,
  children,
  hasFooter = true,
  hasHeader = true,
}: StorefrontPreviewProps) => {
  return (
    <ThemeProvider>
      <Storefront hasFooter={hasFooter} hasHeader={hasHeader} params={params}>
        {children}
      </Storefront>
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
      context?.setDefaultTheme?.(data.theme);
    }
    if (data && data.page) {
      setCurrentPage(data.page);
      context?.setPageTheme?.(data.page);
    }
  };

  useEffect(() => {
    if (context?.isThemeError && !children) {
      pushConnect(PixwayAppRoutes.SIGN_IN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.isThemeError, children]);

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

  const breakpoint = useBreakpoints();
  const mobileBreakpoints = [breakpointsEnum.SM, breakpointsEnum.XS];

  if (!themeContext) return null;
  const isProductPage =
    (asPath || '').includes('/product/slug') &&
    params?.[params?.length - 1] != 'slug';
  const theme = { ...context?.defaultTheme, ...themeListener };

  const configStyleData = theme.configurations?.styleData;
  const configMobileStyleData = theme.configurations?.mobileStyleData;

  const mergedConfigStyleData = mobileBreakpoints.includes(breakpoint)
    ? { ...configStyleData, ...configMobileStyleData }
    : configStyleData;

  const fontName = mergedConfigStyleData?.fontFamily ?? 'Roboto';
  const fontFamily = fontName
    ? `"${fontName}", ${fontName === 'Aref Ruqaa' ? 'serif' : 'sans-serif'}`
    : 'sans-serif';

  const headerStyleData = theme.header?.styleData;
  const headerMobileStyleData = theme.header?.mobileStyleData;

  const mergedHeaderStyleData = mobileBreakpoints.includes(breakpoint)
    ? { ...headerStyleData, ...headerMobileStyleData }
    : headerStyleData;

  const headerData = context.defaultTheme?.header
    ? {
        ...theme.header,
        styleData: { ...mergedHeaderStyleData, fontFamily },
      }
    : {
        id: '',
        name: 'header',
        type: ModulesType.HEADER,
        styleData: {},
      };

  const hasHeaderDefault =
    mergedConfigStyleData?.hasHeader != undefined &&
    (asPath || '').includes('/auth/')
      ? mergedConfigStyleData.hasHeader
      : true;
  const hasFooterDefault =
    mergedConfigStyleData.hasFooter != undefined &&
    (asPath || '').includes('/auth/')
      ? mergedConfigStyleData.hasFooter
      : true;
  return (
    <div
      style={{
        color: mergedConfigStyleData.textColor ?? 'black',
        background: mergedConfigStyleData.backgroundColor ?? 'white',
        padding: convertSpacingToCSS(mergedConfigStyleData.padding),
        fontFamily,
      }}
    >
      {hasHeaderDefault && headerData ? (
        <Header data={headerData as MainModuleThemeInterface} />
      ) : null}

      <Cookies
        data={
          theme.cookies ?? {
            id: '',
            name: 'cookies',
            type: ModulesType.COOKIE,
            styleData: {},
            contentData: {},
            mobileStyleData: {},
            mobileContentData: {},
          }
        }
      />
      {context?.isError && !children ? (
        <Page404 />
      ) : (
        <>
          {isProductPage && (
            <ProductPage
              hasCart={mergedConfigStyleData.hasCart}
              params={params}
              data={
                theme.productPage ?? {
                  id: '',
                  name: 'productsPage',
                  type: ModulesType.PRODUCT_PAGE,
                  styleData: {},
                  mobileStyleData: {},
                }
              }
            />
          )}
          {children ? (
            children
          ) : (
            <div
              className={!isProductPage ? 'pw-min-h-[calc(100vh-150px)]' : ''}
            >
              {data.modules?.map((item) => {
                if (item.deviceType == 'none') return null;

                if (
                  item.deviceType == 'desktop' &&
                  mobileBreakpoints.includes(breakpoint)
                )
                  return null;
                if (
                  item.deviceType == 'mobile' &&
                  !mobileBreakpoints.includes(breakpoint)
                )
                  return null;

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
                  case ModulesType.GRID_ITEM_AREA:
                    return (
                      <GridItemArea data={{ ...theme.GridItemArea, ...item }} />
                    );
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
      {hasFooterDefault && (
        <Footer
          data={
            theme.footer ?? {
              id: '',
              name: 'footer',
              type: ModulesType.FOOTER,
              styleData: {},
              contentData: {},
              mobileStyleData: {},
              mobileContentData: {},
            }
          }
        />
      )}
    </div>
  );
};
