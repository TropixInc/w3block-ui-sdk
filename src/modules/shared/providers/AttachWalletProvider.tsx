import { lazy, ReactNode, useState } from 'react';
import { createSymlinkSafeContext } from '../utils/createSymlinkSafeContext';

interface AttachWalletProviderProps {
  setAttachModal: (bol: boolean) => void;
  attachModal: boolean;
}

export const AttachWalletContext = createSymlinkSafeContext<AttachWalletProviderProps>(
  '__ATTACH_WALLET_CONTEXT__',
  {
    attachModal: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAttachModal: () => {},
  }
);

export const AttachWalletProvider = ({ children }: { children: ReactNode }) => {
  const [attachModal, setAttachModal] = useState<boolean>(false);
  return (
    <AttachWalletContext.Provider value={{ setAttachModal, attachModal }}>
      {children}
    </AttachWalletContext.Provider>
  );
};
