'use client'

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { GlobeMethods } from 'react-globe.gl'
import ImageComparison from './components/ImageComparison'

const Globe = React.lazy(() => import('react-globe.gl'))

interface LocationPoint {
  lat: number
  lng: number
  size?: number
  color?: string
  name: string
  beforeImage: { src: string; alt: string; label: string }
  afterImage: { src: string; alt: string; label: string }
}

export default function Home() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const locations: LocationPoint[] = useMemo(() => {
    const placeholderPairs = [
      {
        before: { src: '/images/urban/pawia.webp', alt: 'City today', label: 'Today' },
        after: { src: '/images/urban/pawia-punk.webp', alt: 'City solarpunk', label: 'Solarpunk' },
      },
      {
        before: { src: '/images/urban/eifel.webp', alt: 'City today', label: 'Today' },
        after: { src: '/images/urban/eifel2.png', alt: 'City solarpunk', label: 'Solarpunk' },
      },
      {
        before: { src: '/images/urban/bellagio.png', alt: 'City today', label: 'Today' },
        after: { src: '/images/urban/bellagio2.png', alt: 'City solarpunk', label: 'Solarpunk' },
      },
      {
        before: { src: '/images/urban/vegas1.jpg', alt: 'City today', label: 'Today' },
        after: { src: '/images/urban/vegas2.png', alt: 'City solarpunk', label: 'Solarpunk' },
      },
    ]

    const cities = [
      { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
      { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
      { name: 'Barcelona, Spain', lat: 41.3874, lng: 2.1686 },
      { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
      { name: 'Tokyo, Japan', lat: 35.6895, lng: 139.6917 },
      { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198 },
      { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
      { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
      { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
      { name: 'Saint Petersburg, Russia', lat: 59.9343, lng: 30.3351 },
      { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708 },
      { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
      { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 },
      { name: 'New Delhi, India', lat: 28.6139, lng: 77.209 },
      { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
      { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
      { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
      { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
      { name: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5417 },
    ]

    return cities.map((city, i) => {
      const pair = placeholderPairs[i % placeholderPairs.length]
      return {
        ...city,
        size: 0.35,
        color: '#ffa500',
        beforeImage: pair.before,
        afterImage: pair.after,
      }
    })
  }, [])

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
    if (!isMounted) return
    let canceled = false
    const tryInit = () => {
      if (canceled) return
      const globe = globeRef.current
      if (!globe) {
        requestAnimationFrame(tryInit)
        return
      }
      globe.pointOfView({ lat: 30, lng: 10, altitude: 2.2 }, 1500)
      const controls = globe.controls()
      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.35
      }
    }
    tryInit()
    return () => {
      canceled = true
    }
  }, [isMounted])

  // Add semi-transparent clouds layer
  useEffect(() => {
    if (!isMounted) return
    let canceled = false
    let animationFrameId = 0
    let cloudsMesh: THREE.Mesh | null = null
    const CLOUDS_IMG_URL = '/fair_clouds_4k.png'
    const CLOUDS_ALT = 0.02
    const CLOUDS_ROTATION_SPEED = -0.006 // deg/frame

    const initClouds = () => {
      if (canceled) return
      const globe = globeRef.current
      if (!globe) {
        requestAnimationFrame(initClouds)
        return
      }
      const loader = new THREE.TextureLoader()
      loader.load(CLOUDS_IMG_URL, (cloudsTexture) => {
        cloudsTexture.colorSpace = THREE.SRGBColorSpace
        cloudsMesh = new THREE.Mesh(
          new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true, depthWrite: false })
        )
        globe.scene().add(cloudsMesh)

        const rotateClouds = () => {
          if (canceled) return
          if (cloudsMesh) {
            cloudsMesh.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180
          }
          animationFrameId = requestAnimationFrame(rotateClouds)
        }
        rotateClouds()
      })
    }
    initClouds()

    return () => {
      canceled = true
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      const globe = globeRef.current
      if (cloudsMesh && globe) {
        try {
          globe.scene().remove(cloudsMesh)
        } catch {}
      }
    }
  }, [isMounted])

  const handleBackgroundClick = () => setSelectedIndex(null)

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: '100%', height: viewport.height }}>
        {isMounted && (
          <Suspense fallback={null}>
            <Globe
              ref={globeRef}
              width={viewport.width}
              height={viewport.height}
              backgroundColor="rgba(0, 0, 0, 0)"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              htmlElementsData={locations}
              htmlLat={(p: any) => (p as LocationPoint).lat}
              htmlLng={(p: any) => (p as LocationPoint).lng}
              htmlAltitude={() => 0.01}
              htmlElement={(p: any) => {
                const el = document.createElement('div')
                const color = (p as LocationPoint).color || '#ffa500'
                el.className = 'globe-marker'
                el.innerHTML = `<div class="pulse-dot" style="--dot-color:${color}"></div><div class="label">${(p as LocationPoint).name}</div>`
                el.style.pointerEvents = 'auto'
                el.onclick = () => setSelectedIndex(locations.indexOf(p as LocationPoint))
                return el
              }}
            />
          </Suspense>
        )}
      </div>

      {selectedIndex !== null && (
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
          <PopupCard
            locations={locations}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onPrev={() =>
              setSelectedIndex((selectedIndex! - 1 + locations.length) % locations.length)
            }
            onNext={() => setSelectedIndex((selectedIndex! + 1) % locations.length)}
            onSelect={setSelectedIndex}
          />
        </div>
      )}
    </div>
  )
}

interface PopupCardProps {
  locations: LocationPoint[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSelect: (idx: number) => void
}

function PopupCard({ locations, index, onClose, onPrev, onNext, onSelect }: PopupCardProps) {
  const total = locations.length
  const location = locations[index]
  const prevName = locations[(index - 1 + total) % total].name
  const nextName = locations[(index + 1) % total].name
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'rgba(255,255,255,0.25)',
        color: '#e0f7ff',
        borderRadius: 16,
        boxShadow: '0 10px 40px rgba(0,255,242,0.2)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        width: 'min(90vw, 800px)',
        padding: 32,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>{location.name}</h2>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 24,
            lineHeight: 1,
            cursor: 'pointer',
            color: '#fff',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <ImageComparison beforeImage={location.beforeImage} afterImage={location.afterImage} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <button
          onClick={onPrev}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>←</span>
          <span>{prevName}</span>
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              onClick={() => onSelect(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === index ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>{nextName}</span>
          <span style={{ fontSize: 24 }}>→</span>
        </button>
      </div>
    </div>
  )
}

