# Changelog

All notable changes to the Off-Grid Suitability Map project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- **Initial Release** - Complete off-grid suitability mapping application
- **Data Processing Pipeline**
  - Python scripts for processing global datasets (solar, water, remoteness, population, flood)
  - Normalization functions implementing PRD scoring methodology
  - Raster combination engine with preset weighting
  - Tile generation pipeline (z0-z7) with PNG8 optimization
  - Makefile-based workflow automation

- **Interactive Web Application**
  - Next.js 14 application with TypeScript
  - MapLibre GL JS integration for performant tile rendering
  - Three scoring presets: Standard, Water-first, Remote-first
  - Interactive controls: preset switcher, opacity slider, legend
  - Click-to-inspect functionality with detailed score breakdown
  - Shareable URLs with view state persistence
  - Responsive design optimized for desktop and tablet

- **Core Features**
  - Global suitability analysis based on 5 key factors
  - Real-time preset switching with smooth transitions
  - Layer opacity control (0-100%)
  - Comprehensive legend with color-coded scoring
  - Location inspector with factor breakdown and weighting
  - Copy-to-clipboard location sharing
  - About modal with data source attribution

- **Performance Optimizations**
  - Dynamic component loading to reduce initial bundle size
  - PNG8 tile optimization with adaptive palette compression
  - Client-side caching of map tiles
  - Lazy loading of non-critical components
  - Efficient React hooks and memoization

- **Data Sources**
  - Solar: Global Solar Atlas (Global Horizontal Irradiation)
  - Water: Aqueduct Water Risk Atlas (Baseline water stress)
  - Remoteness: Accessibility to Cities dataset (Travel time to cities >50k)
  - Population: WorldPop (Population density per km²)
  - Flood: Global flood hazard indices
  - Protected Areas: WDPA mask (binary exclusion)

- **Technical Implementation**
  - EPSG:4326 projection at ~1km resolution (~0.008333°)
  - Global coverage with standardized grid
  - 0-100 uint8 scoring scale
  - PNG tile format with web-optimized compression
  - TileJSON metadata for each preset
  - Comprehensive error handling and logging

### Technical Specifications
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mapping**: MapLibre GL JS, react-map-gl
- **Backend**: Python data processing with rasterio, GDAL, NumPy
- **Tiles**: PNG8 format, z0-z7 zoom levels, XYZ tile scheme
- **Performance**: LCP target <2.5s, JS bundle target <150KB gzipped
- **Browser Support**: Modern browsers with WebGL support

### Documentation
- Comprehensive README with setup and usage instructions
- Data source documentation with licensing and attribution
- API documentation for tile endpoints
- Deployment guide for CDN integration
- Contributing guidelines and development setup

### Known Limitations
- Demo version uses placeholder data for real datasets
- Tile generation requires GDAL installation
- Limited to z7 maximum zoom level
- Protected areas mask is simplified for MVP
- Mobile interface could be enhanced for touch interactions

### Security
- No user data collection or storage
- Static asset serving only
- Educational use disclaimer
- Proper CORS configuration for tile serving