"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from "wagmi"
import { parseEther, formatEther, formatUnits, maxUint256 } from "viem"
import { GALACTIC_VAULT_ABI, ERC20_ABI } from "@/lib/vault-abi"

/**
 * Custom hook for interacting with GalacticVault contract
 * 
 * This hook provides:
 * - Reading vault state (isOpen, TVL, user balance)
 * - Writing transactions (deposit, withdraw)
 * - Transaction status tracking
 * 
 * @param vaultAddress - The contract address of the vault
 */
export function useVault(vaultAddress: `0x${string}`) {
  const { address } = useAccount()

  // Read vault open status
  const { data: vaultOpen, refetch: refetchVaultOpen } = useReadContract({
    address: vaultAddress,
    abi: GALACTIC_VAULT_ABI,
    functionName: "vaultOpen",
  })

  // Read total assets (TVL)
  const { data: totalAssets, refetch: refetchTotalAssets } = useReadContract({
    address: vaultAddress,
    abi: GALACTIC_VAULT_ABI,
    functionName: "totalAssets",
  })

  // Read user's vault share balance
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: vaultAddress,
    abi: GALACTIC_VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Only query if user is connected
    },
  })

  // Read the asset token address from the vault
  const { data: assetAddress } = useReadContract({
    address: vaultAddress,
    abi: GALACTIC_VAULT_ABI,
    functionName: "asset",
  })

  // Read user's ETH balance
  const { data: ethBalance } = useBalance({
    address,
  })

  // Read user's token balance (if asset is a token)
  const { data: tokenBalance } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!assetAddress,
    },
  })

  // Read token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && assetAddress ? [address, vaultAddress] : undefined,
    query: {
      enabled: !!address && !!assetAddress,
    },
  })

  // Write contract hook for transactions
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Approve token spending for the vault
   */
  const approveToken = async () => {
    if (!address || !assetAddress) {
      throw new Error("Please connect your wallet")
    }

    writeContract({
      address: assetAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vaultAddress, maxUint256], // Approve max amount
    })
  }

  /**
   * Deposit assets into the vault
   * Note: ERC4626 vaults require token approvals before deposits
   * @param amount - Amount in token units (as string, e.g., "0.1")
   */
  const deposit = async (amount: string) => {
    if (!address) {
      throw new Error("Please connect your wallet")
    }
    if (!vaultOpen) {
      throw new Error("Vault is closed due to cosmic misalignment")
    }
    if (!assetAddress) {
      throw new Error("Vault asset not found")
    }

    const amountWei = parseEther(amount)

    // Check if approval is needed
    const currentAllowance = allowance ?? 0n
    if (currentAllowance < amountWei) {
      // First approve, then deposit (user will need to call deposit again after approval)
      await approveToken()
      return
    }

    writeContract({
      address: vaultAddress,
      abi: GALACTIC_VAULT_ABI,
      functionName: "deposit",
      args: [amountWei, address],
    })
  }

  /**
   * Withdraw assets from the vault
   * @param amount - Amount in ETH (as string, e.g., "0.1")
   */
  const withdraw = async (amount: string) => {
    if (!address) {
      throw new Error("Please connect your wallet")
    }
    if (!vaultOpen) {
      throw new Error("Vault is closed due to cosmic misalignment")
    }

    const amountWei = parseEther(amount)

    writeContract({
      address: vaultAddress,
      abi: GALACTIC_VAULT_ABI,
      functionName: "withdraw",
      args: [amountWei, address, address],
    })
  }

  // Format values for display
  const formattedTVL = totalAssets ? formatEther(totalAssets) : "0"
  const formattedUserBalance = userBalance ? formatEther(userBalance) : "0"
  const formattedEthBalance = ethBalance ? formatEther(ethBalance.value) : "0"
  const formattedTokenBalance = tokenBalance ? formatEther(tokenBalance) : "0"
  const needsApproval = allowance !== undefined && allowance < parseEther("0.01") // Check if approval needed

  return {
    // State
    vaultOpen: vaultOpen ?? false,
    tvl: formattedTVL,
    userBalance: formattedUserBalance,
    ethBalance: formattedEthBalance,
    tokenBalance: formattedTokenBalance,
    assetAddress: assetAddress as `0x${string}` | undefined,
    needsApproval,
    isConnected: !!address,
    address,

    // Transactions
    deposit,
    withdraw,
    approveToken,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,

    // Refetch functions
    refetch: () => {
      refetchVaultOpen()
      refetchTotalAssets()
      refetchUserBalance()
      refetchAllowance()
    },
  }
}

