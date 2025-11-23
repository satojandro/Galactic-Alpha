"use client"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AstroChart } from "@/components/astro-chart"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function BacktestingPage() {
  const [selectedToken, setSelectedToken] = useState("SOL")
  const [enabledEvents, setEnabledEvents] = useState({
    fullMoon: true,
    newMoon: true,
    retrograde: true,
    eclipse: false,
    conjunction: false,
  })

  const handleEventToggle = (event: string) => {
    setEnabledEvents((prev) => ({
      ...prev,
      [event]: !prev[event as keyof typeof prev],
    }))
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10 p-8">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Home
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/vaults" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Vaults
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/mint" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Mint Identity
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Cosmic Data Active</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-cosmic glow-text mb-2">Celestial Backtesting</h1>
          <p className="text-muted-foreground">
            Discover if the stars truly align with your trades. Or if it's all just cosmic cope.
          </p>
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Left control panel */}
          <Card className="w-80 p-6 bg-card/50 backdrop-blur-xl border-border/50 shrink-0">
            <div className="space-y-6">
              {/* Token selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Token Selection</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">
                      <span className="flex items-center gap-2">
                        <span>☉</span> Solana (SOL)
                      </span>
                    </SelectItem>
                    <SelectItem value="ETH">
                      <span className="flex items-center gap-2">
                        <span>⊕</span> Ethereum (ETH)
                      </span>
                    </SelectItem>
                    <SelectItem value="BTC">
                      <span className="flex items-center gap-2">
                        <span>♃</span> Bitcoin (BTC)
                      </span>
                    </SelectItem>
                    <SelectItem value="AVAX">
                      <span className="flex items-center gap-2">
                        <span>❄</span> Avalanche (AVAX)
                      </span>
                    </SelectItem>
                    <SelectItem value="MATIC">
                      <span className="flex items-center gap-2">
                        <span>♁</span> Polygon (MATIC)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border/30" />

              {/* Astrological event toggles */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Celestial Events</Label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌕</span>
                      <Label htmlFor="fullMoon" className="cursor-pointer text-sm font-medium text-blue-200">
                        Full Moon
                      </Label>
                    </div>
                    <Switch
                      id="fullMoon"
                      checked={enabledEvents.fullMoon}
                      onCheckedChange={() => handleEventToggle("fullMoon")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-500/10 border border-slate-500/30 hover:bg-slate-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌑</span>
                      <Label htmlFor="newMoon" className="cursor-pointer text-sm font-medium text-slate-200">
                        New Moon
                      </Label>
                    </div>
                    <Switch
                      id="newMoon"
                      checked={enabledEvents.newMoon}
                      onCheckedChange={() => handleEventToggle("newMoon")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">☿</span>
                      <Label htmlFor="retrograde" className="cursor-pointer text-sm font-medium text-amber-200">
                        Mercury Retrograde
                      </Label>
                    </div>
                    <Switch
                      id="retrograde"
                      checked={enabledEvents.retrograde}
                      onCheckedChange={() => handleEventToggle("retrograde")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌘</span>
                      <Label htmlFor="eclipse" className="cursor-pointer text-sm font-medium text-red-200">
                        Solar Eclipse
                      </Label>
                    </div>
                    <Switch
                      id="eclipse"
                      checked={enabledEvents.eclipse}
                      onCheckedChange={() => handleEventToggle("eclipse")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">♃</span>
                      <Label htmlFor="conjunction" className="cursor-pointer text-sm font-medium text-purple-200">
                        Planetary Conjunctions
                      </Label>
                    </div>
                    <Switch
                      id="conjunction"
                      checked={enabledEvents.conjunction}
                      onCheckedChange={() => handleEventToggle("conjunction")}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Run alignment button */}
              <Button
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 
                  hover:from-purple-500 hover:via-pink-500 hover:to-purple-500
                  text-white font-bold py-6 text-lg
                  border-2 border-purple-400/50
                  shadow-[0_0_30px_rgba(168,85,247,0.4)]
                  hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]
                  transition-all duration-300
                  relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-2xl">✨</span>
                  Run Alignment Test
                  <span className="text-2xl">✨</span>
                </span>
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </Button>

              {/* Stats panel */}
              <div className="space-y-3 pt-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Total Events</div>
                  <div className="text-2xl font-bold text-foreground">247</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Correlation Score</div>
                  <div className="text-2xl font-bold text-primary">0.42</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Best Performer</div>
                  <div className="text-lg font-bold text-secondary">Full Moon +14%</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main chart area */}
          <div className="flex-1">
            <AstroChart token={selectedToken} enabledEvents={enabledEvents} />
          </div>
        </div>
      </div>
    </main>
  )
}
