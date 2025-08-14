'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Layer, Source, MapRef } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import { MapState, ClickEvent, SuitabilityScore } from '@/types';

interface MapComponentProps {
  mapState: MapState;
  onMapStateChange: (newState: Partial<MapState>) => void;
  onLocationClick: (event: ClickEvent) => void;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapState,
  onMapStateChange,
  onLocationClick,
  className = ''
}) => {
  const mapRef = useRef<MapRef>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Base map style - using a simple light/dark style
  const mapStyle = {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [
          // Using OpenStreetMap tiles as base map
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  };

  // Generate tile URL for current preset
  const getTileUrl = useCallback((preset: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_TILES_BASE_URL || '/tiles';
    return `${baseUrl}/${preset}/{z}/{x}/{y}.png`;
  }, []);

  // Handle map click events
  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    const { lngLat, point } = event;
    onLocationClick({
      lngLat: [lngLat.lng, lngLat.lat],
      point: [point.x, point.y]
    });
  }, [onLocationClick]);

  // Handle map view state changes
  const handleMove = useCallback((evt: any) => {
    onMapStateChange({
      longitude: evt.viewState.longitude,
      latitude: evt.viewState.latitude,
      zoom: evt.viewState.zoom
    });
  }, [onMapStateChange]);

  // Add suitability layer when map loads
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current.getMap();
    const sourceId = 'suitability-tiles';
    const layerId = 'suitability-layer';

    // Remove existing source and layer if they exist
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add suitability tiles source
    map.addSource(sourceId, {
      type: 'raster',
      tiles: [getTileUrl(mapState.preset)],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 7
    });

    // Add suitability layer
    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: {
        'raster-opacity': mapState.opacity
      }
    });

    // Add click handler to suitability layer
    map.on('click', layerId, handleMapClick);

    return () => {
      if (map.getLayer(layerId)) {
        map.off('click', layerId, handleMapClick);
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [isLoaded, mapState.preset, mapState.opacity, getTileUrl, handleMapClick]);

  // Update layer opacity when it changes
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current.getMap();
    const layerId = 'suitability-layer';

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'raster-opacity', mapState.opacity);
    }
  }, [isLoaded, mapState.opacity]);

  return (
    <div className={`relative ${className}`} id="map-container">
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        longitude={mapState.longitude}
        latitude={mapState.latitude}
        zoom={mapState.zoom}
        onMove={handleMove}
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%' }}
        maxZoom={10}
        minZoom={1}
        attributionControl={true}
        logoPosition="bottom-right"
        cursor="crosshair"
      />
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-300">Loading map...</span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;