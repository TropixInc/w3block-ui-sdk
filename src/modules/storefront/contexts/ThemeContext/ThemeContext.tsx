import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSessionStorage } from 'react-use';

import { useGetPageModules } from '../../hooks/useGetPageModules/useGetPageModules';
import { useGetTheme } from '../../hooks/useGetTheme';
import { Theme, TemplateData } from '../../interfaces';

export const ThemeContext = createContext<IThemeContext | null>(null);
interface IThemeContext {
  defaultTheme: Theme | null;
  setDefaultTheme?: (Theme: Theme) => void;
  pageTheme: TemplateData | null;
  setPageName: Dispatch<SetStateAction<string>>;
  isError: boolean;
  isThemeError: boolean;
  isThemeSuccess: boolean;
  setPageTheme: (TemplateData: TemplateData) => void;
}

const BASE_THEME_KEY = 'baseThem_key';

export const ThemeProvider = ({
  children,
  upperTheme,
  upperPage,
}: {
  children: ReactNode;
  upperTheme?: Theme | null;
  upperPage?: TemplateData | null;
}) => {
  const [defaultTheme, setDefaultTheme] = useState<Theme | null>(null);
  const [pageTheme, setPageTheme] = useState<TemplateData | null>(null);
  const [pageThemeSession, setPageThemeSession] =
    useSessionStorage<TemplateData | null>(BASE_THEME_KEY);
  const [_, setPageName] = useState('');
  useEffect(() => {
    if (upperTheme) {
      setDefaultTheme(upperTheme);
    }
  }, [upperTheme]);
  useEffect(() => {
    if (upperPage) {
      setPageTheme(upperPage);
    }
  }, [upperPage]);
  const {
    data: theme,
    isError: isThemeError,
    isSuccess: isThemeSuccess,
  } = useGetTheme(upperTheme ? true : false);
  const { data: pageModules, isError } = useGetPageModules(
    upperPage ? true : false
  );
  useEffect(() => {
    if (theme) {
      setDefaultTheme(theme.data);
      setPageThemeSession(theme.data);
    } else if (isThemeError) {
      setPageTheme(pageThemeSession);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, isThemeError]);

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
        isError,
        isThemeError,
        isThemeSuccess,
        setPageTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
