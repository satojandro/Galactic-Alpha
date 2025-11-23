"use client"

export function Constellations() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Constellation 1 - Top Left */}
      <svg
        className="absolute top-20 left-20 w-64 h-64 opacity-30 animate-float"
        style={{ animationDelay: "0s" }}
        viewBox="0 0 200 200"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Lines */}
        <line x1="40" y1="40" x2="80" y2="60" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="80" y1="60" x2="120" y2="50" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="120" y1="50" x2="140" y2="90" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="80" y1="60" x2="90" y2="110" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="90" y1="110" x2="140" y2="90" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        {/* Stars */}
        <circle cx="40" cy="40" r="3" fill="rgba(167, 139, 250, 0.8)" filter="url(#glow)" className="animate-twinkle" />
        <circle
          cx="80"
          cy="60"
          r="4"
          fill="rgba(234, 179, 8, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          cx="120"
          cy="50"
          r="3"
          fill="rgba(167, 139, 250, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "1s" }}
        />
        <circle
          cx="140"
          cy="90"
          r="5"
          fill="rgba(234, 179, 8, 0.9)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "1.5s" }}
        />
        <circle
          cx="90"
          cy="110"
          r="3"
          fill="rgba(167, 139, 250, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "2s" }}
        />
      </svg>

      {/* Constellation 2 - Top Right */}
      <svg
        className="absolute top-32 right-32 w-56 h-56 opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
        viewBox="0 0 200 200"
      >
        {/* Lines */}
        <line x1="60" y1="30" x2="100" y2="70" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
        <line x1="100" y1="70" x2="140" y2="60" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
        <line x1="100" y1="70" x2="110" y2="120" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
        <line x1="110" y1="120" x2="150" y2="130" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
        {/* Stars */}
        <circle cx="60" cy="30" r="3" fill="rgba(234, 179, 8, 0.8)" filter="url(#glow)" className="animate-twinkle" />
        <circle
          cx="100"
          cy="70"
          r="5"
          fill="rgba(167, 139, 250, 0.9)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "0.7s" }}
        />
        <circle
          cx="140"
          cy="60"
          r="3"
          fill="rgba(234, 179, 8, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "1.2s" }}
        />
        <circle
          cx="110"
          cy="120"
          r="4"
          fill="rgba(167, 139, 250, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "1.8s" }}
        />
        <circle
          cx="150"
          cy="130"
          r="3"
          fill="rgba(234, 179, 8, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "2.3s" }}
        />
      </svg>

      {/* Constellation 3 - Bottom */}
      <svg
        className="absolute bottom-32 left-1/2 -translate-x-1/2 w-72 h-72 opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
        viewBox="0 0 200 200"
      >
        {/* Lines forming a mystical pattern */}
        <line x1="100" y1="40" x2="70" y2="90" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="100" y1="40" x2="130" y2="90" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="70" y1="90" x2="100" y2="140" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="130" y1="90" x2="100" y2="140" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
        {/* Stars */}
        <circle cx="100" cy="40" r="4" fill="rgba(234, 179, 8, 0.9)" filter="url(#glow)" className="animate-twinkle" />
        <circle
          cx="70"
          cy="90"
          r="3"
          fill="rgba(167, 139, 250, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "0.8s" }}
        />
        <circle
          cx="130"
          cy="90"
          r="3"
          fill="rgba(167, 139, 250, 0.8)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "1.6s" }}
        />
        <circle
          cx="100"
          cy="140"
          r="5"
          fill="rgba(234, 179, 8, 0.9)"
          filter="url(#glow)"
          className="animate-twinkle"
          style={{ animationDelay: "2.4s" }}
        />
      </svg>
    </div>
  )
}
