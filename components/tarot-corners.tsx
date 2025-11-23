"use client"

export function TarotCorners() {
  return (
    <>
      {/* Top Left - The Moon */}
      <div className="fixed top-8 left-8 opacity-20 hover:opacity-40 transition-opacity duration-500">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18" fill="currentColor" fillOpacity="0.3" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 15c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" />
        </svg>
      </div>

      {/* Top Right - The Star */}
      <div className="fixed top-8 right-8 opacity-20 hover:opacity-40 transition-opacity duration-500">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-secondary"
        >
          <path d="M12 2l2.5 7.5H22l-6 5 2.5 7.5L12 17l-6.5 5 2.5-7.5-6-5h7.5z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Bottom Left - The Sun */}
      <div className="fixed bottom-8 left-8 opacity-20 hover:opacity-40 transition-opacity duration-500">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-secondary"
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </div>

      {/* Bottom Right - The Wheel */}
      <div className="fixed bottom-8 right-8 opacity-20 hover:opacity-40 transition-opacity duration-500 animate-rotate">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83" />
        </svg>
      </div>
    </>
  )
}
