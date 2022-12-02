import { useContext, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { ThemeContext, ThemeProvider } from '../contexts';
import { TemplateData } from '../interfaces';
import { Header } from './Header';

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
      {data.items?.map((item) => {
        const Component = componentMap[item.type];
        return (
          <Component
            key={item.type}
            data={item.props}
            defaultData={themeContext[item.type]}
          />
        );
      })}
    </>
  );
};

const componentMap = {
  header: Header,
  banner: () => <></>,
};
