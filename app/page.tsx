'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { GlobeMethods } from 'react-globe.gl'
import ImageComparison from './components/ImageComparison'
import locations, { LocationPoint } from './data/locations'

const Globe = React.lazy(() => import('react-globe.gl'))

export default function Home() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [globeVisible, setGlobeVisible] = useState(false)

  const selectedLocation =
    selectedIndex !== null ? locations[selectedIndex] : null

  const isDesktop = viewport.width >= 1024
  const isLargeDesktop = viewport.width >= 1800
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
    if (isMounted) {
      setGlobeVisible(true)
    }
  }, [isMounted])

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
      globe.pointOfView({ lat: 30, lng: 10, altitude: 1.8 }, 3000)
      const controls = globe.controls()
      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.15
      }
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
        1000
      )
    } else {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.15
      globe.pointOfView({ lat: 30, lng: 10, altitude: 1.8 }, 3000)
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
        background: 'rgba(16, 42, 67, 0.85)',
        color: '#e0f0ff',
        borderRadius: 20,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(80,150,200,0.4)',
        width: isDesktop ? (isLargeDesktop ? '800px' : '600px') : 'min(90vw, 700px)',
        maxWidth: isDesktop ? (isLargeDesktop ? 800 : 600) : undefined,
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
            color: '#e0f0ff',
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
            color: '#e0f0ff',
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#e0f0ff',
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
              color: '#e0f0ff',
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
                    ? '#e0f0ff'
                    : 'rgba(224,240,255,0.3)',
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
          transform:
            isDesktop && selectedLocation
              ? isLargeDesktop
                ? 'translateX(10%)'
                : 'translateX(20%)'
              : 'none',
        }}
      >
        {isMounted && (
          <div style={{ width: '100%', height: '100%', opacity: globeVisible ? 1 : 0, transition: 'opacity 3s ease' }}>
            <Suspense fallback={null}>
              <Globe
                ref={globeRef}
                width={globeWidth}
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
          </div>
        )}
      </div>
      {isDesktop && selectedLocation && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: isLargeDesktop ? '20%' : '5%',
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

