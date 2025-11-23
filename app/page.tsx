import { CosmicBackground } from "@/components/cosmic-background"
import { TarotCorners } from "@/components/tarot-corners"
import { Constellations } from "@/components/constellations"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cosmic background with stars and planets */}
      <CosmicBackground />

      {/* Animated constellations */}
      <Constellations />

      {/* Tarot glyphs in corners */}
      <TarotCorners />

      {/* Main hero content */}
      <HeroSection />
    </main>
  )
}
