import { CosmicBackground } from "@/components/cosmic-background"
import { TarotCorners } from "@/components/tarot-corners"
import { VaultGrid } from "@/components/vault-grid"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

export default function VaultsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cosmic background */}
      <CosmicBackground />

      {/* Tarot glyphs in corners */}
      <TarotCorners />

      {/* Main dashboard content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to Terminal
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/backtesting" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Backtesting
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/mint" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Mint Identity
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Live Astrological Data</span>
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-sans text-5xl md:text-7xl font-bold text-gradient-cosmic glow-text tracking-tight">
            Celestial Vaults
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Yield strategies aligned with cosmic forces. Each vault activates based on planetary movements.
          </p>
        </div>

        {/* Vault Cards Grid */}
        <VaultGrid />

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            ⚠️ Astrological activation conditions are satirical. All vaults are always active. Not financial or
            astrological advice. Built during Mercury Retrograde. May break. Might moon.
          </p>
        </div>
      </div>
    </main>
  )
}
