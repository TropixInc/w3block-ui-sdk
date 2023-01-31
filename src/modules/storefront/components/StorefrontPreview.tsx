import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { ModulesType, TemplateData, Theme } from '../interfaces';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Footer } from './Footer';
import { Header } from './Header';
import { Menu } from './Menu';

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

  const listener = ({
    data,
  }: MessageEvent<{ update: string; theme: Theme; page: TemplateData }>) => {
    if (data && data.theme) {
      context?.setDefaultTheme?.(data.theme);
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

  const pageDefault = themeContext.configurations;
  return (
    <div
      style={{
        color: pageDefault.styleData.textColor,
        background: pageDefault.styleData.backgroundColor,
      }}
    >
      <Header data={themeContext.header} />
      <Cookies data={themeContext.cookies} />

      {data.modules?.map((item) => {
        //const Component = componentMap[item.type];

        switch (item.type) {
          case ModulesType.CATEGORIES:
            return <Menu data={{ ...themeContext.categories, ...item }} />;
          case ModulesType.BANNER:
            return <Banner data={{ ...themeContext.banner, ...item }} />;
          default:
            break;
        }
        // return (
        //   <Component
        //     key={item.type + i}
        //     data={{ ...themeContext[item.type], ...item } as any}
        //   />
        // );
      })}

      <Footer data={themeContext.footer} />
    </div>
  );
};

// const componentMap = {
//   header: Header,
//   menu: Menu,
//   banner: Banner,
//   products: Products,
//   cookies: Cookies,
//   footer: Footer,
// };
