import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  hashkeyTestnet
} from 'wagmi/chains';
import { 
  okxWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const hashkeyMainnet = /*#__PURE__*/ defineChain({
    id: 177,
    name: 'HashKey Chain Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'HashKey Platform Token',
      symbol: 'HSK',
    },
    rpcUrls: {
      default: {
        http: ['https://mainnet.hsk.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'HashKey Chain Explorer',
        url: 'https://hashkey.blockscout.com',
      },
    },
  })
  

// 根据环境选择网络
const isDevelopment = process.env.NODE_ENV === 'development';

export const config = getDefaultConfig({
  appName: 'Hash Fans',
  projectId: '1ea1abda1ecbffd1d28108656904c907',
  chains: [
    isDevelopment ? hashkeyTestnet : hashkeyMainnet
  ],
  ssr: true,
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        okxWallet,
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ]
    }
  ]
}); 