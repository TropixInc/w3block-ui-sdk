import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

export interface IW3blockwalletContext {
  isConnected: string;
}

export const W3blockwalletContext = createSymlinkSafeContext<IW3blockwalletContext>(
  '__W3BLOCK_WALLET_CONTEXT__',
  {} as IW3blockwalletContext
);
