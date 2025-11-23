"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVault } from "@/hooks/useVault"
import { Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react"
import { formatEther, parseEther } from "viem"

interface VaultDialogProps {
  vaultAddress: `0x${string}`
  vaultName: string
  vaultSymbol: string
  isOpen: boolean
  onClose: () => void
  mode: "deposit" | "withdraw"
}

export function VaultDialog({ vaultAddress, vaultName, vaultSymbol, isOpen, onClose, mode }: VaultDialogProps) {
  const [amount, setAmount] = useState("")
  const vault = useVault(vaultAddress)

  // Reset amount when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setAmount("")
    }
  }, [isOpen])

  // Close dialog on successful transaction
  useEffect(() => {
    if (vault.isConfirmed) {
      setTimeout(() => {
        onClose()
        vault.refetch()
      }, 2000)
    }
  }, [vault.isConfirmed, onClose, vault])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    try {
      if (mode === "deposit") {
        await vault.deposit(amount)
      } else {
        await vault.withdraw(amount)
      }
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  const handleMax = () => {
    if (mode === "deposit") {
      // Use 90% of token balance (or ETH if no token) to leave some for gas
      const balance = vault.tokenBalance || vault.ethBalance
      const maxAmount = parseFloat(balance) * 0.9
      setAmount(maxAmount.toFixed(6))
    } else {
      setAmount(vault.userBalance)
    }
  }

  const isDisabled = !vault.vaultOpen || vault.isPending || vault.isConfirming || !amount || parseFloat(amount) <= 0
  const isLoading = vault.isPending || vault.isConfirming

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <span className="text-3xl">{vaultSymbol}</span>
            <span>{mode === "deposit" ? "Deposit" : "Withdraw"}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "deposit"
              ? `Add ETH to ${vaultName} vault`
              : `Redeem your shares from ${vaultName} vault`}
          </DialogDescription>
        </DialogHeader>

        {/* Vault Status */}
        {!vault.vaultOpen && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Vault is closed due to cosmic misalignment</span>
          </div>
        )}

        {/* Success Message */}
        {vault.isConfirmed && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Transaction confirmed! ✨</span>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
              <Sparkles className="w-6 h-6 absolute -top-1 -right-1 animate-pulse text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              {vault.isPending ? "Confirming transaction..." : "Waiting for confirmation..."}
            </p>
          </div>
        )}

        {/* Form */}
        {!isLoading && !vault.isConfirmed && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!vault.vaultOpen}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleMax} disabled={!vault.vaultOpen}>
                  Max
                </Button>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {mode === "deposit" ? "Balance:" : "Shares:"}{" "}
                  {mode === "deposit" ? (vault.tokenBalance || vault.ethBalance) : vault.userBalance} ETH
                </span>
                <span>TVL: {parseFloat(vault.tvl).toFixed(4)} ETH</span>
              </div>
              
              {/* Approval notice */}
              {mode === "deposit" && vault.needsApproval && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 text-xs">
                  <span>⚠️</span>
                  <span>Token approval required before deposit</span>
                </div>
              )}
            </div>

            {mode === "deposit" && vault.needsApproval ? (
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                onClick={async () => {
                  try {
                    await vault.approveToken()
                  } catch (error) {
                    console.error("Approval error:", error)
                  }
                }}
                disabled={vault.isPending || vault.isConfirming}
              >
                {vault.isPending ? "Approving..." : "Approve Token"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isDisabled}
              >
                {mode === "deposit" ? "Deposit" : "Withdraw"}
              </Button>
            )}

            {vault.error && (
              <p className="text-sm text-red-400 text-center">
                {vault.error.message || "Transaction failed"}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

