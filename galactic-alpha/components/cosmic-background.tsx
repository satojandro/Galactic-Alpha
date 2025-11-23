"use client"

import { useEffect, useRef } from "react"

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Star field
    const stars: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      opacity: number
      twinkleSpeed: number
    }> = []

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      })
    }

    // Planets
    const planets: Array<{
      x: number
      y: number
      radius: number
      color: string
      vx: number
      vy: number
      rotation: number
    }> = [
      {
        x: canvas.width * 0.15,
        y: canvas.height * 0.3,
        radius: 40,
        color: "rgba(167, 139, 250, 0.3)",
        vx: 0.1,
        vy: 0.05,
        rotation: 0,
      },
      {
        x: canvas.width * 0.85,
        y: canvas.height * 0.7,
        radius: 30,
        color: "rgba(234, 179, 8, 0.2)",
        vx: -0.08,
        vy: -0.04,
        rotation: 0,
      },
    ]

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.fillStyle = "rgba(15, 17, 30, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update stars
      stars.forEach((star) => {
        star.x += star.vx
        star.y += star.vy

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // Twinkle effect
        star.opacity += star.twinkleSpeed
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw and update planets
      planets.forEach((planet) => {
        planet.x += planet.vx
        planet.y += planet.vy
        planet.rotation += 0.002

        // Bounce off edges
        if (planet.x - planet.radius < 0 || planet.x + planet.radius > canvas.width) {
          planet.vx *= -1
        }
        if (planet.y - planet.radius < 0 || planet.y + planet.radius > canvas.height) {
          planet.vy *= -1
        }

        // Draw planet with glow
        const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 2)
        gradient.addColorStop(0, planet.color)
        gradient.addColorStop(0.5, planet.color.replace("0.3)", "0.1)").replace("0.2)", "0.05)"))
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Draw planet core
        ctx.fillStyle = planet.color
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.12 0.03 265) 0%, oklch(0.08 0.02 265) 100%)" }}
    />
  )
}
