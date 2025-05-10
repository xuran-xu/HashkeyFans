'use client'

import { wagmiAdapter, projectId } from '@/config/WalletConnectButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { hashkey, hashkeyTestnet } from 'viem/chains'

// Set up queryClient
const queryClient = new QueryClient()

console.log('projectId', projectId)

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://hashfans.xyz', 
  icons: ['https://www.hashfans.xyz/img/hashfans.png']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [process.env.NODE_ENV === "development" ? hashkeyTestnet : hashkey],
  defaultNetwork: process.env.NODE_ENV === "development" ? hashkeyTestnet : hashkey,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function ContextProvider({ children }: { children: ReactNode; }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider