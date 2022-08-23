import { ReactNode, useMemo } from 'react';

import { W3blockwalletContext } from '../../context/W3blockWalletContext';

interface Props {
  children?: ReactNode;
  isConnected: string;
}

export const W3blockWalletProvider = ({ children, isConnected }: Props) => {
  const value = useMemo(() => {
    return {
      isConnected,
    };
  }, [isConnected]);

  return (
    <W3blockwalletContext.Provider value={value}>
      {children}
    </W3blockwalletContext.Provider>
  );
};
