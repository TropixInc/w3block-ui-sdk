import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useGetPageModules } from '../../hooks/useGetPageModules/useGetPageModules';
import { useGetTheme } from '../../hooks/useGetTheme';
import { Theme, TemplateData } from '../../interfaces';

export const ThemeContext = createContext<IThemeContext | null>(null);
interface IThemeContext {
  defaultTheme: Theme | null;
  setDefaultTheme?: (Theme: Theme) => void;
  pageTheme: TemplateData | null;
  setPageName: Dispatch<SetStateAction<string>>;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [defaultTheme, setDefaultTheme] = useState<Theme | null>(null);
  const [pageTheme, setPageTheme] = useState<TemplateData | null>(null);
  const [_, setPageName] = useState('');
  const { data: theme } = useGetTheme();
  const { data: pageModules } = useGetPageModules();
  useEffect(() => {
    if (theme) {
      setDefaultTheme(theme.data);
    }
  }, [theme]);

  useEffect(() => {
    if (pageModules) {
      setPageTheme(pageModules.data);
    }
  }, [pageModules]);

  return (
    <ThemeContext.Provider
      value={{
        defaultTheme,
        pageTheme,
        setPageName,
        setDefaultTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
