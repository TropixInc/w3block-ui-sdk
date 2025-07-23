import { createContext } from 'react';

interface IEnvironmentContext {
  isProduction: boolean;
}

// Check if context already exists (for symlink development)
const globalKey = '__ENVIRONMENT_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<IEnvironmentContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<IEnvironmentContext>({
    isProduction: false,
  });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const EnvironmentContext = context;
