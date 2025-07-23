/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

import { IW3blockAuthenticationContext } from '../../shared/interfaces/IW3blockAuthenticationContext';

// Check if context already exists (for symlink development)
const globalKey = '__W3BLOCK_AUTH_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<IW3blockAuthenticationContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext({} as IW3blockAuthenticationContext);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const W3blockAuthenticationContext = context;
