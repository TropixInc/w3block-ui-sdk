import { Dispatch, SetStateAction } from "react";
import { GetPageInfoInterface, TemplateData, Theme } from "../../storefront/interfaces/Theme";


export interface IThemeContext {
    defaultTheme?: Theme | null;
    setDefaultTheme?: (Theme: Theme) => void;
    pageTheme?: TemplateData | null;
    setPageName?: Dispatch<SetStateAction<string>>;
    isError?: boolean;
    isThemeError?: boolean;
    isThemeSuccess?: boolean;
    setPageTheme?: (TemplateData: TemplateData) => void;
    pageInfo?: GetPageInfoInterface;
  }
  