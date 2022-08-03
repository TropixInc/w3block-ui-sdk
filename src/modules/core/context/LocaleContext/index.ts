import { createContext } from 'react';

export type LocaleContext = 'pt-BR' | 'en';

export const localeContext = createContext<LocaleContext>('pt-BR');
