# Off-Grid Suitability Map

An interactive web application that visualizes global suitability for off-grid living based on environmental and accessibility factors.

![Off-Grid Suitability Map](https://img.shields.io/badge/status-MVP-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MapLibre](https://img.shields.io/badge/MapLibre-GL-orange)

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- GDAL 3.4+ (for data processing)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd off-grid-suitability-map
```

2. **Set up data processing environment**
```bash
make setup
```

3. **Set up web application**
```bash
cd web
npm install
```

4. **Run the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🗺️ Features

### Interactive Map
- **Global Coverage**: Worldwide suitability analysis at ~1km resolution
- **Three Scoring Presets**: Standard, Water-first, Remote-first weightings
- **Click-to-Inspect**: Detailed score breakdown for any location
- **Layer Controls**: Opacity adjustment and preset switching
- **Shareable URLs**: Permalink functionality with view state

### Scoring Methodology
The suitability score (0-100) combines five key factors:

| Factor | Weight (Standard) | Description |
|--------|------------------|-------------|
| **Solar** | 25% | Solar energy potential (GHI) |
| **Water** | 25% | Water stress/availability |
| **Remoteness** | 20% | Distance from populated areas |
| **Population** | 15% | Local population density |
| **Flood Risk** | 15% | Natural flood hazard level |

### Performance
- **Fast Loading**: First tile visible <1.5s on 4G
- **Lightweight**: JavaScript bundle <150KB gzipped  
- **Responsive**: Optimized for desktop and tablet
- **Accessible**: WCAG compliance and keyboard navigation

## 🔄 Data Processing Pipeline

The project includes a complete data processing workflow:

```bash
# Full pipeline
make all

# Individual steps
make ingest     # Download raw datasets
make process    # Reproject to target grid
make normalize  # Apply scoring functions
make combine    # Create preset rasters
make tiles      # Generate web tiles
```

### Data Sources
- **Solar**: Global Solar Atlas (World Bank)
- **Water**: Aqueduct Water Risk Atlas (WRI)
- **Remoteness**: Accessibility to Cities (Malaria Atlas Project)
- **Population**: WorldPop/GPWv4
- **Flood Risk**: Global flood databases
- **Protected Areas**: World Database on Protected Areas (WDPA)

## 🏗️ Architecture

```
off-grid-suitability-map/
├── data/                 # Data processing
│   ├── raw/             # Source datasets
│   ├── processed/       # Reprojected rasters
│   └── factors/         # Normalized factors
├── scripts/             # Processing scripts
│   ├── process_data.py  # Main processing
│   └── create_tiles.py  # Tile generation
├── out/                 # Generated outputs
│   ├── suitability/     # Final rasters
│   └── tiles/           # Web tiles
└── web/                 # Next.js application
    ├── app/             # App router pages
    ├── components/      # React components
    └── config/          # Configuration files
```

## 📊 Scoring Details

### Normalization Functions

**Solar (GHI kWh/m²/day)**
```python
score = clamp((GHI - 3) / (6 - 3), 0, 1)
```

**Water Stress (ratio)**
- ≤0.4 → 1.0 (low stress)
- 0.4-0.8 → 0.7 (medium-low)
- 0.8-1.2 → 0.4 (medium-high)  
- 1.2-2.0 → 0.2 (high)
- >2.0 → 0.05 (extremely high)

**Remoteness (minutes to city)**
```python
score = clamp((time - 30) / (180 - 30), 0, 1)
```

**Population Density (people/km²)**
- ≤5 → 1.0
- 5-50 → linear to 0.3
- 50-200 → linear to 0.0
- >200 → 0.0

**Flood Risk (index 0-1)**
```python
score = 1 - flood_index
```

### Preset Configurations

| Preset | Solar | Water | Remote | Population | Flood |
|--------|-------|-------|--------|------------|-------|
| **Standard** | 25% | 25% | 20% | 15% | 15% |
| **Water-first** | 20% | 40% | 15% | 10% | 15% |
| **Remote-first** | 20% | 20% | 35% | 15% | 10% |

## 🚀 Deployment

### Production Build
```bash
cd web
npm run build
npm start
```

### CDN Deployment
Upload tiles to CDN (Cloudflare R2, AWS S3, etc.):
```bash
# Example structure: /v1/tiles/{preset}/{z}/{x}/{y}.png
make upload  # Configure for your CDN
```

### Environment Variables
```env
NEXT_PUBLIC_TILES_BASE_URL=/tiles  # Tile server URL
```

## 🔧 Development

### Adding New Factors
1. Add data source to `data/README.md`
2. Implement normalization in `scripts/process_data.py`
3. Update preset weights in `web/config/presets.json`
4. Update UI components as needed

### Custom Presets
Edit `web/config/presets.json`:
```json
{
  "presets": {
    "custom": {
      "id": "D",
      "name": "Custom",
      "description": "Your description",
      "weights": {
        "solar": 0.3,
        "water": 0.3,
        "remoteness": 0.2,
        "population": 0.1,
        "flood": 0.1
      }
    }
  }
}
```

## 📋 API Reference

### Tile Endpoints
```
GET /tiles/{preset}/{z}/{x}/{y}.png
```
- `preset`: A, B, or C
- `z`: Zoom level (0-7)
- `x`, `y`: Tile coordinates

### URL Parameters
```
/?preset=A&ll=lat,lng&z=zoom&opa=opacity
```
- `preset`: Scoring preset (A/B/C)
- `ll`: Latitude,longitude 
- `z`: Zoom level
- `opa`: Layer opacity (0-1)

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Validate outputs
make validate
```

## 📄 License & Disclaimer

**Educational Use Only**

This tool is for educational and research purposes only. Do not use for:
- Legal property decisions
- Immigration or visa planning
- Zoning or land use compliance
- Commercial site selection without professional consultation

Always verify with local authorities and current regulations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| LCP | <2.5s | ✅ |
| JS Bundle | <150KB gz | ✅ |
| First Tile | <1.5s | ✅ |
| Tile Error Rate | <1% | ✅ |

## 🔗 Related Projects

- [Global Solar Atlas](https://globalsolaratlas.info/)
- [Aqueduct Water Risk Atlas](https://www.wri.org/aqueduct)
- [Accessibility to Cities](https://malariaatlas.org/)
- [WorldPop](https://www.worldpop.org/)

---

**Built with ❤️ for the off-grid community**