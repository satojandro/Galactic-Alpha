"use client"

import { CosmicBackground } from "@/components/cosmic-background"
import { TarotCorners } from "@/components/tarot-corners"
import { ZodiacMinter } from "@/components/zodiac-minter"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

export default function MintPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cosmic background */}
      <CosmicBackground />

      {/* Tarot glyphs in corners */}
      <TarotCorners />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Terminal
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/vaults" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Vaults
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/backtesting" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Backtesting
            </Link>
          </div>
          {/* Wallet connect button */}
          <ConnectButton
            showBalance={false}
            accountStatus="address"
            chainStatus="icon"
          />
        </div>

        {/* Title Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-sans text-5xl md:text-7xl font-bold text-gradient-cosmic glow-text tracking-tight">
            Stellar Identity
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-balance">
            The cosmos speaks through names. Discover your celestial ENS subname aligned with the stars.
          </p>
        </div>

        {/* Zodiac Minter Component */}
        <ZodiacMinter />

        {/* Mystical Note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            ✧ Names are generated through cosmic algorithms. Each identity is unique and eternal. ✧
          </p>
        </div>
      </div>
    </main>
  )
}
