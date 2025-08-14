'use client'

import { useState, useEffect } from 'react'
import ImageComparison from './components/ImageComparison'

interface ImagePair {
  id: string
  title: string
  description: string
  beforeImage: {
    src: string
    alt: string
    label: string
  }
  afterImage: {
    src: string
    alt: string
    label: string
  }
}

const sampleImagePairs: ImagePair[] = [
  {
    id: '1',
    title: 'Urban Transformation',
    description: 'From concrete jungle to green sanctuary - reimagining city spaces with vertical gardens and sustainable architecture.',
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      alt: 'Urban cityscape with concrete buildings and pollution',
      label: 'Present Day'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      alt: 'Green urban landscape with vertical gardens and sustainable buildings',
      label: 'Solarpunk Future'
    }
  },
  {
    id: '2',
    title: 'Energy Revolution',
    description: 'Transitioning from fossil fuel dependency to clean, renewable energy sources integrated harmoniously with nature.',
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      alt: 'Industrial landscape with smokestacks and pollution',
      label: 'Industrial Age'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
      alt: 'Solar panels and wind turbines in a green landscape',
      label: 'Renewable Future'
    }
  },
  {
    id: '3',
    title: 'Transportation Evolution',
    description: 'Moving from car-dependent infrastructure to sustainable, community-focused transportation systems.',
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      alt: 'Highway filled with cars and traffic',
      label: 'Car-Centric'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      alt: 'Bike lanes and green transportation corridors',
      label: 'Sustainable Mobility'
    }
  },
  {
    id: '4',
    title: 'Agricultural Renaissance',
    description: 'Transforming industrial monoculture into diverse, regenerative farming systems that work with nature.',
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      alt: 'Industrial monoculture farm with heavy machinery',
      label: 'Industrial Farming'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Permaculture garden with diverse plants and sustainable practices',
      label: 'Regenerative Agriculture'
    }
  }
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`page-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="intro-section">
        <div className="intro-content">
          <h2 className="intro-title">Envisioning Tomorrow</h2>
          <p className="intro-text">
            Explore the transformation from our current world to a sustainable, 
            equitable solarpunk future. Drag the slider to reveal possibilities 
            where technology and nature exist in harmony.
          </p>
        </div>
        <div className="decorative-elements">
          <div className="floating-leaf leaf-1">🍃</div>
          <div className="floating-leaf leaf-2">🌱</div>
          <div className="floating-leaf leaf-3">🌿</div>
        </div>
      </div>

      <div className="comparison-feed">
        {sampleImagePairs.map((pair, index) => (
          <div key={pair.id} className={`comparison-item item-${index + 1}`}>
            <div className="comparison-header">
              <h3 className="comparison-title">{pair.title}</h3>
              <p className="comparison-description">{pair.description}</p>
            </div>
            <ImageComparison
              beforeImage={pair.beforeImage}
              afterImage={pair.afterImage}
            />
          </div>
        ))}
      </div>

      <div className="footer-section">
        <div className="footer-content">
          <p className="footer-text">
            🌍 Building sustainable futures through imagination and action
          </p>
        </div>
      </div>
    </div>
  )
}