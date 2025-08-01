import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

export interface IW3blockUISDKGereralConfigContext {
  companyId: string;
  logoUrl: string;
  appBaseUrl: string;
  connectProxyPass: string;
  name?: string;
}

export const W3blockUISDKGereralConfigContext = createSymlinkSafeContext<IW3blockUISDKGereralConfigContext>(
  '__W3BLOCK_CONFIG_CONTEXT__',
  {
    connectProxyPass: '/',
  } as IW3blockUISDKGereralConfigContext
);
