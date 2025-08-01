import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

import { IW3blockAuthenticationContext } from '../../shared/interfaces/IW3blockAuthenticationContext';

export const W3blockAuthenticationContext = createSymlinkSafeContext<IW3blockAuthenticationContext>(
  '__W3BLOCK_AUTH_CONTEXT__',
  {} as IW3blockAuthenticationContext
);
