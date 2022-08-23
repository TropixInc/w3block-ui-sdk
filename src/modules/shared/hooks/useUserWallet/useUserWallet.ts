/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { useWallet, utils } from '@tropixinc/pixchain-react-metamask';

import {
  claimWalletMetamask,
  requestWalletMetamask,
} from '../../../auth/api/wallet';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
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
  id: string;
  address: string;
  chainId: number;
  balance: string;
  ownerId: string;
  type: 'metamask' | 'vault';
  status: string;
}

export function useUserWallet({
  apiToken,
  companyId,
}: {
  apiToken: string;
  companyId: string;
}) {
  const metamask = useWallet();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const provider = metamask.library?.provider;
  const [connected, setConnected] = useState(metamask.active);

  async function claim() {
    if (!apiToken) {
      throw new Error('No API token provided');
    }

    if (!companyId) {
      throw new Error('No company ID provided');
    }

    const { data } = await requestWalletMetamask(
      apiToken,
      companyId,
      w3blockIdAPIUrl,
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
    const signature = await provider?.request!({
      method: 'eth_signTypedData_v4',
      params: [from, data?.message],
    });

    /* Requesting the wallet to be assigned to the authenticated user. */
    await claimWalletMetamask(apiToken, companyId, w3blockIdAPIUrl, {
      signature,
    });
  }

  /**
   * It connects the wallet to the authenticated user account.
   */

  const connect = async (chainId?: number) => {
    try {
      if (!metamask.active || !provider) {
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
          await provider?.request!({
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
              await provider?.request!({
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
