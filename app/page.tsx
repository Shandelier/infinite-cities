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

  const placeholderBefore = {
    src: '/images/urban/pawia.webp',
    alt: 'Placeholder before',
    label: 'Today',
  }
  const placeholderAfter = {
    src: '/images/urban/pawia-punk.webp',
    alt: 'Placeholder after',
    label: 'Solarpunk',
  }

  const locations: LocationPoint[] = useMemo(
    () => [
      {
        name: 'New York, USA',
        lat: 40.7128,
        lng: -74.006,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Paris, France',
        lat: 48.8566,
        lng: 2.3522,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'London, UK',
        lat: 51.5074,
        lng: -0.1278,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Shanghai, China',
        lat: 31.2304,
        lng: 121.4737,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Tokyo, Japan',
        lat: 35.6762,
        lng: 139.6503,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Singapore, Singapore',
        lat: 1.3521,
        lng: 103.8198,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'São Paulo, Brazil',
        lat: -23.5505,
        lng: -46.6333,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Mexico City, Mexico',
        lat: 19.4326,
        lng: -99.1332,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Istanbul, Turkey',
        lat: 41.0082,
        lng: 28.9784,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Saint Petersburg, Russia',
        lat: 59.9311,
        lng: 30.3609,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Dubai, United Arab Emirates',
        lat: 25.2048,
        lng: 55.2708,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'New Delhi, India',
        lat: 28.6139,
        lng: 77.209,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Seoul, South Korea',
        lat: 37.5665,
        lng: 126.978,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Sydney, Australia',
        lat: -33.8688,
        lng: 151.2093,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Buenos Aires, Argentina',
        lat: -34.6037,
        lng: -58.3816,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
      {
        name: 'Lisbon, Portugal',
        lat: 38.7223,
        lng: -9.1393,
        size: 0.35,
        color: '#ffa500',
        beforeImage: placeholderBefore,
        afterImage: placeholderAfter,
      },
    ],
    []
  )

  const selectedLocation =
    selectedIndex !== null ? locations[selectedIndex] : null
  const isDesktop = viewport.width >= 1024

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
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation()

  const cardContent = selectedLocation ? (
      <div
        style={{
          background: 'rgba(255,255,255,0.25)',
          color: '#e0f7ff',
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,255,242,0.2)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          width: isDesktop ? 'min(40vw, 500px)' : 'min(90vw, 700px)',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 20, margin: 0 }}>{selectedLocation.name}</h2>
          <button
            onClick={() => setSelectedIndex(null)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              color: '#fff',
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
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
            }}
          >
            <button
              onClick={handlePrev}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#fff',
                fontSize: 24,
                cursor: 'pointer',
              }}
              aria-label="Previous city"
            >
              ←
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              {selectedLocation.name}
            </div>
            <button
              onClick={handleNext}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#fff',
                fontSize: 24,
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
              marginTop: 8,
            }}
          >
            {locations.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  margin: '0 4px',
                  background: idx === selectedIndex ? '#fff' : 'rgba(255,255,255,0.4)',
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
        display: isDesktop && selectedLocation ? 'flex' : 'block',
        alignItems: 'center',
      }}
    >
      {isDesktop && selectedLocation && (
        <div
          style={{
            width: '50%',
            height: viewport.height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {cardContent}
        </div>
      )}
      <div
        style={{
          width: isDesktop && selectedLocation ? '50%' : '100%',
          height: viewport.height,
          transition: 'width 0.5s',
        }}
      >
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

