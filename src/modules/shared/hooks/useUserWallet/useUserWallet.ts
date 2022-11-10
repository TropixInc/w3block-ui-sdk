/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { useWallet, utils } from '@w3block/pixchain-react-metamask';

import {
  claimWalletMetamask,
  requestWalletMetamask,
} from '../../../auth/api/wallet';
import { ChainScan } from '../../enums/ChainId';
import { useBalance } from '../useBalance';
import { useCompanyConfig } from '../useCompanyConfig';
import { useIsProduction } from '../useIsProduction';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import { useProfile } from '../useProfile';
import { useSessionUser } from '../useSessionUser';
import { Chain, chainConnectors } from './chainConnectors';

export interface Wallet {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  address: string;
  chainId: number;
  ownerId: string;
  type: 'metamask' | 'vault';
  status: string;
  verificationNonce?: unknown;
}

export interface WalletSimple {
  id?: string;
  address: string;
  chainId: number;
  balance: string;
  ownerId: string;
  type: 'metamask' | 'vault';
  status: string;
}

export function useUserWallet() {
  const [wallet, setWallet] = useState<WalletSimple>();
  const { data: profile } = useProfile();
  const isProduction = useIsProduction();
  const balance = useBalance({
    address: profile?.data.mainWallet?.address || '',
    chainId: isProduction ? ChainScan.POLYGON : ChainScan.MUMBAI,
  });
  const metamask = useWallet();
  const user = useSessionUser();
  const { companyId } = useCompanyConfig();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const [connected, setConnected] = useState(metamask.active);

  useEffect(() => {
    if (profile?.data.mainWallet) {
      const walletHere = profile.data.mainWallet;
      setWallet({
        id: walletHere.id ?? '',
        address: walletHere.address,
        chainId: isProduction ? ChainScan.POLYGON : ChainScan.MUMBAI,
        balance: '0',
        ownerId: walletHere.ownerId,
        type: walletHere.type,
        status: walletHere.status,
      });
      if (balance?.data && wallet) {
        setWallet({ ...wallet, balance: balance?.data?.data.balance ?? '0' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function claim() {
    if (!user?.accessToken) {
      throw new Error('No API token provided');
    }

    if (!companyId) {
      throw new Error('No company ID provided');
    }

    const { data } = await requestWalletMetamask(
      user?.accessToken ?? '',
      companyId,
      w3blockIdAPIUrl,
      user?.refreshToken ?? '',
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: metamask.address!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chainId: metamask.chainId!,
      }
    );

    const from = data.address;

    /* Request browser wallet provider to sign the association message. */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const signature = await metamask.library?.provider?.request!({
      method: 'eth_signTypedData_v4',
      params: [from, data?.message],
    });
    await claimWalletMetamask(
      user.accessToken ?? '',
      companyId,
      w3blockIdAPIUrl,
      user?.refreshToken ?? '',
      {
        signature,
      }
    ).then((resp) => {
      if (resp.data.statusCode !== 200) {
        throw new Error(resp.data.message);
      }
    });

    /* Requesting the wallet to be assigned to the authenticated user. */
  }

  /**
   * It connects the wallet to the authenticated user account.
   */

  const connect = async (chainId?: number) => {
    try {
      if (!metamask.active || !metamask.library?.provider) {
        await metamask.activateBrowserWallet((cb) => {
          if (cb instanceof Error) {
            throw cb;
          }
        });
      }

      if (chainId && chainId !== metamask.chainId) {
        const hexChainId = utils.hexStripZeros(utils.hexlify(chainId));
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await metamask.library?.provider?.request!({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              const chainConnector = chainConnectors.find(
                (chain) => chain.chainId === chainId
              );

              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              await metamask.library?.provider?.request!({
                method: 'wallet_addEthereumChain',
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                params: [buildAddChain(chainConnector!)],
              });
            } catch (addError) {
              console.error('Error adding chain to MetaMask', addError);
            }
          }

          console.error('Error switching chain in MetaMask', switchError);
        }
      }

      setConnected(true);
    } catch (error: any) {
      console.error('connect', error);
      setConnected(false);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  };

  return {
    connect,
    ...metamask,
    hasWallet: profile?.data.mainWallet?.address != undefined,
    wallet,
    active: metamask.active,
    connected,
    claim,
  };
}

export class WalletTransformer {
  public static toSimple(wallet: Wallet): WalletSimple {
    return {
      id: wallet.id,
      address: wallet.address,
      chainId: wallet.chainId,
      balance: '0',
      ownerId: wallet.ownerId,
      type: wallet.type,
      status: wallet.status,
    };
  }

  public static toSimpleArray(wallets: Wallet[]): WalletSimple[] {
    return wallets.map((wallet) => this.toSimple(wallet));
  }
}

const buildAddChain = (chain: Chain) => ({
  chainId: utils.hexStripZeros(utils.hexlify(chain.chainId)),
  chainName: chain.name,
  nativeCurrency: {
    name: chain.nativeCurrency.name,
    symbol: chain.nativeCurrency.symbol,
    decimals: chain.nativeCurrency.decimals,
  },
  rpcUrls: chain.rpc,
  blockExplorerUrls: [
    chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
      ? chain.explorers[0].url
      : chain.infoURL,
  ],
});
