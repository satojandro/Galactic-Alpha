/**
 * ENS Contract Configuration
 * 
 * Update these addresses after deploying the GalacticSubnameRegistrar contract
 */

export const ENS_CONTRACT_CONFIG = {
  // Sepolia Testnet
  11155111: {
    nameWrapper: '0x0635513f179D50A207757E05759CbD106d7dFcE8' as `0x${string}`,
    subnameRegistrar: '0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825' as `0x${string}`, // ✅ Deployed on Sepolia
  },
  // Ethereum Mainnet
  1: {
    nameWrapper: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401' as `0x${string}`,
    subnameRegistrar: '0x0000000000000000000000000000000000000000' as `0x${string}`, // ⬅️ UPDATE AFTER DEPLOYMENT
  },
} as const

/**
 * Get the subname registrar address for a given chain
 */
export function getSubnameRegistrarAddress(chainId: number): `0x${string}` | null {
  const config = ENS_CONTRACT_CONFIG[chainId as keyof typeof ENS_CONTRACT_CONFIG]
  if (!config) {
    return null
  }
  
  // Return null if not set (0x0 address)
  if (config.subnameRegistrar === '0x0000000000000000000000000000000000000000') {
    return null
  }
  
  return config.subnameRegistrar
}

/**
 * Check if contract is configured for a chain
 */
export function isContractConfigured(chainId: number): boolean {
  return getSubnameRegistrarAddress(chainId) !== null
}

