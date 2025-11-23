"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"
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

// Mock price data with timestamps
const generatePriceData = (token: string) => {
  const basePrice = token === "SOL" ? 100 : token === "ETH" ? 2000 : 30000
  const data = []
  for (let i = 0; i < 90; i++) {
    const variance = Math.sin(i / 5) * 0.15 + Math.random() * 0.1
    data.push({
      date: `Day ${i + 1}`,
      price: basePrice * (1 + variance),
      timestamp: i,
    })
  }
  return data
}

// Astrological events with poetic descriptions
const astroEvents = [
  {
    type: "fullMoon",
    timestamp: 15,
    symbol: "🌕",
    color: "#60A5FA",
    name: "Full Moon in Pisces",
    description: "This moon saw $SOL soar 14%. Dreamers and believers united.",
  },
  {
    type: "retrograde",
    timestamp: 28,
    symbol: "☿",
    color: "#FCD34D",
    name: "Mercury Retrograde Begins",
    description: "Communications broke down. So did resistance. $ETH dumped 8%.",
  },
  {
    type: "fullMoon",
    timestamp: 45,
    symbol: "🌕",
    color: "#60A5FA",
    name: "Full Moon in Virgo",
    description: "The harvest moon blessed holders. Portfolio +22% overnight.",
  },
  {
    type: "newMoon",
    timestamp: 52,
    symbol: "🌑",
    color: "#94A3B8",
    name: "New Moon Intentions",
    description: "In darkness, seeds were planted. Price consolidated, waiting.",
  },
  {
    type: "eclipse",
    timestamp: 67,
    symbol: "🌘",
    color: "#F87171",
    name: "Solar Eclipse",
    description: "The sun vanished. Panic sold. Smart money accumulated.",
  },
  {
    type: "conjunction",
    timestamp: 78,
    symbol: "♃",
    color: "#C084FC",
    name: "Jupiter-Venus Conjunction",
    description: "Luck and beauty aligned. Markets euphoric. ATH incoming.",
  },
]

const CustomDot = (props: any) => {
  const { cx, cy, payload, hoveredEvent } = props
  const event = astroEvents.find((e) => e.timestamp === payload.timestamp)

  if (!event) return null

  const isHovered = hoveredEvent?.timestamp === event.timestamp

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 12 : 8}
        fill={event.color}
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
        {event.symbol}
      </text>
      {isHovered && (
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={event.color} strokeWidth={2} opacity={0.5}>
          <animate attributeName="r" from="16" to="24" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

const CustomTooltip = ({ active, payload, hoveredEvent }: any) => {
  if (!active || !payload || !payload[0]) return null

  const event = astroEvents.find((e) => e.timestamp === payload[0].payload.timestamp)

  if (!event) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{payload[0].payload.date}</p>
        <p className="text-lg font-bold text-primary">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }

  return (
    <div
      className="bg-card/95 backdrop-blur-xl border-2 rounded-lg p-4 shadow-2xl max-w-xs"
      style={{ borderColor: event.color }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">{event.symbol}</span>
        <div>
          <p className="text-sm font-bold" style={{ color: event.color }}>
            {event.name}
          </p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
        </div>
      </div>
      <p className="text-lg font-bold text-primary mb-2">${payload[0].value.toFixed(2)}</p>
      <p className="text-sm text-foreground/80 italic text-pretty">{event.description}</p>
    </div>
  )
}

export function AstroChart({ token, enabledEvents }: AstroChartProps) {
  const [hoveredEvent, setHoveredEvent] = useState<any>(null)
  const priceData = generatePriceData(token)

  const filteredEvents = astroEvents.filter((event) => {
    if (event.type === "fullMoon") return enabledEvents.fullMoon
    if (event.type === "newMoon") return enabledEvents.newMoon
    if (event.type === "retrograde") return enabledEvents.retrograde
    if (event.type === "eclipse") return enabledEvents.eclipse
    if (event.type === "conjunction") return enabledEvents.conjunction
    return false
  })

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">{token} Price vs Cosmic Events</h2>
        <p className="text-sm text-muted-foreground">Hover over celestial markers for mystical insights</p>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={(e: any) => {
              if (e && e.activePayload) {
                const event = astroEvents.find((ev) => ev.timestamp === e.activePayload[0].payload.timestamp)
                if (event) {
                  setHoveredEvent(event)
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
            <XAxis dataKey="date" stroke="oklch(0.65 0.05 265)" tick={{ fontSize: 12 }} interval={14} />
            <YAxis
              stroke="oklch(0.65 0.05 265)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip hoveredEvent={hoveredEvent} />} />

            {/* Vertical lines for events */}
            {filteredEvents.map((event) => (
              <ReferenceLine
                key={event.timestamp}
                x={`Day ${event.timestamp + 1}`}
                stroke={event.color}
                strokeDasharray="3 3"
                strokeWidth={2}
                opacity={hoveredEvent?.timestamp === event.timestamp ? 1 : 0.4}
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
            <span className="text-sm text-muted-foreground">Full Moon</span>
          </div>
        )}
        {enabledEvents.newMoon && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#94A3B8" }} />
            <span className="text-sm text-muted-foreground">New Moon</span>
          </div>
        )}
        {enabledEvents.retrograde && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FCD34D" }} />
            <span className="text-sm text-muted-foreground">Retrograde</span>
          </div>
        )}
        {enabledEvents.eclipse && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F87171" }} />
            <span className="text-sm text-muted-foreground">Eclipse</span>
          </div>
        )}
        {enabledEvents.conjunction && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#C084FC" }} />
            <span className="text-sm text-muted-foreground">Conjunction</span>
          </div>
        )}
      </div>
    </Card>
  )
}
