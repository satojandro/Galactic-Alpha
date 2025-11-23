import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// 🚨 TEMPORARY FIX: Hardcoded working RPC URL
const SEPOLIA_RPC_URL = 'https://rpc2.sepolia.org'
console.log('🔍 Using Sepolia RPC:', SEPOLIA_RPC_URL)

const sepoliaWithRPC = defineChain({
  ...sepolia,
  rpcUrls: {
    default: {
      http: [SEPOLIA_RPC_URL],
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
  chains: [mainnet, sepoliaWithRPC, zircuitMainnet, zircuitTestnetConfig],
  ssr: true, // Enable SSR support for Next.js
})

