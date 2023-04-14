/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EtherUnitsEnum } from '@w3block/pixchain-react-metamask';
import { ContractTransaction, ethers } from 'ethers';

import { ContractTransactionCallable, Transaction } from '../interface';
import { Format } from '../utils/format';

interface MetamaskContextInterface {
  hasMetamask: boolean;
  connectMetamask?: () => void;
  isConnected?: boolean;
  accounts?: string;
  chainId?: number;
  sendSignedRequest?: (transaction: Transaction) => Promise<any>;
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

enum ETH_METHODS {
  CONNECT_ACCOUNT = 'eth_requestAccounts',
  SEND_TRANSACTION = 'eth_sendTransaction',
  GET_CHAIN_ID = 'eth_chainId',
  GET_ACCOUNT = 'eth_accounts',
}

export const metamaskErrors = new Map<number, ERROR_STATUS>([
  [4001, ERROR_STATUS.REFUSE_METAMASK],
  [-32602, ERROR_STATUS.INVALID_PARAMS],
  [-32603, ERROR_STATUS.INTERNAL_ERROR],
]);

export const MetamaskProviderContext = createContext<MetamaskContextInterface>({
  hasMetamask: false,
});

export const MetamaskProviderUiSDK = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [providerState, setProvider] =
    useState<ethers.providers.Web3Provider>();
  const [chainId, setChainId] = useState<number>();
  const [accounts, setAccounts] = useState<string>();
  const eth =
    window && (window as any).ethereum ? (window as any).ethereum : null;

  const isConnected = useMemo(() => {
    if (eth && eth?.isConnected()) {
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eth]);

  const hasMetamask = useMemo(() => {
    if (eth) {
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eth]);

  useEffect(() => {
    if (eth) {
      const provider = new ethers.providers.Web3Provider(eth);
      setProvider(provider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eth]);

  const handleAccountChange = (data: Array<string>) => {
    if (data.length) {
      setAccounts(data[0]);
    }
  };

  const handleChainChanged = (data: string) => {
    setChainId(convertBigNumber(data));
  };

  const convertBigNumber = (big: string): number => {
    return ethers.BigNumber.from(big).toNumber();
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
        ? ethers.utils.parseUnits(params.ether, EtherUnitsEnum.ETHER)
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

  const signTransaction = (
    param: Record<string, any>
  ): Promise<ERROR_STATUS | string> => {
    return eth
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

  useEffect(() => {
    if (hasMetamask && isConnected && eth) {
      eth.on('accountsChanged', handleAccountChange);
      eth.on('chainChanged', handleChainChanged);
      eth
        .request({ method: ETH_METHODS.GET_CHAIN_ID })
        .then((data: string) => setChainId(convertBigNumber(data)));
      eth
        .request({ method: ETH_METHODS.GET_ACCOUNT })
        .then((data: Array<string>) => {
          if (data.length) setAccounts(data[0]);
        });
    }

    return () => {
      if (eth) {
        eth.removeListener('accountsChanged', handleAccountChange);
        eth.removeListener('chainChanged', handleChainChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eth]);

  const connectMetamask = (): Promise<ERROR_STATUS | null> => {
    if (hasMetamask && providerState) {
      return providerState
        .send(ETH_METHODS.CONNECT_ACCOUNT, [])
        .then((data) => {
          if (data.length) {
            setAccounts(data);
          }

          return null;
        })
        .catch((e) => {
          return metamaskErrors.get(e.code) ?? ERROR_STATUS.NO_MAPPED_ERROR;
        });
    } else {
      return new Promise(() => ERROR_STATUS.NO_METAMASK);
    }
  };

  return (
    <MetamaskProviderContext.Provider
      value={{
        hasMetamask,
        connectMetamask,
        isConnected,
        accounts,
        chainId,
        signTransaction,
        sendSignedRequest,
      }}
    >
      {children}
    </MetamaskProviderContext.Provider>
  );
};
