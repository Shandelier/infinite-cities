// Core application types for Off-Grid Suitability Map

export interface Preset {
  id: string;
  name: string;
  description: string;
  weights: PresetWeights;
}

export interface PresetWeights {
  solar: number;
  water: number;
  remoteness: number;
  population: number;
  flood: number;
}

export interface SuitabilityScore {
  total: number;
  factors: {
    solar: number;
    water: number;
    remoteness: number;
    population: number;
    flood: number;
  };
  weights: PresetWeights;
  location: {
    lat: number;
    lng: number;
  };
  dataSparse?: boolean;
}

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
  preset: string;
  opacity: number;
}

export interface ClickEvent {
  lngLat: [number, number];
  point: [number, number];
}

export interface TileLayerProps {
  preset: string;
  opacity: number;
  tilesBaseUrl: string;
}

export interface LegendItem {
  value: number;
  color: string;
  label: string;
}

export interface AboutData {
  title: string;
  description: string;
  datasets: DatasetInfo[];
  disclaimer: string;
}

export interface DatasetInfo {
  name: string;
  source: string;
  parameter: string;
  vintage: string;
  license: string;
  url?: string;
}

export interface URLParams {
  preset?: string;
  ll?: string; // lat,lng
  z?: string;  // zoom
  opa?: string; // opacity
}