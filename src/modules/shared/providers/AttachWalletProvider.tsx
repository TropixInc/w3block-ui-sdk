import { createContext, lazy, ReactNode, useState } from 'react';


interface AttachWalletProviderProps {
  setAttachModal: (bol: boolean) => void;
  attachModal: boolean;
}

// Check if context already exists (for symlink development)
const globalKey = '__ATTACH_WALLET_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<AttachWalletProviderProps>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<AttachWalletProviderProps>({
    attachModal: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAttachModal: () => {},
  });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const AttachWalletContext = context;

export const AttachWalletProvider = ({ children }: { children: ReactNode }) => {
  const [attachModal, setAttachModal] = useState<boolean>(false);
  return (
    <AttachWalletContext.Provider value={{ setAttachModal, attachModal }}>
      {children}
    </AttachWalletContext.Provider>
  );
};
