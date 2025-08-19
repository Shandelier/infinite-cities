'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
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
  images: {
    before: { src: string; alt: string; label: string }
    after: { src: string; alt: string; label: string }
  }
}

const locations: LocationPoint[] = [
  {
    lat: 52.2297,
    lng: 21.0122,
    size: 0.35,
    color: '#ff8c00',
    name: 'Warsaw',
    images: {
      before: { src: '/images/urban/pawia.png', alt: 'Warsaw today', label: 'Today' },
      after: { src: '/images/urban/pawia-punk.webp', alt: 'Solarpunk Warsaw', label: 'Solarpunk' },
    },
  },
  {
    lat: 36.1126,
    lng: -115.1767,
    name: 'Las Vegas Strip',
    images: {
      before: { src: '/images/urban/bellagio.png', alt: 'Las Vegas Strip today', label: 'Today' },
      after: { src: '/images/urban/bellagio2.png', alt: 'Solarpunk Las Vegas Strip', label: 'Solarpunk' },
    },
  },
  {
    lat: 36.1699,
    lng: -115.1398,
    name: 'Downtown Las Vegas',
    images: {
      before: { src: '/images/urban/vegas1.jpg', alt: 'Downtown Las Vegas today', label: 'Today' },
      after: { src: '/images/urban/vegas2.png', alt: 'Solarpunk Downtown Las Vegas', label: 'Solarpunk' },
    },
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    name: 'Paris',
    images: {
      before: { src: '/images/urban/eifel.webp', alt: 'Paris today', label: 'Today' },
      after: { src: '/images/urban/eifel2.png', alt: 'Solarpunk Paris', label: 'Solarpunk' },
    },
  },
]

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [selected, setSelected] = useState<LocationPoint | null>(null)

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

  return (
    <div style={{ position: 'relative' }}>
      <div className="globe-hero">
        <h2 className="globe-hero-title">Explore the Sunlit Earth</h2>
        <p className="globe-hero-text">Tap the glowing cities to reveal a solarpunk vision</p>
      </div>
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
              htmlElement={(d: any) => {
                const el = document.createElement('div')
                el.className = 'globe-marker'
                el.addEventListener('click', (e) => {
                  e.stopPropagation()
                  setSelected(d as LocationPoint)
                })
                el.setAttribute('title', (d as LocationPoint).name)
                return el
              }}
            />
          </Suspense>
        )}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </div>
            <ImageComparison beforeImage={selected.images.before} afterImage={selected.images.after} />
          </div>
        </div>
      )}
    </div>
  )
}

