"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface AstroChartProps {
  token: string
  enabledEvents: {
    fullMoon: boolean
    newMoon: boolean
    retrograde: boolean
    eclipse: boolean
    conjunction: boolean
  }
}

// Interface for the enriched swap data from the JSON file
interface EnrichedSwapData {
  block: number
  txHash: string
  price: string
  volume: string
  astro: {
    moon_phase: string
    mercury_retrograde: boolean
    jupiter_mars_conjunction: boolean
    astro_rating: string
  }
}

// Interface for chart data points
interface ChartDataPoint {
  block: number
  price: number
  volume: number
  astro: EnrichedSwapData["astro"]
  eventType?: string
  eventSymbol?: string
  eventColor?: string
}

// Helper function to get event details based on astro data
function getEventDetails(astro: EnrichedSwapData["astro"]) {
  if (astro.moon_phase === "Full Moon") {
    return {
      type: "fullMoon",
      symbol: "🌕",
      color: "#60A5FA",
      name: "Full Moon",
    }
  }
  if (astro.moon_phase === "New Moon") {
    return {
      type: "newMoon",
      symbol: "🌑",
      color: "#94A3B8",
      name: "New Moon",
    }
  }
  if (astro.mercury_retrograde) {
    return {
      type: "retrograde",
      symbol: "☿",
      color: "#FCD34D",
      name: "Mercury Retrograde",
    }
  }
  if (astro.jupiter_mars_conjunction) {
    return {
      type: "conjunction",
      symbol: "♃",
      color: "#C084FC",
      name: "Jupiter-Mars Conjunction",
    }
  }
  return null
}

// Custom dot component that shows astrological event markers
const CustomDot = (props: any) => {
  const { cx, cy, payload, hoveredEvent } = props
  // Only show dots for data points that have astrological events
  if (!payload.eventType || !payload.eventSymbol) return null

  const isHovered = hoveredEvent?.block === payload.block

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 12 : 8}
        fill={payload.eventColor}
        opacity={0.8}
        className="transition-all duration-300"
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isHovered ? 18 : 14}
        className="transition-all duration-300"
      >
        {payload.eventSymbol}
      </text>
      {isHovered && (
        <circle
          cx={cx}
          cy={cy}
          r={16}
          fill="none"
          stroke={payload.eventColor}
          strokeWidth={2}
          opacity={0.5}
        >
          <animate attributeName="r" from="16" to="24" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

// Custom tooltip that displays price and astrological information
const CustomTooltip = ({ active, payload, hoveredEvent }: any) => {
  if (!active || !payload || !payload[0]) return null

  const dataPoint = payload[0].payload as ChartDataPoint
  const eventDetails = dataPoint.eventType ? getEventDetails(dataPoint.astro) : null

  // If there's an astrological event, show enhanced tooltip
  if (eventDetails) {
    return (
      <div
        className="bg-card/95 backdrop-blur-xl border-2 rounded-lg p-4 shadow-2xl max-w-xs"
        style={{ borderColor: eventDetails.color }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{eventDetails.symbol}</span>
          <div>
            <p className="text-sm font-bold" style={{ color: eventDetails.color }}>
              {eventDetails.name}
            </p>
            <p className="text-xs text-muted-foreground">Block {dataPoint.block}</p>
          </div>
        </div>
        <p className="text-lg font-bold text-primary mb-2">${dataPoint.price.toFixed(2)}</p>
        <p className="text-sm text-foreground/80 mb-1">
          <span className="font-medium">Volume:</span> ${dataPoint.volume.toLocaleString()}
        </p>
        <p className="text-sm text-foreground/80 italic text-pretty">{dataPoint.astro.astro_rating}</p>
      </div>
    )
  }

  // Default tooltip for non-event data points
  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium">Block {dataPoint.block}</p>
      <p className="text-lg font-bold text-primary">${dataPoint.price.toFixed(2)}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Volume: ${dataPoint.volume.toLocaleString()}
      </p>
    </div>
  )
}

export function AstroChart({ token, enabledEvents }: AstroChartProps) {
  const [hoveredEvent, setHoveredEvent] = useState<ChartDataPoint | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch and process the data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        // Fetch the enriched swap data from the public folder
        const response = await fetch("/data/swap_astro_joined.json")
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`)
        }
        const rawData: EnrichedSwapData[] = await response.json()

        // Filter data based on enabled events
        const filtered = rawData.filter((d) => {
          // Check if this data point matches any enabled event
          if (enabledEvents.fullMoon && d.astro.moon_phase === "Full Moon") return true
          if (enabledEvents.newMoon && d.astro.moon_phase === "New Moon") return true
          if (enabledEvents.retrograde && d.astro.mercury_retrograde) return true
          if (enabledEvents.conjunction && d.astro.jupiter_mars_conjunction) return true
          // Also include all data points (even without events) so we can see the full price chart
          // But mark which ones have events
          return true
        })

        // Transform data for the chart
        const transformed: ChartDataPoint[] = filtered.map((entry) => {
          const eventDetails = getEventDetails(entry.astro)
          return {
            block: entry.block,
            price: parseFloat(entry.price),
            volume: parseFloat(entry.volume),
            astro: entry.astro,
            eventType: eventDetails?.type,
            eventSymbol: eventDetails?.symbol,
            eventColor: eventDetails?.color,
          }
        })

        // Sort by block number to ensure chronological order
        transformed.sort((a, b) => a.block - b.block)

        setChartData(transformed)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        console.error("Error loading astro data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [enabledEvents]) // Reload when enabledEvents changes

  // Get filtered events for reference lines (only show markers for enabled events)
  const filteredEvents = chartData.filter((point) => {
    if (!point.eventType) return false
    if (point.eventType === "fullMoon") return enabledEvents.fullMoon
    if (point.eventType === "newMoon") return enabledEvents.newMoon
    if (point.eventType === "retrograde") return enabledEvents.retrograde
    if (point.eventType === "conjunction") return enabledEvents.conjunction
    return false
  })

  // Show loading state
  if (loading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">{token} Price vs Cosmic Events</h2>
          <p className="text-sm text-muted-foreground">Loading celestial data...</p>
        </div>
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Consulting the stars...</p>
          </div>
        </div>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">{token} Price vs Cosmic Events</h2>
        </div>
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-2">⚠️ Failed to load data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Make sure swap_astro_joined.json exists in /public/data/
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">{token} Price vs Cosmic Events</h2>
        <p className="text-sm text-muted-foreground">
          Hover over celestial markers for mystical insights • {chartData.length} data points
        </p>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={(e: any) => {
              if (e && e.activePayload) {
                const dataPoint = e.activePayload[0].payload as ChartDataPoint
                if (dataPoint.eventType) {
                  setHoveredEvent(dataPoint)
                } else {
                  setHoveredEvent(null)
                }
              }
            }}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.2 280)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.75 0.2 280)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.04 265)" opacity={0.3} />
            <XAxis
              dataKey="block"
              stroke="oklch(0.65 0.05 265)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: "Block Number", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="oklch(0.65 0.05 265)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              label={{ value: "Price (USD)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip hoveredEvent={hoveredEvent} />} />

            {/* Vertical reference lines for astrological events */}
            {filteredEvents.map((event, index) => (
              <ReferenceLine
                key={`${event.block}-${index}`}
                x={event.block}
                stroke={event.eventColor || "#60A5FA"}
                strokeDasharray="3 3"
                strokeWidth={2}
                opacity={hoveredEvent?.block === event.block ? 1 : 0.4}
              />
            ))}

            <Line
              type="monotone"
              dataKey="price"
              stroke="oklch(0.75 0.2 280)"
              strokeWidth={3}
              fill="url(#colorPrice)"
              dot={(props) => <CustomDot {...props} hoveredEvent={hoveredEvent} />}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {enabledEvents.fullMoon && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#60A5FA" }} />
            <span className="text-sm text-muted-foreground">Full Moon 🌕</span>
          </div>
        )}
        {enabledEvents.newMoon && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#94A3B8" }} />
            <span className="text-sm text-muted-foreground">New Moon 🌑</span>
          </div>
        )}
        {enabledEvents.retrograde && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FCD34D" }} />
            <span className="text-sm text-muted-foreground">Mercury Retrograde ☿</span>
          </div>
        )}
        {enabledEvents.conjunction && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#C084FC" }} />
            <span className="text-sm text-muted-foreground">Jupiter-Mars Conjunction ♃</span>
          </div>
        )}
      </div>
    </Card>
  )
}
