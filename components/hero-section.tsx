"use client"

import { Button } from "@/components/ui/button"
import { StarTrails } from "@/components/star-trails"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <StarTrails />

      {/* Logo/Brand */}
      <div className="mb-8 animate-float">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 backdrop-blur-sm">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-gradient-cosmic glow-text tracking-tight">
        GALACTIC
        <br />
        ALPHA
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl font-medium tracking-wide">DeFi Protocol</p>

      {/* Slogan */}
      <div className="relative mb-12 max-w-3xl">
        <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 font-medium leading-relaxed text-balance">
          Built During Mercury Retrograde.
          <br />
          <span className="text-primary">May Break.</span> <span className="text-secondary">Might Moon.</span>
        </p>
        <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full" />
      </div>

      <Link href="/vaults">
        <Button
          size="lg"
          className="group relative px-12 py-7 text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 animate-pulse-glow overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            Enter Terminal
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </Button>
      </Link>

      {/* Secondary Navigation Links */}
      <div className="mt-6 flex gap-4">
        <Link href="/vaults" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View Vaults
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/backtesting" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Astro Backtesting
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/mint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Mint Identity
        </Link>
      </div>

      {/* Supporting Text */}
      <p className="mt-8 text-sm text-muted-foreground/70 max-w-md">
        Embrace the cosmic chaos. Navigate the stars. Transcend traditional finance.
      </p>

      {/* Mystical Stats */}
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-gradient-cosmic mb-2">∞</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Liquidity</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-gradient-cosmic mb-2">⟡</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">APY</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-gradient-cosmic mb-2">✧</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Aligned</div>
        </div>
      </div>
    </div>
  )
}
