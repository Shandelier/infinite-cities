'use client'

import { useState, MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false }) as any

export default function GlobePage() {
  const [showPopup, setShowPopup] = useState(false)

  const points = [{ lat: 52.2297, lng: 21.0122, size: 0.5 }]

  const handlePointClick = () => setShowPopup(true)
  const hidePopup = () => setShowPopup(false)
  const stopPropagation = (e: MouseEvent) => e.stopPropagation()

  return (
    <div className={styles.globePage}>
      <div className={styles.globeCanvas}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          pointsData={points}
          pointAltitude={0.1}
          pointColor={() => '#ff5722'}
          onPointClick={handlePointClick}
        />
      </div>
      {showPopup && (
        <div className={styles.popupOverlay} onClick={hidePopup}>
          <div className={styles.popupContent} onClick={stopPropagation}>
            <h2>Warsaw</h2>
            <p>Mockup information about Warsaw.</p>
          </div>
        </div>
      )}
    </div>
  )
}
