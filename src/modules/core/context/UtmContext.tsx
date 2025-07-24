import { createContext } from 'react';

export interface UtmContextInterface {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  expires?: number;
}

// Check if context already exists (for symlink development)
const globalKey = '__UTM_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<UtmContextInterface>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<UtmContextInterface>({});
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const UtmContext = context;
