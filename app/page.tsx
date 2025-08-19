'use client'

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { GlobeMethods } from 'react-globe.gl'
import ImageComparison from './components/ImageComparison'

const Globe = React.lazy(() => import('react-globe.gl'))

interface LocationPoint {
  lat: number
  lng: number
  color?: string
  name: string
  beforeImage: { src: string; alt: string; label: string }
  afterImage: { src: string; alt: string; label: string }
}

export default function Home() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null)
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const locations: LocationPoint[] = useMemo(
    () => [
      {
        name: 'Warsaw',
        lat: 52.2297,
        lng: 21.0122,
        color: '#ff8c00',
        beforeImage: { src: '/images/urban/pawia.webp', alt: 'Warsaw today', label: 'Today' },
        afterImage: { src: '/images/urban/pawia-punk.webp', alt: 'Warsaw solarpunk', label: 'Solarpunk' },
      },
      {
        name: 'Las Vegas - Strip',
        lat: 36.1147,
        lng: -115.1728,
        color: '#ff8c00',
        beforeImage: { src: '/images/urban/bellagio.png', alt: 'Las Vegas strip', label: 'Today' },
        afterImage: { src: '/images/urban/bellagio2.png', alt: 'Las Vegas strip solarpunk', label: 'Solarpunk' },
      },
      {
        name: 'Las Vegas - Downtown',
        lat: 36.1699,
        lng: -115.1398,
        color: '#ff8c00',
        beforeImage: { src: '/images/urban/vegas1.jpg', alt: 'Las Vegas downtown', label: 'Today' },
        afterImage: { src: '/images/urban/vegas2.png', alt: 'Las Vegas downtown solarpunk', label: 'Solarpunk' },
      },
      {
        name: 'Paris',
        lat: 48.8566,
        lng: 2.3522,
        color: '#ff8c00',
        beforeImage: { src: '/images/urban/eifel.webp', alt: 'Paris today', label: 'Today' },
        afterImage: { src: '/images/urban/eifel2.png', alt: 'Paris solarpunk', label: 'Solarpunk' },
      },
    ],
    []
  )

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
    const CLOUDS_ALT = 0.004
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

  const handleBackgroundClick = () => setSelectedLocation(null)
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation()

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
              htmlLat={(d: any) => (d as LocationPoint).lat}
              htmlLng={(d: any) => (d as LocationPoint).lng}
              htmlAltitude={0.02}
              htmlElement={(d: any) => {
                const loc = d as LocationPoint
                const el = document.createElement('div')
                el.className = 'marker'
                const dot = document.createElement('div')
                dot.className = 'marker-dot'
                dot.style.setProperty('--marker-color', loc.color || '#ff8c00')
                const label = document.createElement('div')
                label.className = 'marker-label'
                label.textContent = loc.name
                el.appendChild(dot)
                el.appendChild(label)
                el.addEventListener('click', () => setSelectedLocation(loc))
                return el
              }}
            />
          </Suspense>
        )}
      </div>

      {selectedLocation && (
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
              <h2 style={{ fontSize: 20, margin: 0 }}>{selectedLocation.name}</h2>
              <button
                onClick={() => setSelectedLocation(null)}
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
            <ImageComparison
              beforeImage={selectedLocation.beforeImage}
              afterImage={selectedLocation.afterImage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

