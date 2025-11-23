/**
 * Helper script to approve an ENS operator
 * 
 * This script allows the owner of galacticalpha.eth to approve
 * another address (like a contract or app) to create subnames.
 * 
 * Usage:
 * 1. Set OPERATOR_ADDRESS in the script
 * 2. Connect the wallet that owns galacticalpha.eth
 * 3. Run: npx tsx scripts/approve-ens-operator.ts
 */

import { createWalletClient, custom, getAddress, type Abi } from 'viem'
import { sepolia, mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'

// ⚙️ CONFIGURATION - Set the operator address you want to approve
const OPERATOR_ADDRESS = '0x0000000000000000000000000000000000000000' // ⬅️ CHANGE THIS
const CHAIN_ID: 1 | 11155111 = 11155111 // Sepolia (use 1 for mainnet)

// NameWrapper contract addresses
const NAME_WRAPPER_ADDRESSES = {
  1: getAddress('0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401'), // Mainnet
  11155111: getAddress('0x0635513f179D50A207757E05759CbD106d7dFcE8'), // Sepolia
} as const

// ERC-1155 setApprovalForAll ABI
const NAME_WRAPPER_ABI: Abi = [
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

async function approveOperator() {
  if (typeof window === 'undefined') {
    console.error('This script must be run in a browser environment with a wallet extension.')
    console.log('\nTo use this script:')
    console.log('1. Import it in a browser console or Next.js page')
    console.log('2. Or use the approveSubnameOperator function from lib/ens-utils.ts')
    return
  }

  if (!window.ethereum) {
    throw new Error('No wallet found. Please install MetaMask or another wallet extension.')
  }

  const chain = CHAIN_ID === 1 ? mainnet : sepolia
  const nameWrapperAddress = NAME_WRAPPER_ADDRESSES[CHAIN_ID as keyof typeof NAME_WRAPPER_ADDRESSES]

  if (!nameWrapperAddress) {
    throw new Error(`Unsupported chain ID: ${CHAIN_ID}`)
  }

  if (OPERATOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error('Please set OPERATOR_ADDRESS in the script first!')
  }

  const walletClient = createWalletClient({
    chain: addEnsContracts(chain),
    transport: custom(window.ethereum),
  })

  const [account] = await walletClient.getAddresses()
  if (!account) {
    throw new Error('Please connect your wallet first.')
  }

  console.log(`\n🔐 Approving operator for ENS NameWrapper`)
  console.log(`Chain: ${CHAIN_ID === 1 ? 'Mainnet' : 'Sepolia'}`)
  console.log(`NameWrapper: ${nameWrapperAddress}`)
  console.log(`Your address: ${account}`)
  console.log(`Operator address: ${OPERATOR_ADDRESS}`)
  console.log(`\n⚠️  This will allow the operator to create subnames under galacticalpha.eth\n`)

  try {
    const txHash = await walletClient.writeContract({
      address: nameWrapperAddress,
      abi: NAME_WRAPPER_ABI,
      functionName: 'setApprovalForAll',
      args: [getAddress(OPERATOR_ADDRESS), true],
      account,
    })

    console.log(`✅ Transaction sent: ${txHash}`)
    const explorerUrl = CHAIN_ID === 1
      ? `https://etherscan.io/tx/${txHash}`
      : `https://sepolia.etherscan.io/tx/${txHash}`
    console.log(`View on explorer: ${explorerUrl}`)
    
    return txHash
  } catch (error) {
    console.error('❌ Error approving operator:', error)
    throw error
  }
}

// Export for use in browser console or Next.js
if (typeof window !== 'undefined') {
  ;(window as any).approveEnsOperator = approveOperator
}

export { approveOperator }

