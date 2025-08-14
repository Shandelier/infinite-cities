'use client'

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
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBeforeDone, setIsBeforeDone] = useState(false)
  const [isAfterDone, setIsAfterDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeImageRef = useRef<HTMLImageElement>(null)
  const afterImageRef = useRef<HTMLImageElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleMove(e.clientX)
  }, [handleMove])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }, [isDragging, handleMove])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  const markBeforeDone = useCallback(() => {
    setIsBeforeDone(true)
  }, [])

  const markAfterDone = useCallback(() => {
    setIsAfterDone(true)
  }, [])

  useEffect(() => {
    // Reveal as soon as either image is ready
    if (isBeforeDone || isAfterDone) {
      setIsLoaded(true)
    }
  }, [isBeforeDone, isAfterDone])

  // Handle cached images and provide a short fallback timeout
  useEffect(() => {
    if (beforeImageRef.current?.complete) setIsBeforeDone(true)
    if (afterImageRef.current?.complete) setIsAfterDone(true)

    const fallback = setTimeout(() => setIsLoaded(true), 1200)
    return () => clearTimeout(fallback)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`image-comparison-container ${isLoaded ? 'loaded' : ''} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Before Image */}
      <div className="image-wrapper before-image">
        <img
          ref={beforeImageRef}
          src={beforeImage.src}
          alt={beforeImage.alt}
          onLoad={markBeforeDone}
          onError={markBeforeDone}
          loading="eager"
          draggable={false}
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
        <img
          ref={afterImageRef}
          src={afterImage.src}
          alt={afterImage.alt}
          onLoad={markAfterDone}
          onError={markAfterDone}
          loading="eager"
          draggable={false}
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
            <div className="spinner-leaf">🌿</div>
          </div>
          <p>Growing your comparison...</p>
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