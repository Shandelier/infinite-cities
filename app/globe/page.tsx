'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamically import react-globe.gl to disable SSR
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface PointData {
  lat: number
  lng: number
  size: number
}

export default function GlobePage() {
  const [showPopup, setShowPopup] = useState(false)

  const warsaw: PointData[] = [
    { lat: 52.2297, lng: 21.0122, size: 0.5 }
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={warsaw}
        pointAltitude={0.01}
        pointColor={() => 'orange'}
        pointRadius={0.5}
        onPointClick={() => setShowPopup(true)}
      />

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}
          >
            <h2>Warsaw</h2>
            <p>Mockup text for Warsaw.</p>
          </div>
        </div>
      )}
    </div>
  )
}

