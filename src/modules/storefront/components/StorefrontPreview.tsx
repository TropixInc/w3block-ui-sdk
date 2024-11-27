import {
  ReactNode,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from 'react';
import { useEffectOnce } from 'react-use';

import classNames from 'classnames';

import { getPageMap } from '../../custom/utils/customMap';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect/useRouterConnect';
import { useUserWallet } from '../../shared/hooks/useUserWallet';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  DynamicApiModuleInterface,
  MainModuleThemeInterface,
  ModulesType,
  TemplateData,
  Theme,
} from '../interfaces';
import { DynamicApiProvider } from '../provider/DynamicApiProvider';
import { PassBenefit } from './PassBenefit';

const Page404 = lazy(() =>
  import('./404').then((m) => ({ default: m.Page404 }))
);

const Header = lazy(() =>
  import('./Header').then((m) => ({ default: m.Header }))
);
const Footer = lazy(() =>
  import('./Footer').then((m) => ({ default: m.Footer }))
);
const GenericTableWrapper = lazy(() =>
  import('./GenericTableWrapper').then((m) => ({
    default: m.GenericTableWrapper,
  }))
);
const Banner = lazy(() =>
  import('./Banner').then((m) => ({ default: m.Banner }))
);
const BannerVariant = lazy(() =>
  import('./BannerVariant').then((m) => ({ default: m.Banner }))
);
const BannerWJJC = lazy(() =>
  import('./BannerWJJC').then((m) => ({ default: m.BannerWJJC }))
);
const Cookies = lazy(() =>
  import('./Cookies').then((m) => ({ default: m.Cookies }))
);
const Accordions = lazy(() =>
  import('./Accordions').then((m) => ({ default: m.Accordions }))
);
const GridItemArea = lazy(() =>
  import('./GridItemArea').then((m) => ({ default: m.GridItemArea }))
);
const ImagePlusText = lazy(() =>
  import('./ImagePlusText').then((m) => ({ default: m.ImagePlusText }))
);
const Menu = lazy(() => import('./Menu').then((m) => ({ default: m.Menu })));
const Midia = lazy(() => import('./Midia').then((m) => ({ default: m.Midia })));
const Paragraph = lazy(() =>
  import('./Paragraph').then((m) => ({ default: m.Paragraph }))
);
const ProductPage = lazy(() =>
  import('./ProductPage').then((m) => ({ default: m.ProductPage }))
);
const Products = lazy(() =>
  import('./Products').then((m) => ({ default: m.Products }))
);

interface StorefrontPreviewProps {
  params?: string[];
  children?: ReactNode;
  hasHeader?: boolean;
  hasFooter?: boolean;
  upperTheme?: Theme | null;
  upperPage?: TemplateData | null;
}

// export const StorefrontPreview = ({
//   params,
//   children,
//   hasFooter = true,
//   hasHeader = true,
//   upperTheme,
//   upperPage,
// }: StorefrontPreviewProps) => {
//   return <Storefront params={params}>{children}</Storefront>;
// };

export const StorefrontPreview = ({
  params,
  children,
}: StorefrontPreviewProps) => {
  const context = useContext(ThemeContext);
  const locale = useLocale();
  const { setMainCoin } = useUserWallet();
  const { asPath, pushConnect } = useRouterConnect();
  const [currentPage, setCurrentPage] = useState<TemplateData | null>(null);
  const [themeListener, setThemeListener] = useState<Theme | null>();
  const [currentHighlight, setCurrentHighlight] = useState('');
  const listener = ({
    data,
  }: MessageEvent<{
    update: string;
    theme: Theme;
    page: TemplateData;
    highlight?: string;
  }>) => {
    if (data && data.theme) {
      setThemeListener(data.theme);
      context?.setDefaultTheme?.(data.theme);
    }
    if (data && data.page) {
      setCurrentPage(data.page);
      context?.setPageTheme?.(data.page);
    }
    if (data?.highlight !== undefined) {
      setCurrentHighlight(data?.highlight);
    }
  };
  useEffect(() => {
    if (!currentHighlight) return;
    document.getElementById(currentHighlight)?.classList?.add('highlighted');
    return () => {
      if (!currentHighlight) return;
      document
        .getElementById(currentHighlight)
        ?.classList?.remove('highlighted');
    };
  }, [currentHighlight]);

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

  useEffect(() => {
    const theme = { ...context?.defaultTheme, ...themeListener };

    const configStyleData = theme.configurations?.styleData;
    const configMobileStyleData = theme.configurations?.mobileStyleData;

    const mergedConfigStyleData = mobileBreakpoints.includes(breakpoint)
      ? { ...configStyleData, ...configMobileStyleData }
      : configStyleData;

    if (
      mergedConfigStyleData?.mainCoin &&
      mergedConfigStyleData?.mainCoin != ''
    ) {
      setMainCoin?.(mergedConfigStyleData.mainCoin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.defaultTheme, themeListener]);

  let data = { ...context?.pageTheme, ...currentPage };

  const themeContext = context?.defaultTheme;

  const dynamicApi = useMemo<DynamicApiModuleInterface | undefined>(() => {
    if (context?.pageInfo && context.pageInfo.isRoutePatternRegex) {
      return {
        regexp: context.pageInfo.routePatternRegex,
        groups: RegExp(context.pageInfo.routePatternRegex, 'g').exec(
          asPath || ''
        )?.groups,
        matches: RegExp(context.pageInfo.routePatternRegex, 'g')
          .exec(asPath || '')
          ?.slice(1),
        apis: data.dynamicApi?.apis ?? [],
      };
    } else if (data.dynamicApi?.apis) {
      return {
        regexp: '',
        matches: [],
        apis: data.dynamicApi?.apis ?? [],
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.pageInfo, data]);

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

  const headerData = context?.defaultTheme?.header
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
      ? mergedConfigStyleData?.hasHeader
      : true;

  const hasFooterDefault =
    mergedConfigStyleData?.hasFooter != undefined &&
    (asPath || '').includes('/auth/')
      ? mergedConfigStyleData?.hasFooter
      : true;
  data = {
    ...data,
    dynamicApi,
  };

  console.log(theme, 'theme');

  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-slate-50" />
      }
    >
      <DynamicApiProvider dynamicModule={data.dynamicApi}>
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
              ) : data.custom && data.custom != '' ? (
                getPageMap(data.custom)
              ) : (
                <div
                  className={classNames(
                    `${!isProductPage ? 'pw-min-h-[calc(100vh-150px)]' : ''}`
                  )}
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
                    if (
                      item.languageType &&
                      locale !== item.languageType &&
                      item.languageType !== 'all'
                    )
                      return null;

                    switch (item.type) {
                      case ModulesType.CATEGORIES:
                        return <Menu data={{ ...theme.categories, ...item }} />;
                      case ModulesType.BANNER:
                        return <Banner data={{ ...theme.banner, ...item }} />;
                      case ModulesType.CARDS:
                        return (
                          <Products data={{ ...theme.products, ...item }} />
                        );
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
                        return (
                          <Paragraph data={{ ...theme.paragraph, ...item }} />
                        );
                      case ModulesType.GRID_ITEM_AREA:
                        return (
                          <GridItemArea
                            data={{ ...theme.GridItemArea, ...item }}
                          />
                        );
                      case ModulesType.PASS_BENEFIT:
                        return (
                          <PassBenefit
                            data={{ ...theme.passBenefit, ...item }}
                          />
                        );
                      case ModulesType.MIDIA:
                        return <Midia data={{ ...theme.midia, ...item }} />;
                      case ModulesType.TABLE:
                        return <GenericTableWrapper data={{ ...item }} />;
                      case ModulesType.BANNER_VARIANT:
                        return (
                          <BannerVariant
                            data={{ ...theme.bannerVariant, ...item }}
                          />
                        );
                      case ModulesType.BANNER_WJJC:
                        return (
                          <BannerWJJC data={{ ...theme.bannerWjjc, ...item }} />
                        );

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
      </DynamicApiProvider>
    </Suspense>
  );
};
