import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { ModulesType, TemplateData, Theme } from '../interfaces';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Footer } from './Footer';
import { Header } from './Header';
import { Menu } from './Menu';
import { Products } from './Products';

export const StorefrontPreview = () => {
  return (
    <ThemeProvider>
      <Storefront />
    </ThemeProvider>
  );
};

const Storefront = () => {
  const context = useContext(ThemeContext);
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

  const theme = { ...context.defaultTheme, ...themeListener };
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

      {data.modules?.map((item) => {
        switch (item.type) {
          case ModulesType.CATEGORIES:
            return <Menu data={{ ...theme.categories, ...item }} />;
          case ModulesType.BANNER:
            return <Banner data={{ ...theme.banner, ...item }} />;
          case ModulesType.CARDS:
            return <Products data={{ ...theme.products, ...item }} />;
          default:
            break;
        }
      })}

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
