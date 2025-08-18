'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface WarsawPoint {
  lat: number
  lng: number
  size?: number
  color?: string
  name?: string
}

export default function GlobePage() {
  const globeRef = useRef<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const warsawPoint: WarsawPoint = useMemo(
    () => ({ lat: 52.2297, lng: 21.0122, size: 0.35, color: '#ff8c00', name: 'Warsaw' }),
    []
  )

  const pointsData = useMemo(() => [warsawPoint], [warsawPoint])

  useEffect(() => {
    setIsMounted(true)
    const computeViewport = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 800
      const height = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.7) : 600
      setViewport({ width, height })
    }
    computeViewport()
    window.addEventListener('resize', computeViewport)
    return () => window.removeEventListener('resize', computeViewport)
  }, [])

  useEffect(() => {
    if (!isMounted || !globeRef.current) return
    globeRef.current.pointOfView({ lat: 30, lng: 10, altitude: 2.2 }, 1500)
  }, [isMounted])

  const handleBackgroundClick = () => setIsModalOpen(false)
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation()

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: '100%', height: viewport.height }}>
        {isMounted && (
          <Globe
            ref={globeRef}
            width={viewport.width}
            height={viewport.height}
            backgroundColor="rgba(0, 0, 0, 0)"
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            pointsData={pointsData}
            pointAltitude={(p) => ((p as WarsawPoint).name === 'Warsaw' ? 0.12 : 0.05)}
            pointColor={(p) => (p as WarsawPoint).color || '#ff8c00'}
            pointRadius={(p) => (p as WarsawPoint).size || 0.3}
            onPointClick={() => setIsModalOpen(true)}
          />
        )}
      </div>

      {isModalOpen && (
        <div
          onClick={handleBackgroundClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={stopPropagation}
            style={{
              background: 'white',
              color: '#111',
              borderRadius: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              width: 'min(90vw, 560px)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 20, margin: 0 }}>Warsaw</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 22,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p style={{ marginTop: 0 }}>
              This is a placeholder popup overlay for Warsaw. You can replace this text with any content
              such as statistics, images, or interactive UI elements.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

