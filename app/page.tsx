"use client"

import { CosmicBackground } from "@/components/cosmic-background"
import { TarotCorners } from "@/components/tarot-corners"
import { Constellations } from "@/components/constellations"
import { HeroSection } from "@/components/hero-section"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cosmic background with stars and planets */}
      <CosmicBackground />

      {/* Animated constellations */}
      <Constellations />

      {/* Tarot glyphs in corners */}
      <TarotCorners />

      {/* Wallet connect button - top right */}
      <div className="fixed top-4 right-4 z-50">
        <ConnectButton
          showBalance={false}
          accountStatus="address"
          chainStatus="icon"
        />
      </div>

      {/* Main hero content */}
      <HeroSection />
    </main>
  )
}
