import { useContext } from 'react';
import { SocketProviderContext } from '../providers/SocketProviderUiSDK';

export const useSocket = () => {
  const { isConnected, signinRequest, emitTransactionCloncluded } = useContext(
    SocketProviderContext
  );

  return { isConnected, signinRequest, emitTransactionCloncluded };
};
