import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { DefaultDataProps, TemplateData } from '../interfaces';
import { Banner } from './Banner';
import { Cookies } from './Cookies';
import { Header } from './Header';
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
  const [currentTheme, setCurrentTheme] = useState<TemplateData | null>(null);
  useEffectOnce(() => {
    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  });

  const safeOrigin = 'http://localhost:3000/';
  const listener = (event: MessageEvent<TemplateData | string>) => {
    if (event.origin !== safeOrigin) return;

    if (typeof event.data === 'string') return context?.setPageName(event.data);

    setCurrentTheme(event.data);
  };

  const data = { ...context?.pageTheme, ...currentTheme };
  const themeContext = context?.defaultTheme;

  if (!themeContext) return null;

  return (
    <>
      {data.items?.map((item, i) => {
        const Component = componentMap[item.type];
        return (
          <Component
            key={item.type + i}
            data={item.props}
            defaultData={
              themeContext[item.type] as keyof DefaultDataProps['defaultData']
            }
          />
        );
      })}

      <Copyright />
    </>
  );
};

const componentMap = {
  header: Header,
  categories: () => <></>,
  banner: Banner,
  products: Products,
  cookies: Cookies,
};

const Copyright = () => {
  return (
    <div className="pw-w-full pw-grid pw-place-items-center pw-h-[42px] pw-bg-white pw-font-roboto pw-font-medium">
      Copyright {new Date().getFullYear()} - [web/lock]
    </div>
  );
};
