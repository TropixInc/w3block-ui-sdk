import { createContext } from 'react';

export interface IW3blockUISDKGereralConfigContext {
  companyId: string;
  logoUrl: string;
  appBaseUrl: string;
  connectProxyPass: string;
  name?: string;
}

export const W3blockUISDKGereralConfigContext = createContext({
  connectProxyPass: '/',
} as IW3blockUISDKGereralConfigContext);
