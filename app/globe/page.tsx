'use client'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Script from 'next/script'

if (typeof window !== 'undefined') {
  // Expose React and ReactDOM for the UMD build loaded via script tag
  ;(window as any).React = React
  ;(window as any).ReactDOM = ReactDOM
}

export default function GlobePage() {
  const [GlobeComponent, setGlobeComponent] = useState<any>(null)
  const [showPopup, setShowPopup] = useState(false)

  const points = [{ lat: 52.2297, lng: 21.0122 }]

  return (
    <div className="globe-container">
      <Script
        src="//cdn.jsdelivr.net/npm/react-globe.gl"
        strategy="afterInteractive"
        onLoad={() => setGlobeComponent(() => (window as any).Globe)}
      />

      {GlobeComponent && (
        <GlobeComponent
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          pointsData={points}
          pointAltitude={0.1}
          pointColor={() => '#f1c40f'}
          onPointClick={() => setShowPopup(true)}
        />
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Warsaw</h2>
            <p>This is a mockup popup for Warsaw.</p>
          </div>
        </div>
      )}
    </div>
  )
}

