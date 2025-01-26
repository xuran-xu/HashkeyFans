import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  hashkeyTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Hash Fans',
  projectId: '1ea1abda1ecbffd1d28108656904c907',
  chains: [
    hashkeyTestnet
  ],
  ssr: true,
}); 