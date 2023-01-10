import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { PageData, TemplateData } from '../interfaces';
import { Banner, guessMediaType } from './Banner';
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

  const pageData = data.items?.find((item) => item.type === 'page') as PageData;
  const pageDefault = themeContext.page;
  const pageStyle = { ...pageDefault, ...pageData };
  const mediaType = guessMediaType(pageStyle?.media || '');

  const overlayProp = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), ${pageStyle.overlayColor})`;

  const bg =
    mediaType === 'no-media'
      ? pageStyle.bgColor
      : mediaType === 'image'
      ? `url('${pageStyle?.media}')`
      : '';

  const overlayBg =
    mediaType === 'image'
      ? `${overlayProp}, ${bg}`
      : mediaType === 'video'
      ? overlayProp
      : bg;

  return (
    <div
      style={{
        color: pageStyle.textColor,
        background: overlayBg,
      }}
    >
      {data.items?.map((item, i) => {
        const Component = componentMap[item.type];
        return (
          <Component
            key={item.type + i}
            data={{ ...themeContext[item.type], ...item } as any}
          />
        );
      })}

      <Copyright />
    </div>
  );
};

const componentMap = {
  page: () => <></>,
  header: Header,
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
