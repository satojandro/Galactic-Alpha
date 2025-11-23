"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"]

const celestialPrefixes = [
  "mars",
  "venus",
  "mercury",
  "jupiter",
  "saturn",
  "neptune",
  "uranus",
  "pluto",
  "luna",
  "sol",
  "nova",
  "cosmic",
]

const celestialSuffixes = [
  "dreamer",
  "echo",
  "seeker",
  "wanderer",
  "voyager",
  "oracle",
  "mystic",
  "keeper",
  "walker",
  "sage",
  "harbinger",
  "dancer",
]

const mysticQuotes = [
  "The stars aligned to reveal your true essence",
  "Written in the cosmic tapestry of time",
  "A name whispered by the universe itself",
  "Born from stardust, claimed by destiny",
  "The celestial archive has spoken",
  "Your identity, forged in the void between worlds",
]

export function ZodiacMinter() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [stellarName, setStellarName] = useState("")
  const [mysticQuote, setMysticQuote] = useState("")

  const handleReveal = () => {
    setIsSpinning(true)
    setRevealed(false)

    // Generate random stellar name
    const prefix = celestialPrefixes[Math.floor(Math.random() * celestialPrefixes.length)]
    const suffix = celestialSuffixes[Math.floor(Math.random() * celestialSuffixes.length)]
    const name = `${prefix}-${suffix}.eth`

    // Select random quote
    const quote = mysticQuotes[Math.floor(Math.random() * mysticQuotes.length)]

    // Simulate spinning animation
    setTimeout(() => {
      setIsSpinning(false)
      setStellarName(name)
      setMysticQuote(quote)
      setRevealed(true)
    }, 3000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {!revealed ? (
        <Card className="relative bg-card/40 backdrop-blur-xl border-2 border-primary/20 p-8 md:p-12 overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Zodiac Wheel */}
          <div className="relative flex items-center justify-center mb-12">
            <div
              className={`relative w-80 h-80 rounded-full border-2 border-primary/30 ${
                isSpinning ? "animate-spin" : ""
              } transition-all duration-1000`}
              style={isSpinning ? { animationDuration: "3s" } : {}}
            >
              {/* Center glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-2xl animate-pulse" />

              {/* Zodiac signs around the wheel */}
              {zodiacSigns.map((sign, index) => {
                const angle = (index * 360) / zodiacSigns.length
                const radius = 140
                const x = radius * Math.cos((angle * Math.PI) / 180)
                const y = radius * Math.sin((angle * Math.PI) / 180)

                return (
                  <div
                    key={index}
                    className="absolute text-4xl"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <span className="text-primary/70 glow-text">{sign}</span>
                  </div>
                )
              })}

              {/* Center symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-gradient-cosmic glow-text">✦</div>
              </div>
            </div>
          </div>

          {/* Reveal Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleReveal}
              disabled={isSpinning}
              className="group relative px-10 py-6 text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSpinning ? "Consulting the Stars..." : "Reveal Your Stellar Name"}
                {!isSpinning && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                  </svg>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </Button>
          </div>

          {/* Stardust trails */}
          {isSpinning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-40 bg-gradient-to-b from-primary/50 to-transparent blur-sm"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: "star-trail 2s linear infinite",
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card className="relative bg-card/40 backdrop-blur-xl border-2 border-primary/20 p-8 md:p-12 overflow-hidden">
          {/* Starburst background animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-t from-primary/30 to-transparent origin-bottom animate-pulse"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              )
            })}
          </div>

          {/* Revealed Name */}
          <div className="relative z-10 text-center space-y-8">
            <div className="animate-float">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/40 backdrop-blur-sm mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path
                    d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-gradient-cosmic glow-text tracking-tight">
              {stellarName}
            </h2>

            <p className="text-lg md:text-xl text-foreground/80 italic max-w-xl mx-auto text-balance">{mysticQuote}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-bold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Mint Identity
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setRevealed(false)}
                className="px-8 py-6 text-base border-primary/30 hover:bg-primary/10"
              >
                Seek Another Name
              </Button>
            </div>

            {/* Constellation particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full animate-twinkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
