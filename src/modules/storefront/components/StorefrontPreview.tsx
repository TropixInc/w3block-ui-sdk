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

  console.log('My Context: ', context);

  const safeOrigin = 'http://localhost:3000/';
  const listener = (event: MessageEvent<TemplateData | string>) => {
    console.log('Event Origin: ', event.origin);

    if (event.origin !== safeOrigin) return;

    console.log('Received some data: ', event.data);

    if (typeof event.data === 'string') return context?.setPageName(event.data);

    setCurrentTheme(event.data);
  };

  const data = { ...context?.pageTheme, ...currentTheme };
  const themeContext = context?.defaultTheme;

  return (
    <>
      {data.items?.map((item) => {
        const Component = componentMap[item.type];
        const props = {
          defaultData: themeContext?.[item.type],
          data: item.props,
        };

        return <Component key={item.type} {...(props as any)} />;
      })}
    </>
  );
};

const componentMap = {
  header: Header,
  banner: () => <></>,
};
