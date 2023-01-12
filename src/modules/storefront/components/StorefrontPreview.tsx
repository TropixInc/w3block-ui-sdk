import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { PageData, TemplateData } from '../interfaces';
import { Banner, guessMediaType } from './Banner';
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
  const [currentTheme, setCurrentTheme] = useState<TemplateData | null>(null);

  const listener = ({ data }: MessageEvent<TemplateData | string>) => {
    if (typeof data === 'string') {
      return context?.setPageName(data);
    }

    setCurrentTheme(data);
  };

  useEffectOnce(() => {
    addEventListener('message', listener);

    return () => removeEventListener('message', listener);
  });

  const data = { ...context?.pageTheme, ...currentTheme };
  const themeContext = context?.defaultTheme;

  if (!themeContext) return null;

  const pageData = data.items?.find((item) => item.type === 'page') as PageData;
  const pageDefault = themeContext.page;
  const pageStyle = { ...pageDefault, ...pageData };
  const mediaType = guessMediaType(pageStyle?.media || '');

  const overlayProp = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), ${pageStyle.overlayColor})`;

  let bg = '';
  if (mediaType === 'no-media') {
    bg = pageStyle.bgColor;
  } else if (mediaType === 'image') {
    bg = `url('${pageStyle?.media}')`;
  }

  let overlayBg = bg;
  if (mediaType === 'image') {
    overlayBg = `${overlayProp}, ${bg}`;
  } else if (mediaType === 'video') {
    overlayBg = overlayProp;
  }

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
  menu: Menu,
  banner: Banner,
  products: Products,
  cookies: Cookies,
  footer: Footer,
};

const Copyright = () => {
  return (
    <div className="pw-w-full pw-grid pw-place-items-center pw-h-[42px] pw-bg-white pw-font-roboto pw-font-medium">
      Copyright {new Date().getFullYear()} - [web/lock]
    </div>
  );
};
