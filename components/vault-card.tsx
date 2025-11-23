"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface VaultCardProps {
  vault: {
    id: string
    name: string
    symbol: string
    apy: string
    tvl: string
    condition: string
    color: string
    description: string
    riskLevel: string
  }
  index: number
}

const colorThemes = {
  silver: {
    bg: "from-slate-500/20 via-slate-400/10 to-slate-600/20",
    border: "border-slate-400/30",
    text: "text-slate-200",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(148,163,184,0.8)]",
  },
  blue: {
    bg: "from-blue-500/20 via-cyan-400/10 to-blue-600/20",
    border: "border-blue-400/30",
    text: "text-blue-200",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]",
  },
  gold: {
    bg: "from-yellow-500/20 via-amber-400/10 to-yellow-600/20",
    border: "border-yellow-400/30",
    text: "text-yellow-200",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]",
  },
  rose: {
    bg: "from-pink-500/20 via-rose-400/10 to-pink-600/20",
    border: "border-pink-400/30",
    text: "text-pink-200",
    glow: "shadow-[0_0_20px_rgba(244,114,182,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]",
  },
  red: {
    bg: "from-red-500/20 via-orange-500/10 to-red-600/20",
    border: "border-red-400/30",
    text: "text-red-200",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]",
  },
  slate: {
    bg: "from-slate-600/20 via-gray-500/10 to-slate-700/20",
    border: "border-slate-500/30",
    text: "text-slate-300",
    glow: "shadow-[0_0_20px_rgba(100,116,139,0.3)]",
    symbolGlow: "drop-shadow-[0_0_10px_rgba(100,116,139,0.8)]",
  },
}

const riskColors = {
  "Very Low": "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
  Low: "bg-green-500/20 text-green-200 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
  High: "bg-orange-500/20 text-orange-200 border-orange-500/30",
  Extreme: "bg-red-500/20 text-red-200 border-red-500/30",
  Degen: "bg-purple-500/20 text-purple-200 border-purple-500/30",
}

export function VaultCard({ vault, index }: VaultCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = colorThemes[vault.color as keyof typeof colorThemes]
  const riskColor = riskColors[vault.riskLevel as keyof typeof riskColors]

  return (
    <Card
      className={`relative overflow-hidden border-2 ${theme.border} ${theme.glow} 
        bg-gradient-to-br ${theme.bg} backdrop-blur-sm
        transition-all duration-300 hover:scale-105 hover:-translate-y-1
        cursor-pointer group`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 animate-shimmer" />
      </div>

      {/* Floating orbs in background */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-xl animate-float" />
      <div
        className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative p-6 space-y-6">
        {/* Header with symbol */}
        <div className="flex items-start justify-between">
          <div
            className={`text-6xl ${theme.symbolGlow} transition-all duration-300 ${
              isHovered ? "scale-110 rotate-12" : ""
            }`}
          >
            {vault.symbol}
          </div>
          <Badge variant="outline" className={`${riskColor} text-xs font-mono`}>
            {vault.riskLevel}
          </Badge>
        </div>

        {/* Vault name */}
        <div>
          <h3 className={`font-sans text-xl font-bold ${theme.text} mb-2 text-balance`}>{vault.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{vault.description}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/30">
          <div>
            <div className="text-xs text-muted-foreground mb-1">APY</div>
            <div className={`text-2xl font-bold ${theme.text}`}>{vault.apy}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">TVL</div>
            <div className="text-2xl font-bold text-foreground">{vault.tvl}</div>
          </div>
        </div>

        {/* Activation condition */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Activation Condition</div>
          <div className={`text-sm font-medium ${theme.text} flex items-center gap-2`}>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            {vault.condition}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button className={`flex-1 bg-gradient-to-r ${theme.bg} ${theme.border} border hover:opacity-80`}>
            Deposit
          </Button>
          <Button variant="outline" size="icon" className={theme.border}>
            <span className="text-lg">{vault.symbol}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
