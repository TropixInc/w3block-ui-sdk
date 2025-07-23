import { createContext } from 'react';

import { NextRouter } from 'next/router';

export interface RouterUrlConfig {
  path?: string;
  query?: string;
  replace?: string;
}

// Check if context already exists (for symlink development)
const globalKey = '__PIXWAY_ROUTER_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<NextRouter>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<NextRouter>({} as NextRouter);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const PixwayRouterContext = context;
