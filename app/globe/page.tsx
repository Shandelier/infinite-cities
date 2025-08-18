'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface Point {
  lat: number
  lng: number
  size: number
  color: string
}

export default function GlobePage() {
  const [showPopup, setShowPopup] = useState(false)

  const pointsData: Point[] = [
    { lat: 52.2297, lng: 21.0122, size: 0.5, color: 'orange' }
  ]

  const handlePointClick = () => {
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        onPointClick={handlePointClick}
      />
      {showPopup && (
        <div
          onClick={closePopup}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '300px',
              textAlign: 'center',
            }}
          >
            <h2>Warsaw</h2>
            <p>Mockup content goes here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
