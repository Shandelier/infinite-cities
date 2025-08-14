'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';

// Import components
import PresetSelector from '@/components/PresetSelector';
import OpacityControl from '@/components/OpacityControl';
import Legend from '@/components/Legend';
import LocationInspector from '@/components/LocationInspector';

// Types
import { MapState, ClickEvent, SuitabilityScore, Preset } from '@/types';

// Dynamic import for Map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <div className="loading-spinner"></div>
      <span className="ml-2 text-gray-300">Loading map...</span>
    </div>
  ),
});

// Load presets configuration
const presetsConfig = {
  "presets": {
    "standard": {
      "id": "A",
      "name": "Standard",
      "description": "Balanced weighting across all factors",
      "weights": {
        "solar": 0.25,
        "water": 0.25,
        "remoteness": 0.20,
        "population": 0.15,
        "flood": 0.15
      }
    },
    "water_first": {
      "id": "B", 
      "name": "Water-first",
      "description": "Prioritizes water availability",
      "weights": {
        "solar": 0.20,
        "water": 0.40,
        "remoteness": 0.15,
        "population": 0.10,
        "flood": 0.15
      }
    },
    "remote_first": {
      "id": "C",
      "name": "Remote-first", 
      "description": "Prioritizes remoteness from populated areas",
      "weights": {
        "solar": 0.20,
        "water": 0.20,
        "remoteness": 0.35,
        "population": 0.15,
        "flood": 0.10
      }
    }
  }
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Convert config to Preset array
  const presets: Preset[] = useMemo(() => 
    Object.values(presetsConfig.presets), 
    []
  );

  // Initialize state from URL params or defaults
  const [mapState, setMapState] = useState<MapState>(() => {
    const preset = searchParams.get('preset') || 'A';
    const ll = searchParams.get('ll');
    const z = searchParams.get('z');
    const opa = searchParams.get('opa');

    let latitude = 20;
    let longitude = 0;
    if (ll) {
      const [lat, lng] = ll.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        latitude = lat;
        longitude = lng;
      }
    }

    return {
      longitude,
      latitude,
      zoom: z ? Number(z) : 2,
      preset,
      opacity: opa ? Number(opa) : 0.7,
    };
  });

  const [selectedLocation, setSelectedLocation] = useState<SuitabilityScore | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Update URL when map state changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (mapState.preset !== 'A') {
      params.set('preset', mapState.preset);
    }
    
    if (Math.abs(mapState.latitude - 20) > 0.01 || Math.abs(mapState.longitude - 0) > 0.01) {
      params.set('ll', `${mapState.latitude.toFixed(4)},${mapState.longitude.toFixed(4)}`);
    }
    
    if (Math.abs(mapState.zoom - 2) > 0.01) {
      params.set('z', mapState.zoom.toFixed(1));
    }
    
    if (Math.abs(mapState.opacity - 0.7) > 0.01) {
      params.set('opa', mapState.opacity.toFixed(1));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/';
    
    // Update URL without triggering navigation
    window.history.replaceState({}, '', newUrl);
  }, [mapState]);

  // Handle map state changes
  const handleMapStateChange = useCallback((newState: Partial<MapState>) => {
    setMapState(prev => ({ ...prev, ...newState }));
  }, []);

  // Handle preset changes
  const handlePresetChange = useCallback((presetId: string) => {
    setMapState(prev => ({ ...prev, preset: presetId }));
    setSelectedLocation(null); // Clear selection when preset changes
  }, []);

  // Handle opacity changes
  const handleOpacityChange = useCallback((opacity: number) => {
    setMapState(prev => ({ ...prev, opacity }));
  }, []);

  // Handle location clicks
  const handleLocationClick = useCallback((event: ClickEvent) => {
    const [lng, lat] = event.lngLat;
    
    // For demo purposes, generate a mock score
    // In production, this would query the factor grids
    const mockScore: SuitabilityScore = {
      total: Math.round(Math.random() * 100),
      factors: {
        solar: Math.random(),
        water: Math.random(),
        remoteness: Math.random(),
        population: Math.random(),
        flood: Math.random(),
      },
      weights: presetsConfig.presets[mapState.preset === 'A' ? 'standard' : mapState.preset === 'B' ? 'water_first' : 'remote_first'].weights,
      location: { lat, lng },
      dataSparse: Math.random() > 0.8, // 20% chance of sparse data
    };

    setSelectedLocation(mockScore);
  }, [mapState.preset]);

  // Close location inspector
  const closeLocationInspector = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div className="h-screen w-screen relative bg-gray-900">
      {/* Map */}
      <MapComponent
        mapState={mapState}
        onMapStateChange={handleMapStateChange}
        onLocationClick={handleLocationClick}
        className="absolute inset-0"
      />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 space-y-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="control-panel p-4">
          <h1 className="text-lg font-bold text-white mb-1">
            Off-Grid Suitability Map
          </h1>
          <p className="text-xs text-gray-400">
            Explore global suitability for off-grid living
          </p>
        </div>

        {/* Preset Selector */}
        <PresetSelector
          presets={presets}
          selectedPreset={mapState.preset}
          onPresetChange={handlePresetChange}
        />

        {/* Opacity Control */}
        <OpacityControl
          opacity={mapState.opacity}
          onOpacityChange={handleOpacityChange}
        />

        {/* Legend */}
        <Legend />

        {/* Location Inspector */}
        {selectedLocation && (
          <LocationInspector
            score={selectedLocation}
            onClose={closeLocationInspector}
          />
        )}
      </div>

      {/* Info Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAboutOpen(true)}
          className="control-panel p-3 text-gray-300 hover:text-white transition-colors"
          aria-label="About this map"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      {!selectedLocation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="control-panel px-4 py-2">
            <p className="text-xs text-gray-400 text-center">
              Click anywhere on the map to inspect suitability scores
            </p>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="control-panel p-6 max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">About This Map</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                This interactive map visualizes global suitability for off-grid living 
                based on key environmental and accessibility factors.
              </p>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Data Sources</h3>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>• Solar: Global Solar Atlas</li>
                  <li>• Water: Aqueduct Water Risk Atlas</li>
                  <li>• Remoteness: Accessibility to Cities</li>
                  <li>• Population: WorldPop</li>
                  <li>• Flood Risk: Global Flood Database</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-500">
                  <strong>Disclaimer:</strong> This tool is for educational purposes only. 
                  Do not use for legal, zoning, or immigration decisions. Always verify 
                  with local authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}