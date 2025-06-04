import { createContext } from 'react';

export type PixwayUISdkLocale = 'pt-BR' | 'en';

export const LocaleContext = createContext<PixwayUISdkLocale>('pt-BR');
