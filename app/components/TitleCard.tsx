'use client'

import { useEffect, useState } from 'react'

export default function TitleCard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the animation slightly for a nice entrance effect
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`title-card ${isVisible ? 'visible' : ''}`}>
      <div className="title-card-content">
        <h1 className="main-title">Infinite Cities</h1>
        <p className="main-subtitle">How cities feel when energy is abundant and materials grow like plants?</p>
        <div className="title-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-line"></div>
        </div>
      </div>
    </div>
  )
}
