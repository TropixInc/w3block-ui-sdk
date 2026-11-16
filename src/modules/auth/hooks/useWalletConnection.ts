/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePixwayAPIURL } from '../../shared/hooks/usePixwayAPIURL';
import { useSessionUser } from '../../shared/hooks/useSessionUser';
import { useToken } from '../../shared/hooks/useToken';
import { useWallets } from '../../shared/hooks/useWallets';
import { useModalController } from '../../shared/hooks/useModalController';
import { claimWalletVault } from '../api/wallet';

interface UseWalletConnectionParams {
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}

export const useWalletConnection = ({
  onSuccess,
  onError,
}: UseWalletConnectionParams) => {
  const { companyId } = useCompanyConfig();
  const token = useToken();
  const user = useSessionUser();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const { connectMetamask, claim, isConnected } = useWallets();
  const {
    closeModal: closeGenerateTokenModal,
    isOpen: isGenerateTokenOpen,
    openModal: openGenerateTokenModal,
  } = useModalController();
  const {
    isOpen: isAppErrorOpen,
    closeModal: closeAppErrorModal,
    openModal: openAppErrorModal,
  } = useModalController();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectToMetamaskExtension = async () => {
    const agent = window.navigator.userAgent ?? '';
    if (
      !(globalThis.window as any)?.ethereum &&
      !agent.includes('MetaMaskMobile')
    ) {
      openGenerateTokenModal();
      return;
    } else if (
      !(globalThis.window as any)?.ethereum &&
      agent.includes('MetaMaskMobile')
    ) {
      openAppErrorModal();
      return;
    }
    setIsConnecting(true);

    try {
      await connectMetamask?.();
      setIsConnecting(false);
    } catch (error: any) {
      console.error(error);
      setIsConnecting(false);
      onError(error.message);
    }
  };

  const connectMetamaskWallet = async () => {
    setIsConnecting(true);

    try {
      await claim?.();
      setIsConnecting(false);
      onSuccess();
    } catch (error: any) {
      setIsConnecting(false);
      if (!error?.message || error.message === '') {
        onSuccess();
        return;
      }
      console.error(error);
      onError(error.message);
    }
  };

  const createVaultWallet = async () => {
    setIsConnecting(true);

    try {
      await claimWalletVault(
        token,
        companyId,
        w3blockIdAPIUrl,
        user?.refreshToken ?? ''
      );
      setIsConnecting(false);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setIsConnecting(false);
      onError(error.message);
    }
  };

  return {
    isConnecting,
    isConnected,
    connectToMetamaskExtension,
    connectMetamaskWallet,
    createVaultWallet,
    generateTokenModal: {
      isOpen: isGenerateTokenOpen,
      close: closeGenerateTokenModal,
    },
    appErrorModal: {
      isOpen: isAppErrorOpen,
      close: closeAppErrorModal,
    },
  };
};
