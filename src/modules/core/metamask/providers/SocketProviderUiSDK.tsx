
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSessionStorage } from 'react-use';

import { Socket, io } from 'socket.io-client';
import { Transaction } from '../../../shared/interfaces/IMetamask';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';



interface SocketProviderContextInterface {
  isConnected: boolean;
  signinRequest: Transaction | null;
  emitTransactionCloncluded?: (
    transactionId: string,
    txHash: string
  ) => Promise<void>;
}

export const SocketProviderContext =
  createContext<SocketProviderContextInterface>({
    isConnected: false,
    signinRequest: null,
  });

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://pixwayid.pixway.io/blockchain-transactions'
    : 'https://pixwayid.stg.pixway.io/blockchain-transactions';

const socket = io(URL, {
  secure: true,
  autoConnect: false,
  transports: ['websocket'],
});

export const SocketProviderUiSDK = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketIo, setSocketIo] = useState<Socket>();
  const [signinRequest, setSigninRequest] =
    useSessionStorage<Transaction | null>('signKey', null);
  const { data: session } = usePixwaySession();

  useEffect(() => {
    if (session?.accessToken) {
      socket.auth = { token: session?.accessToken };
      socket.connect();
      setSocketIo(socket);
    }
  }, [session?.accessToken]);

  const onConnect = () => {
    setIsConnected(true);
    setSigninRequest(null);
  };
  const onDisconnect = () => {
    setIsConnected(false);
    setSigninRequest(null);
  };

  const emitTransactionCloncluded = (
    transactionId: string,
    txHash: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socketIo?.emit('sign', { transactionId, txHash }, (response: any) =>
        resolve(response)
      );
    });
  };

  const onSigninRequest = useCallback(
    (data: Transaction) => {
      if (data) {
        if (data.id != signinRequest?.id) {
          setSigninRequest(data);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinRequest]
  );

  useEffect(() => {
    if (socketIo) {
      socketIo.on('connect', onConnect);
      socketIo.on('disconnect', onDisconnect);
      socketIo.on('signing-request', (data: Transaction) =>
        onSigninRequest(data)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketIo?.connected, onSigninRequest, signinRequest]);

  return (
    <SocketProviderContext.Provider
      value={{ isConnected, signinRequest, emitTransactionCloncluded }}
    >
      {children}
    </SocketProviderContext.Provider>
  );
};
