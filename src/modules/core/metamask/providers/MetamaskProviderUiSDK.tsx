/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import detectEthereumProvider from '@metamask/detect-provider';
import { ContractTransaction, ethers } from 'ethers';
import { ContractTransactionCallable, Transaction } from '../../../shared/interfaces/IMetamask';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL';
import { Format, formatBalance } from '../../utils/format';
import { claimWalletMetamask, requestWalletMetamask } from '../../../auth/api/wallet';



interface MetamaskContextInterface {
  wallet: WalletState;
  hasProvider?: boolean;
  error: boolean;
  errorMessage?: string;
  isConnecting: boolean;
  clearError?: () => void;
  connectMetamask?: () => Promise<void>;
  isConnected?: boolean;
  accounts?: string;
  chainId?: number;
  sendSignedRequest?: (transaction: Transaction) => Promise<any>;
  claim?: () => Promise<void>;
  signTransaction?: (
    param: Record<string, any>
  ) => Promise<ERROR_STATUS | string>;
}

export enum ERROR_STATUS {
  NO_METAMASK = 'Metamask não instalada',
  REFUSE_METAMASK = 'Assinatura da transação rejeitada',
  INVALID_PARAMS = 'Parametros inválidos',
  INTERNAL_ERROR = 'Internal error',
  NO_MAPPED_ERROR = 'Erro não mapeado',
}

interface WalletState {
  accounts: any[];
  balance: string;
  chainId: string;
}

enum ETH_METHODS {
  CONNECT_ACCOUNT = 'eth_requestAccounts',
  SEND_TRANSACTION = 'eth_sendTransaction',
  GET_CHAIN_ID = 'eth_chainId',
  GET_ACCOUNT = 'eth_accounts',
}

const disconnectedState: WalletState = {
  accounts: [],
  balance: '',
  chainId: '',
};

export const metamaskErrors = new Map<number, ERROR_STATUS>([
  [4001, ERROR_STATUS.REFUSE_METAMASK],
  [-32602, ERROR_STATUS.INVALID_PARAMS],
  [-32603, ERROR_STATUS.INTERNAL_ERROR],
]);

export const MetamaskProviderContext = createContext<MetamaskContextInterface>({
  wallet: disconnectedState,
  error: false,
  isConnecting: false,
  hasProvider: false,
});

export const MetamaskProviderUiSDK = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [providerState, setProvider] =
    useState<ethers.providers.Web3Provider>();
  const user = useSessionUser();
  const { companyId } = useCompanyConfig();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const [hasProvider, setHasProvider] = useState<boolean | undefined>(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const clearError = () => setErrorMessage('');
  const [wallet, setWallet] = useState(disconnectedState);
  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts =
      providedAccounts ||
      (await (window as any).ethereum.request({ method: 'eth_accounts' }));
    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await ((window as any) as any).ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })
    );
    const chainId = await (window as any).ethereum.request({
      method: 'eth_chainId',
    });

    setWallet({ accounts, balance, chainId });
  }, []);

  const updateWalletAndAccounts = useCallback(
    () => _updateWallet(),
    [_updateWallet]
  );
  const updateWallet = useCallback(
    (accounts: any) => _updateWallet(accounts),
    [_updateWallet]
  );

  useEffect(() => {
    const getProvider = async () => {
      try {
        const provider = await detectEthereumProvider({ silent: true });
        setHasProvider(Boolean(provider));
        const provider2 = new ethers.providers.Web3Provider((window as any).ethereum);
        setProvider(provider2);

        if (provider) {
          updateWalletAndAccounts();
          (window as any).ethereum.on('accountsChanged', updateWallet);
          (window as any).ethereum.on('chainChanged', updateWalletAndAccounts);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getProvider();

    return () => {
      (window as any).ethereum?.removeListener('accountsChanged', updateWallet);
      (window as any).ethereum?.removeListener('chainChanged', updateWalletAndAccounts);
    };
  }, [updateWallet, updateWalletAndAccounts]);

  const connectMetamask = async () => {
    setIsConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      clearError();
      updateWallet(accounts);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  };

  const sendTransaction = async (
    params: ContractTransactionCallable,
    signerOrProvider?: any
  ) => {
    const contract = new ethers.Contract(
      params.contractAddress,
      [params.signature],
      signerOrProvider
    );
    const contractMethod = params.methodName;
    const contractArgs = params.argumentValues;
    const overrides = {
      value: params.ether
        ? ethers.utils.parseUnits(params.ether, 'ether')
        : undefined,
    };
    const result: ContractTransaction = await contract.functions[
      contractMethod
    ](...contractArgs, overrides);
    return result;
  };

  // Use Metamask to sign and send the transaction.
  const sendSignedRequest = useCallback(
    async (transaction: Transaction) => {
      const response = await sendTransaction(
        Format.from(transaction.data),
        providerState?.getSigner()
      );
      return response?.hash;
    },
    [providerState]
  );

  const signTransaction = async (
    param: Record<string, any>
  ): Promise<ERROR_STATUS | string> => {
    return await (window as any).ethereum
      .request({
        method: ETH_METHODS.SEND_TRANSACTION,
        params: [param],
      })
      .then((data: string) => {
        return data;
      })
      .catch((e: any) => {
        return metamaskErrors.get(e.code) ?? ERROR_STATUS.NO_MAPPED_ERROR;
      });
  };

  const claim = useCallback(async () => {
    if (!user?.accessToken) {
      throw new Error('No API token provided');
    }

    if (!companyId) {
      throw new Error('No company ID provided');
    }

    if (wallet.accounts.length === 0) {
      throw new Error('No wallet connected');
    }

    const { data } = await requestWalletMetamask(
      user?.accessToken ?? '',
      companyId,
      w3blockIdAPIUrl,
      user?.refreshToken ?? '',
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: wallet.accounts[0],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chainId: parseInt(wallet.chainId),
      }
    );

    const from = data.address;
    let signature;
    try {
      signature = await (window as any).ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, data?.message],
      });
    } catch (e) {
      console.log(e);
    }
    /* Request browser wallet provider to sign the association message. */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    await claimWalletMetamask(
      user.accessToken ?? '',
      companyId,
      w3blockIdAPIUrl,
      user?.refreshToken ?? '',
      {
        signature,
      }
    ).then((resp) => {
      if (resp?.data?.statusCode < 200 || resp?.data?.statusCode > 300) {
        throw new Error(resp.data.message);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, user]);

  return (
    <MetamaskProviderContext.Provider
      value={{
        wallet,
        hasProvider,
        error: Boolean(errorMessage),
        errorMessage,
        isConnecting,
        clearError,
        connectMetamask,
        signTransaction,
        sendSignedRequest,
        claim,
        isConnected: wallet.accounts.length > 0,
      }}
    >
      {children}
    </MetamaskProviderContext.Provider>
  );
};
