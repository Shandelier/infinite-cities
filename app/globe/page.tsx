'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface PopupData {
  title: string
  content: string
  lat: number
  lng: number
}

const warsawData = [
  {
    lat: 52.2297,
    lng: 21.0122,
    size: 0.8,
    color: '#ff4444',
    title: 'Warsaw, Poland',
    content: `
      <div class="popup-content">
        <h3>Warsaw - The Heart of Poland</h3>
        <p>Warsaw is the capital and largest city of Poland, located in the east-central part of the country. 
        With a population of over 1.7 million, it serves as the political, cultural, and economic center of Poland.</p>
        <p>The city has a rich history dating back to the 13th century and has been rebuilt multiple times, 
        most notably after World War II when it was almost completely destroyed.</p>
        <p>Today, Warsaw is a modern metropolis known for its vibrant cultural scene, historic Old Town 
        (a UNESCO World Heritage Site), and thriving business district.</p>
      </div>
    `
  }
]

export default function GlobePage() {
  const [selectedPoint, setSelectedPoint] = useState<PopupData | null>(null)
  const [isClient, setIsClient] = useState(false)
  const globeRef = useRef<any>()

  useEffect(() => {
    setIsClient(true)
    
    // Set initial globe rotation to show Europe/Warsaw
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 52.2297, lng: 21.0122, altitude: 2 })
    }
  }, [])

  const handlePointClick = (point: any) => {
    setSelectedPoint({
      title: point.title,
      content: point.content,
      lat: point.lat,
      lng: point.lng
    })
  }

  const closePopup = () => {
    setSelectedPoint(null)
  }

  // Don't render globe on server side
  if (!isClient) {
    return (
      <div className="globe-container loading">
        <div className="loading-message">Loading Globe...</div>
      </div>
    )
  }

  return (
    <div className="globe-page">
      <div className="globe-header">
        <h1>Interactive Globe</h1>
        <p>Click on Warsaw to see more information</p>
      </div>
      
      <div className="globe-container">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={warsawData}
          pointAltitude={0.02}
          pointRadius={0.8}
          pointColor={(d: any) => d.color}
          onPointClick={handlePointClick}
          pointLabel={(d: any) => `<div class="point-tooltip">${d.title}</div>`}
          width={typeof window !== 'undefined' ? window.innerWidth : 800}
          height={typeof window !== 'undefined' ? window.innerHeight - 100 : 600}
          animateIn={true}
        />
      </div>

      {/* Popup Overlay */}
      {selectedPoint && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              ×
            </button>
            <div 
              dangerouslySetInnerHTML={{ __html: selectedPoint.content }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .globe-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          position: relative;
          overflow: hidden;
        }

        .globe-header {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .globe-header h1 {
          font-size: 2.5rem;
          font-weight: 600;
          margin: 0 0 10px 0;
          font-family: 'Inter', sans-serif;
        }

        .globe-header p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
        }

        .globe-container {
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .globe-container.loading {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .loading-message {
          color: white;
          font-size: 1.5rem;
          font-weight: 500;
          text-align: center;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .popup-modal {
          background: white;
          border-radius: 16px;
          padding: 30px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          margin: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: popupSlideIn 0.3s ease-out;
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .popup-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        :global(.popup-content h3) {
          color: #2a5298;
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          font-family: 'Inter', sans-serif;
        }

        :global(.popup-content p) {
          color: #333;
          line-height: 1.6;
          margin: 0 0 15px 0;
          font-size: 1rem;
        }

        :global(.point-tooltip) {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .globe-header {
            position: relative;
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
          }

          .globe-header h1 {
            font-size: 2rem;
          }

          .popup-modal {
            margin: 10px;
            padding: 20px;
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  )
}