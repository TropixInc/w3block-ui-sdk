import { createContext } from 'react';

export interface RouterUrlConfig {
  path?: string;
  query?: string;
  replace?: string;
}
export interface RouterContext {
  push: (path: string | RouterUrlConfig) => void;
  path: string;
}

export const PixwayRouterContext = createContext({} as RouterContext);
