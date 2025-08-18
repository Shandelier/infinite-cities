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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const [containerHeight, setContainerHeight] = useState<number>(500) // Default fallback
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeImageRef = useRef<HTMLImageElement>(null)
  const afterImageRef = useRef<HTMLImageElement>(null)

  const getHeightConstraints = useCallback(() => {
    const isMobile = window.innerWidth <= 480
    const isTablet = window.innerWidth <= 768
    
    if (isMobile) {
      return { minHeight: 200, maxHeight: 400 }
    } else if (isTablet) {
      return { minHeight: 250, maxHeight: 500 }
    } else {
      return { minHeight: 300, maxHeight: 800 }
    }
  }, [])

  const calculateHeight = useCallback((aspectRatio: number, containerWidth: number) => {
    const { minHeight, maxHeight } = getHeightConstraints()
    return Math.max(minHeight, Math.min(maxHeight, containerWidth / aspectRatio))
  }, [getHeightConstraints])

  const calculateDimensions = useCallback((img: HTMLImageElement) => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const imageAspectRatio = img.naturalWidth / img.naturalHeight
    const calculatedHeight = calculateHeight(imageAspectRatio, containerWidth)
    
    setAspectRatio(imageAspectRatio)
    setContainerHeight(calculatedHeight)
  }, [calculateHeight])

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

  // Preload images to get dimensions early
  useEffect(() => {
    const preloadImage = new Image()
    preloadImage.onload = () => {
      if (!aspectRatio && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const imageAspectRatio = preloadImage.naturalWidth / preloadImage.naturalHeight
        const calculatedHeight = calculateHeight(imageAspectRatio, containerWidth)
        
        // Optional: Add console logging for debugging (remove in production)
        console.log(`Image dimensions: ${preloadImage.naturalWidth}x${preloadImage.naturalHeight}, aspect ratio: ${imageAspectRatio.toFixed(2)}, calculated height: ${calculatedHeight}px`)
        
        setAspectRatio(imageAspectRatio)
        setContainerHeight(calculatedHeight)
      }
    }
    preloadImage.src = beforeImage.src
  }, [beforeImage.src, aspectRatio, calculateHeight])

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

  useEffect(() => {
    // Reveal as soon as either image is ready
    if (isBeforeDone || isAfterDone) {
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

  // Handle window resize to recalculate dimensions
  useEffect(() => {
    const handleResize = () => {
      if (aspectRatio && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const calculatedHeight = calculateHeight(aspectRatio, containerWidth)
        setContainerHeight(calculatedHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [aspectRatio, calculateHeight])

  return (
    <div 
      ref={containerRef}
      className={`image-comparison-container ${isLoaded ? 'loaded' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ height: `${containerHeight}px` }}
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