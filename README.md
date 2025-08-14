# Off-Grid Suitability Map (MVP)

Lightweight web map that ranks global off-grid suitability from precomputed rasters with 3 presets, opacity control, click-to-inspect, and shareable URLs.

## Quickstart

### Web (Next.js + MapLibre)

Requirements: Node.js 18+

1. Set environment variables (create `web/.env.local`):
   
   ```
   NEXT_PUBLIC_TILE_BASE_URL=https://cdn.example.com/v1/tiles
   NEXT_PUBLIC_BASEMAP_URL=https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
   ```
2. Install and run:
   
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. Open http://localhost:3000

### Data Pipeline (Python + GDAL)

Requirements: Python 3.10+, GDAL, rasterio

```bash
cd data
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
make ingest   # placeholder
make process  # reproject/resample + normalize
make combine  # build per-preset GeoTIFFs (uint8 0–100)
make tiles    # z0–z7 PNG8 tiles
make upload   # upload to CDN (requires R2 creds)
```

Products:
- `out/suitability_{preset}.tif` (uint8 0–100)
- `out/tiles/{preset}/{z}/{x}/{y}.png` (z0–z7)

## Presets

See `web/public/config/presets.json`.

## Legal

Educational only; not legal/zoning/immigration advice. Protected areas masked by default. Dataset vintages and licenses listed in `data/README.md`.

## Perf Budget

- First tile visible <1.5s on 4G; LCP <2.5s
- Total JS <150KB gz (map lib is lazy-loaded)
- Tile error rate <1%; share URL 100%