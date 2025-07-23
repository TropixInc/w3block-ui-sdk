import { createContext } from 'react';

export interface IW3blockUISDKGereralConfigContext {
  companyId: string;
  logoUrl: string;
  appBaseUrl: string;
  connectProxyPass: string;
  name?: string;
}

// Check if context already exists (for symlink development)
const globalKey = '__W3BLOCK_CONFIG_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<IW3blockUISDKGereralConfigContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext({
    connectProxyPass: '/',
  } as IW3blockUISDKGereralConfigContext);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const W3blockUISDKGereralConfigContext = context;
