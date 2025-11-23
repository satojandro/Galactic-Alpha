"use client"

import { useEffect, useState } from "react"

export function StarTrails() {
  const [trails, setTrails] = useState<Array<{ id: number; delay: number }>>([])

  useEffect(() => {
    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      const newTrail = {
        id: Date.now(),
        delay: Math.random() * 2,
      }
      setTrails((prev) => [...prev, newTrail])

      // Remove trail after animation completes
      setTimeout(() => {
        setTrails((prev) => prev.filter((t) => t.id !== newTrail.id))
      }, 3000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-star-trail"
          style={{
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 50}%`,
            animationDelay: `${trail.delay}s`,
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(167, 139, 250, 0.6)",
          }}
        />
      ))}
    </div>
  )
}
