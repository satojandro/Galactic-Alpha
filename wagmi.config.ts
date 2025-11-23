import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Ankr RPC URL with API key
const ANKR_SEPOLIA_RPC = 'https://rpc.ankr.com/eth_sepolia/075b65b3e8bd804d01844fe51b0d6409b182389c04f38322e81329783c68110f'

// Sepolia with custom Ankr RPC
const sepoliaWithAnkr = defineChain({
  ...sepolia,
  rpcUrls: {
    default: {
      http: [ANKR_SEPOLIA_RPC],
    },
  },
})

// Zircuit Mainnet configuration
const zircuitMainnet = defineChain({
  id: 48900,
  name: 'Zircuit Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.zircuit.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zircuit Explorer',
      url: 'https://explorer.zircuit.com',
    },
  },
})

// Zircuit Testnet (Garfield) configuration
const zircuitTestnetConfig = defineChain({
  id: 48898,
  name: 'Zircuit Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://garfield-testnet.zircuit.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zircuit Testnet Explorer',
      url: 'https://explorer.zircuit.com',
    },
  },
})

export const config = getDefaultConfig({
  appName: 'Galactic Alpha',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, sepoliaWithAnkr, zircuitMainnet, zircuitTestnetConfig],
  ssr: true, // Enable SSR support for Next.js
})

