import { createContext } from 'react';

import { NextRouter } from 'next/router';

export interface RouterUrlConfig {
  path?: string;
  query?: string;
  replace?: string;
}

export const PixwayRouterContext = createContext<NextRouter>({} as NextRouter);
