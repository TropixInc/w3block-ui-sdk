import { createContext } from 'react';

export type PixwayUISdkLocale = 'pt-BR' | 'en';

// Check if context already exists (for symlink development)
const globalKey = '__LOCALE_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<PixwayUISdkLocale>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<PixwayUISdkLocale>('pt-BR');
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const LocaleContext = context;
