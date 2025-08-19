'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'

interface ImageData {
  src: string
  alt: string
  label: string
}

interface ImageComparisonProps {
  beforeImage: ImageData
  afterImage: ImageData
}

export default function ImageComparison({ beforeImage, afterImage }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBeforeDone, setIsBeforeDone] = useState(false)
  const [isAfterDone, setIsAfterDone] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeImageRef = useRef<HTMLImageElement>(null)
  const afterImageRef = useRef<HTMLImageElement>(null)

  const calculateDimensions = useCallback((img: HTMLImageElement) => {
    const imageAspectRatio = img.naturalWidth / img.naturalHeight
    setAspectRatio(imageAspectRatio)
  }, [])

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  // Pointer events (mouse + touch) to avoid passive event issues
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    const target = e.currentTarget as HTMLElement
    try { target.setPointerCapture(e.pointerId) } catch {}
    handleMove(e.clientX)
  }, [handleMove])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    const target = e.currentTarget as HTMLElement
    try { target.releasePointerCapture(e.pointerId) } catch {}
  }, [])

  const markBeforeDone = useCallback(() => {
    setIsBeforeDone(true)
    if (beforeImageRef.current && !aspectRatio) {
      calculateDimensions(beforeImageRef.current)
    }
  }, [calculateDimensions, aspectRatio])

  const markAfterDone = useCallback(() => {
    setIsAfterDone(true)
    if (afterImageRef.current && !aspectRatio) {
      calculateDimensions(afterImageRef.current)
    }
  }, [calculateDimensions, aspectRatio])

  // Preload images to get aspect ratio early
  useEffect(() => {
    const preloadImage = new Image()
    preloadImage.onload = () => {
      if (!aspectRatio && containerRef.current) {
        const imageAspectRatio = preloadImage.naturalWidth / preloadImage.naturalHeight
        // Optional: debug (can remove)
        console.log(`Image dimensions: ${preloadImage.naturalWidth}x${preloadImage.naturalHeight}, aspect ratio: ${imageAspectRatio.toFixed(2)}`)
        setAspectRatio(imageAspectRatio)
      }
    }
    preloadImage.src = beforeImage.src
  }, [beforeImage.src, aspectRatio])

  // No global listeners needed with pointer events
  useEffect(() => {}, [])

  useEffect(() => {
    if (isBeforeDone && isAfterDone) {
      setIsLoaded(true)
    }
  }, [isBeforeDone, isAfterDone])

  // Handle cached images and provide a short fallback timeout
  useEffect(() => {
    if (beforeImageRef.current?.complete) {
      setIsBeforeDone(true)
      if (!aspectRatio) {
        calculateDimensions(beforeImageRef.current)
      }
    }
    if (afterImageRef.current?.complete) {
      setIsAfterDone(true)
      if (!aspectRatio) {
        calculateDimensions(afterImageRef.current)
      }
    }

    const fallback = setTimeout(() => setIsLoaded(true), 1200)
    return () => clearTimeout(fallback)
  }, [calculateDimensions, aspectRatio])

  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    setIsBeforeDone(false)
    setIsAfterDone(false)
    setIsLoaded(false)
    setAspectRatio(null)
    setSliderPosition(0)

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    const duration = 8000
    let start: number | null = null
    const animate = (time: number) => {
      if (start === null) start = time
      const progress = Math.min((time - start) / duration, 1)
      setSliderPosition(progress * 100)
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [beforeImage.src, afterImage.src])

  useEffect(() => {
    if (isDragging && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [isDragging])

  // No resize handler necessary with CSS aspect-ratio

  return (
    <div 
      ref={containerRef}
      className={`image-comparison-container ${isLoaded ? 'loaded' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ aspectRatio: aspectRatio ?? undefined, maxHeight: '80vh', minHeight: '180px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Before Image */}
      <div className="image-wrapper before-image">
        <Image
          ref={beforeImageRef}
          src={beforeImage.src}
          alt={beforeImage.alt}
          width={1920}
          height={1080}
          quality={80}
          onLoad={markBeforeDone}
          onError={markBeforeDone}
          priority
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="image-label before-label">
          {beforeImage.label}
        </div>
      </div>

      {/* After Image */}
      <div 
        className="image-wrapper after-image"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          ref={afterImageRef}
          src={afterImage.src}
          alt={afterImage.alt}
          width={1920}
          height={1080}
          quality={80}
          onLoad={markAfterDone}
          onError={markAfterDone}
          priority
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="image-label after-label">
          {afterImage.label}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="handle-line"></div>
        <div className="handle-circle">
          <div className="handle-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="interaction-hint">
        <span className="hint-text">Drag to compare</span>
        <div className="hint-arrow">↔</div>
      </div>
    </div>
  )
}