import { createContext } from "react";
import { IThemeContext } from "../../shared/interfaces/IThemeContext";


export const ThemeContext = createContext<IThemeContext | null>(null); 