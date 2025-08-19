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
  const [globeVisible, setGlobeVisible] = useState(false)

  const placeholderBefore = {
    src: '/images/urban/pawia.webp',
    alt: 'Placeholder before',
    label: 'Today',
  }
  const placeholderAfter = {
    src: '/images/urban/pawia-punk.webp',
    alt: 'Placeholder future',
    label: 'Future',
  }
  const cityImages: Record<string, { before: string; after?: string }> = {
    'New York, USA': {
      before: '/images/urban/newyork1.jpg',
      after: '/images/urban/newyork2.jpg',
    },
    'Paris, France': {
      before: '/images/urban/paris1.webp',
      after: '/images/urban/paris2.png',
    },
    'London, UK': {
      before: '/images/urban/london1.jpeg',
    },
    'Shanghai, China': {
      before: '/images/urban/shanghai-rails1.jpg',
      after: '/images/urban/shanghai-rails2.png',
    },
    'Tokyo, Japan': {
      before: '/images/urban/tokyo1.jpg',
    },
    'Singapore, Singapore': {
      before: '/images/urban/singapore1.jpg',
    },
    'São Paulo, Brazil': {
      before: '/images/urban/saopaulo1.jpeg',
    },
    'Mexico City, Mexico': {
      before: '/images/urban/mexico1.jpeg',
    },
    'Istanbul, Turkey': {
      before: '/images/urban/istanbul1.jpeg',
    },
    'Saint Petersburg, Russia': {
      before: '/images/urban/saintpetersburg1.jpg',
    },
    'Warsaw, Poland': {
      before: '/images/urban/warsaw1.jpeg',
    },
    'New Delhi, India': {
      before: '/images/urban/newdelhi1.jpg',
    },
    'Seoul, South Korea': {
      before: '/images/urban/seoul1.jpg',
    },
    'Sydney, Australia': {
      before: '/images/urban/sydney1.jpeg',
    },
    'Buenos Aires, Argentina': {
      before: '/images/urban/buenosaires1.jpg',
    },
    'Lisbon, Portugal': {
      before: '/images/urban/lisbon1.jpg',
    },
  }

  const baseLocations = [
    { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
    { name: 'Saint Petersburg, Russia', lat: 59.9311, lng: 30.3609 },
    { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708 },
    { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 },
    { name: 'New Delhi, India', lat: 28.6139, lng: 77.209 },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
    { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  ]

  const locations: LocationPoint[] = useMemo(
    () =>
      baseLocations.map((loc) => {
        const images = cityImages[loc.name]
        return {
          ...loc,
          size: 0.35,
          color: '#ffa500',
          beforeImage: images?.before
            ? { src: images.before, alt: `${loc.name} today`, label: 'Today' }
            : placeholderBefore,
          afterImage: images?.after
            ? { src: images.after, alt: `${loc.name} future`, label: 'Future' }
            : placeholderAfter,
        }
      }),
    [placeholderBefore, placeholderAfter]
  )

  const selectedLocation =
    selectedIndex !== null ? locations[selectedIndex] : null

  const isDesktop = viewport.width >= 1024
  const globeWidth = viewport.width

  const handlePrev = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + locations.length) % locations.length)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % locations.length)
  }

  useEffect(() => {
    setIsMounted(true)
    const computeViewport = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 800
      const height = typeof window !== 'undefined' ? window.innerHeight : 600
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
      globe.pointOfView({ lat: 30, lng: 10, altitude: 1.8 }, 4000)
      const controls = globe.controls()
      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.15
      }
      setGlobeVisible(true)
    }
    tryInit()
    return () => {
      canceled = true
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) return
    const globe = globeRef.current
    const controls = globe?.controls()
    if (!globe || !controls) return
    if (selectedLocation) {
      controls.autoRotate = false
      globe.pointOfView(
        { lat: selectedLocation.lat, lng: selectedLocation.lng, altitude: 1.2 },
        2000
      )
    } else {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.15
      globe.pointOfView({ lat: 30, lng: 10, altitude: 1.8 }, 2000)
    }
  }, [selectedLocation, isMounted])

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
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation()

  const cardContent = selectedLocation ? (
    <div
      style={{
        background: 'rgba(255,255,255,0.35)',
        color: '#264653',
        borderRadius: 20,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.4)',
        width: isDesktop ? '600px' : 'min(90vw, 700px)',
        maxWidth: isDesktop ? 600 : undefined,
        padding: 32,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 24, margin: 0 }}>{selectedLocation.name}</h2>
        <button
          onClick={() => setSelectedIndex(null)}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 26,
            lineHeight: 1,
            cursor: 'pointer',
            color: '#264653',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <ImageComparison
        beforeImage={selectedLocation.beforeImage}
        afterImage={selectedLocation.afterImage}
      />
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#264653',
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#264653',
              fontSize: 28,
              cursor: 'pointer',
            }}
            aria-label="Previous city"
          >
            ←
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>{selectedLocation.name}</div>
          <button
            onClick={handleNext}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#264653',
              fontSize: 28,
              cursor: 'pointer',
            }}
            aria-label="Next city"
          >
            →
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          {locations.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                margin: '0 4px',
                background:
                  idx === selectedIndex
                    ? '#264653'
                    : 'rgba(38,70,83,0.3)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: viewport.height,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s ease',
          transform: isDesktop && selectedLocation ? 'translateX(20%)' : 'none',
        }}
      >
        {isMounted && (
          <Suspense fallback={null}>
            <Globe
              ref={globeRef}
              width={globeWidth}
              height={viewport.height}
              style={{ opacity: globeVisible ? 1 : 0, transition: 'opacity 4s ease' }}
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
      {isDesktop && selectedLocation && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          {cardContent}
        </div>
      )}
      {!isDesktop && selectedLocation && (
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
          <div onClick={stopPropagation}>{cardContent}</div>
        </div>
      )}
    </div>
  )
}

