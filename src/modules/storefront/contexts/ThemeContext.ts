import * as React from "react"

import { IThemeContext } from "../../shared/interfaces/IThemeContext";

// Check if context already exists (for symlink development)
const globalKey = '__THEME_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<IThemeContext | null>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = React.createContext<IThemeContext | null>(null);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const ThemeContext = context; 