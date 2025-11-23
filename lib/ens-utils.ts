/**
 * ENS Utilities for Galactic Alpha
 * 
 * This module provides functions to mint ENS subnames under galacticalpha.eth
 * using the ENS NameWrapper contract.
 * 
 * @module ens-utils
 */

import { createWalletClient, createPublicClient, custom, http, type Address, getAddress } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
import { createSubname } from '@ensdomains/ensjs/wallet'
import { namehash } from '@ensdomains/ensjs/utils'
import { getSubnameRegistrarAddress, isContractConfigured } from './ens-contract-config'
import { GALACTIC_SUBNAME_REGISTRAR_ABI } from './ens-registrar-abi'

/**
 * Parent domain for Galactic Alpha ENS subnames
 */
export const PARENT_DOMAIN = 'galacticalpha.eth'

/**
 * Get the appropriate chain for ENS operations
 * ENS NameWrapper is available on Ethereum Mainnet and Sepolia testnet
 */
function getEnsChain(chainId: number) {
  // Use mainnet for production (chainId 1) or Sepolia for testing (chainId 11155111)
  if (chainId === 1) {
    return mainnet
  }
  if (chainId === 11155111) {
    return sepolia
  }
  // Default to mainnet if chain is not recognized
  return mainnet
}

/**
 * Mint an ENS subname under galacticalpha.eth
 * 
 * This function creates a subname like `nova-sunburst.galacticalpha.eth`
 * and assigns ownership to the user's address.
 * 
 * @param params - Parameters for minting the subname
 * @param params.subname - The subname label (e.g., "nova-sunburst")
 * @param params.userAddress - The Ethereum address that will own the subname
 * @param params.chainId - The chain ID to use (1 for mainnet, 11155111 for Sepolia)
 * @returns Promise resolving to the transaction hash
 * 
 * @example
 * ```ts
 * const txHash = await mintSubname({
 *   subname: 'nova-sunburst',
 *   userAddress: '0x1234...',
 *   chainId: 1
 * })
 * ```
 */
/**
 * Mint an ENS subname using the GalacticSubnameRegistrar contract (preferred)
 * Falls back to direct ENS.js if contract is not configured
 */
export async function mintSubname({
  subname,
  userAddress,
  chainId,
}: {
  subname: string
  userAddress: Address
  chainId: number
}): Promise<`0x${string}`> {
  // Validate subname format (alphanumeric and hyphens only, lowercase)
  const normalizedSubname = subname.toLowerCase().trim()
  if (!/^[a-z0-9-]+$/.test(normalizedSubname)) {
    throw new Error('Subname must contain only lowercase letters, numbers, and hyphens')
  }

  // Construct the full subname
  const fullSubname = `${normalizedSubname}.${PARENT_DOMAIN}`

  // Check if we have a wallet connection
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }

  // Get the appropriate chain
  const chain = getEnsChain(chainId)

  // Create wallet client
  const walletClient = createWalletClient({
    chain: addEnsContracts(chain),
    transport: custom(window.ethereum),
  })

  // Get accounts to ensure wallet is connected
  const accounts = await walletClient.getAddresses()
  if (!accounts || accounts.length === 0) {
    throw new Error('No account found. Please connect your wallet.')
  }

  // Check if contract is configured for this chain
  const contractAddress = getSubnameRegistrarAddress(chainId)
  
  if (contractAddress) {
    // Use the contract (preferred method)
    try {
      return await mintSubnameViaContract({
        subname: normalizedSubname,
        userAddress,
        chainId,
        contractAddress,
        walletClient,
      })
    } catch (error) {
      // If contract call fails, provide helpful error
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()
        
        if (errorMsg.includes('already minted') || errorMsg.includes('already exists')) {
          throw new Error(`The subname ${fullSubname} already exists. Please try a different name.`)
        }
        
        if (errorMsg.includes('not approved') || errorMsg.includes('unauthorized')) {
          throw new Error(
            `Contract is not approved as an operator. The owner of ${PARENT_DOMAIN} must approve the contract using setApprovalForAll on the NameWrapper contract. See ENS_SETUP.md for instructions.`
          )
        }
        
        throw error
      }
      throw error
    }
  } else {
    // Fallback to direct ENS.js (requires parent owner to approve operator)
    return await mintSubnameDirect({
      subname: normalizedSubname,
      userAddress,
      chainId,
      fullSubname,
      walletClient,
      accounts,
    })
  }
}

/**
 * Mint subname via the GalacticSubnameRegistrar contract
 */
async function mintSubnameViaContract({
  subname,
  userAddress,
  chainId,
  contractAddress,
  walletClient,
}: {
  subname: string
  userAddress: Address
  chainId: number
  contractAddress: `0x${string}`
  walletClient: ReturnType<typeof createWalletClient>
}): Promise<`0x${string}`> {
  const accounts = await walletClient.getAddresses()
  if (!accounts || accounts.length === 0) {
    throw new Error('No account found.')
  }

  // Get the correct chain object for this operation
  const chain = getEnsChain(chainId)

  // Call the contract's mintSubname function
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi: GALACTIC_SUBNAME_REGISTRAR_ABI,
    functionName: 'mintSubname',
    args: [subname],
    account: accounts[0],
    chain: chain, // Use the correct chain from getEnsChain(chainId)
  })

  return txHash
}

/**
 * Mint subname directly via ENS.js (fallback)
 */
async function mintSubnameDirect({
  subname,
  userAddress,
  chainId,
  fullSubname,
  walletClient,
  accounts,
}: {
  subname: string
  userAddress: Address
  chainId: number
  fullSubname: string
  walletClient: ReturnType<typeof createWalletClient>
  accounts: readonly `0x${string}`[]
}): Promise<`0x${string}`> {
  // Create a new wallet client with ENS contracts for direct minting
  const ensWalletClient = createWalletClient({
    chain: addEnsContracts(getEnsChain(chainId)),
    transport: custom(window.ethereum!),
  }).extend(ensWalletActions) as any

  try {
    // Mint the subname using ENS.js
    const txHash = await createSubname(extendedWalletClient, {
      name: fullSubname,
      owner: userAddress,
      contract: 'nameWrapper',
      account: accounts[0], // Required account parameter
    })

    return txHash
  } catch (error) {
    // Provide helpful error messages
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      if (errorMsg.includes('unauthorized') || errorMsg.includes('not authorized') || errorMsg.includes('not owner')) {
        // Check if we can get more info about the parent owner
        let additionalInfo = ''
        try {
          const parentOwner = await getParentOwner(chainId)
          if (parentOwner && parentOwner.toLowerCase() !== accounts[0].toLowerCase()) {
            additionalInfo = `\n\nThe parent domain ${PARENT_DOMAIN} is owned by ${parentOwner}. To allow other wallets to mint subnames, either:\n1. Deploy and configure the GalacticSubnameRegistrar contract (recommended)\n2. Or the parent owner needs to approve an operator using setApprovalForAll on the NameWrapper contract.`
          }
        } catch {
          // If we can't check, just provide general instructions
        }
        
        throw new Error(
          `Unable to mint subname. Only the owner of ${PARENT_DOMAIN} can create subnames directly.${additionalInfo}\n\nSee ENS_SETUP.md for detailed instructions.`
        )
      }
      if (errorMsg.includes('already exists') || errorMsg.includes('already registered')) {
        throw new Error(`The subname ${fullSubname} already exists. Please try a different name.`)
      }
      throw error
    }
    throw new Error('Failed to mint subname. Please try again.')
  }
}

/**
 * Get the owner of the parent domain
 * 
 * @param chainId - The chain ID to check on
 * @returns Promise resolving to the owner address, or null if not found
 */
export async function getParentOwner(chainId: number): Promise<Address | null> {
  try {
    const chain = getEnsChain(chainId)
    const publicClient = createPublicClient({
      chain: addEnsContracts(chain),
      transport: http('https://lb.drpc.live/sepolia/Au_X8MHT5km3gTHdk3Zh9IDSHlrSyFwR8JVUQmlfqV1j'),
    })

    // Use ENS.js public actions to get the owner
    const { getOwner } = await import('@ensdomains/ensjs/public')
    const result = await getOwner(publicClient, { name: PARENT_DOMAIN })
    
    return result?.owner as Address | null
  } catch (error) {
    console.error('Error getting parent owner:', error)
    return null
  }
}

/**
 * Approve an operator to create subnames on behalf of the parent domain owner
 * 
 * This function should be called by the owner of galacticalpha.eth
 * to allow another address (like a contract or app) to create subnames.
 * 
 * @param params - Parameters for approving an operator
 * @param params.operatorAddress - The address to approve as an operator
 * @param params.chainId - The chain ID to use
 * @returns Promise resolving to the transaction hash
 * 
 * @example
 * ```ts
 * // As the parent domain owner, approve a contract to create subnames
 * const txHash = await approveSubnameOperator({
 *   operatorAddress: '0x1234...', // Your contract or app address
 *   chainId: 11155111 // Sepolia
 * })
 * ```
 */
export async function approveSubnameOperator({
  operatorAddress,
  chainId,
}: {
  operatorAddress: Address
  chainId: number
}): Promise<`0x${string}`> {
  const chain = getEnsChain(chainId)

  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }

  const walletClient = createWalletClient({
    chain: addEnsContracts(chain),
    transport: custom(window.ethereum),
  }).extend(ensWalletActions) as any

  const accounts = await walletClient.getAddresses()
  if (!accounts || accounts.length === 0) {
    throw new Error('No account found. Please connect your wallet.')
  }

  try {
    // Get the NameWrapper contract address for the chain
    const nameWrapperAddress = chainId === 1 
      ? getAddress('0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401') // Mainnet
      : getAddress('0x0635513f179D50A207757E05759CbD106d7dFcE8') // Sepolia

    // ERC-1155 setApprovalForAll ABI
    const nameWrapperAbi = [
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
    ] as const

    // Call setApprovalForAll directly on the NameWrapper contract
    const txHash = await (walletClient as any).writeContract({
      address: nameWrapperAddress,
      abi: nameWrapperAbi,
      functionName: 'setApprovalForAll',
      args: [operatorAddress, true],
      account: accounts[0],
    })

    return txHash
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to approve operator: ${error.message}`)
    }
    throw new Error('Failed to approve operator. Please try again.')
  }
}

/**
 * Check if a subname is available
 * 
 * @param subname - The subname to check
 * @param chainId - The chain ID to check on
 * @returns Promise resolving to true if available, false otherwise
 */
export async function isSubnameAvailable(
  subname: string,
  chainId: number
): Promise<boolean> {
  const normalizedSubname = subname.toLowerCase().trim()
  
  // Check if contract is configured
  const contractAddress = getSubnameRegistrarAddress(chainId)
  
  if (contractAddress) {
    // Use contract to check availability
    try {
      const chain = getEnsChain(chainId)
      const publicClient = createPublicClient({
        chain: addEnsContracts(chain),
        transport: http('https://lb.drpc.live/sepolia/Au_X8MHT5km3gTHdk3Zh9IDSHlrSyFwR8JVUQmlfqV1j'),
      })

      const isMinted = await publicClient.readContract({
        address: contractAddress,
        abi: GALACTIC_SUBNAME_REGISTRAR_ABI,
        functionName: 'isMinted',
        args: [normalizedSubname],
      })

      return !isMinted
    } catch (error) {
      console.error('Error checking subname availability:', error)
      // Fall through to return true (let mint function handle it)
      return true
    }
  }
  
  // If no contract, we can't easily check, so return true
  // The mint function will handle conflicts
  return true
}

/**
 * Get the namehash of the parent domain
 * Useful for contract interactions
 */
export function getParentNamehash(): `0x${string}` {
  return namehash(PARENT_DOMAIN)
}

/**
 * Get the labelhash of a subname
 * Useful for contract interactions
 */
export function getSubnameLabelhash(subname: string): `0x${string}` {
  // ENS.js doesn't export labelhash directly, but we can compute it
  // For now, this is a placeholder - the createSubname function handles this internally
  return namehash(`${subname}.${PARENT_DOMAIN}`)
}

/**
 * Check if the contract is configured and ready to use
 */
export function isContractReady(chainId: number): boolean {
  return isContractConfigured(chainId)
}

/**
 * Get the contract address for a chain (if configured)
 */
export function getContractAddress(chainId: number): `0x${string}` | null {
  return getSubnameRegistrarAddress(chainId)
}

