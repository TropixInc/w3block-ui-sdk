import { createContext } from 'react';

export interface IW3blockwalletContext {
  isConnected: string;
}

// Check if context already exists (for symlink development)
const globalKey = '__W3BLOCK_WALLET_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<IW3blockwalletContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext({} as IW3blockwalletContext);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const W3blockwalletContext = context;
