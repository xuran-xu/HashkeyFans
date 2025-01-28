import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
// import {
//   hashkeyTestnet
// } from 'wagmi/chains';

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
  

export const config = getDefaultConfig({
  appName: 'Hash Fans',
  projectId: '1ea1abda1ecbffd1d28108656904c907',
  chains: [
    hashkeyMainnet
  ],
  ssr: true,
}); 