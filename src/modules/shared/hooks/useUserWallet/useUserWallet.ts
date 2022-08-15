/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { useWallet, utils } from '@tropixinc/pixchain-react-metamask';

import {
  claimWalletMetamask,
  requestWalletMetamask,
} from '../../../auth/api/wallet';

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
  const provider = metamask.library?.provider;
  const [connected, setConnected] = useState(metamask.active);

  async function claim() {
    if (!apiToken) {
      throw new Error('No API token provided');
    }

    if (!companyId) {
      throw new Error('No company ID provided');
    }

    const { data } = await requestWalletMetamask(apiToken, companyId, {
      address: metamask.address!,
      chainId: metamask.chainId!,
    });

    const from = data.address;

    /* Request browser wallet provider to sign the association message. */
    const signature = await provider?.request!({
      method: 'eth_signTypedData_v4',
      params: [from, data?.message],
    });

    /* Requesting the wallet to be assigned to the authenticated user. */
    await claimWalletMetamask(apiToken, companyId, {
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

              await provider?.request!({
                method: 'wallet_addEthereumChain',
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
      console.error(error);
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

interface Chain {
  name: string;
  chain: string;
  icon?: any;
  rpc: string[];
  faucets?: any[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL?: string;
  shortName?: string;
  chainId: number;
  networkId?: number;
  slip44?: number;
  ens?: any;
  explorers?: any[];
  title?: string;
}

export const chainConnectors: Chain[] = [
  {
    name: 'Ethereum Mainnet',
    chain: 'ETH',
    icon: 'ethereum',
    rpc: [
      'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
      'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
      'https://api.mycryptoapi.com/eth',
      'https://cloudflare-eth.com',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://ethereum.org',
    shortName: 'eth',
    chainId: 1,
    networkId: 1,
    slip44: 60,
    ens: {
      registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    explorers: [
      {
        name: 'etherscan',
        url: 'https://etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },

  {
    name: 'Ropsten',
    title: 'Ethereum Testnet Ropsten',
    chain: 'ETH',
    rpc: [
      'https://ropsten.infura.io/v3/${INFURA_API_KEY}',
      'wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}',
    ],
    faucets: [
      'http://fauceth.komputing.org?chain=3&address=${ADDRESS}',
      'https://faucet.ropsten.be?${ADDRESS}',
    ],
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ROP',
      decimals: 18,
    },
    infoURL: 'https://github.com/ethereum/ropsten',
    shortName: 'rop',
    chainId: 3,
    networkId: 3,
    ens: {
      registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    },
    explorers: [
      {
        name: 'etherscan',
        url: 'https://ropsten.etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Rinkeby',
    title: 'Ethereum Testnet Rinkeby',
    chain: 'ETH',
    rpc: [
      'https://rinkeby.infura.io/v3/${INFURA_API_KEY}',
      'wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}',
    ],
    faucets: [
      'http://fauceth.komputing.org?chain=4&address=${ADDRESS}',
      'https://faucet.rinkeby.io',
    ],
    nativeCurrency: {
      name: 'Rinkeby Ether',
      symbol: 'RIN',
      decimals: 18,
    },
    infoURL: 'https://www.rinkeby.io',
    shortName: 'rin',
    chainId: 4,
    networkId: 4,
    ens: {
      registry: '0xe7410170f87102df0055eb195163a03b7f2bff4a',
    },
    explorers: [
      {
        name: 'etherscan-rinkeby',
        url: 'https://rinkeby.etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Görli',
    title: 'Ethereum Testnet Görli',
    chain: 'ETH',
    rpc: [
      'https://goerli.infura.io/v3/${INFURA_API_KEY}',
      'wss://goerli.infura.io/v3/${INFURA_API_KEY}',
      'https://rpc.goerli.mudit.blog/',
    ],
    faucets: [
      'http://fauceth.komputing.org?chain=5&address=${ADDRESS}',
      'https://goerli-faucet.slock.it?address=${ADDRESS}',
      'https://faucet.goerli.mudit.blog',
    ],
    nativeCurrency: {
      name: 'Görli Ether',
      symbol: 'GOR',
      decimals: 18,
    },
    infoURL: 'https://goerli.net/#about',
    shortName: 'gor',
    chainId: 5,
    networkId: 5,
    ens: {
      registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    },
    explorers: [
      {
        name: 'etherscan-goerli',
        url: 'https://goerli.etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Polygon Mainnet',
    chain: 'Polygon',
    rpc: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'MATIC',
    chainId: 137,
    networkId: 137,
    slip44: 966,
    explorers: [
      {
        name: 'polygonscan',
        url: 'https://polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Mumbai',
    title: 'Polygon Testnet Mumbai',
    chain: 'Polygon',
    rpc: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpc-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpc.bwarelabs.com',
    ],
    faucets: ['https://faucet.polygon.technology/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'maticmum',
    chainId: 80001,
    networkId: 80001,
    explorers: [
      {
        name: 'polygonscan',
        url: 'https://mumbai.polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Fantom Opera',
    chain: 'FTM',
    rpc: ['https://rpc.ftm.tools'],
    faucets: ['https://free-online-app.com/faucet-for-eth-evm-chains/'],
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    infoURL: 'https://fantom.foundation',
    shortName: 'ftm',
    chainId: 250,
    networkId: 250,
    icon: 'fantom',
    explorers: [
      {
        name: 'ftmscan',
        url: 'https://ftmscan.com',
        icon: 'ftmscan',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Huobi ECO Chain Testnet',
    chain: 'Heco',
    rpc: [
      'https://http-testnet.hecochain.com',
      'wss://ws-testnet.hecochain.com',
    ],
    faucets: ['https://scan-testnet.hecochain.com/faucet'],
    nativeCurrency: {
      name: 'Huobi ECO Chain Test Native Token',
      symbol: 'htt',
      decimals: 18,
    },
    infoURL: 'https://testnet.hecoinfo.com',
    shortName: 'hecot',
    chainId: 256,
    networkId: 256,
  },
  {
    name: 'Setheum',
    chain: 'Setheum',
    rpc: [],
    faucets: [],
    nativeCurrency: {
      name: 'Setheum',
      symbol: 'SETM',
      decimals: 18,
    },
    infoURL: 'https://setheum.xyz',
    shortName: 'setm',
    chainId: 258,
    networkId: 258,
  },
];

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
