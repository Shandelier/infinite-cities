# Data Catalog and Pipeline

Grid: EPSG:4326, ~0.008333° (~1 km). Outputs are uint8 0–100 per preset, masked by WDPA.

## Datasets (placeholders; add exact sources and licenses)
- Solar (GHI / PV potential): SOURCE, vintage YYYY, license
- Water stress (ratio): SOURCE, vintage YYYY, license
- Flood hazard (F in [0,1]): SOURCE, vintage YYYY, license
- Remoteness (travel time to city, minutes): "Accessibility to Cities" (Weiss et al.), vintage 2015/2020?, license
- Population density (people/km²): WorldPop/GPW/HRSL composite, vintage YYYY, license
- Protected Areas: WDPA, vintage YYYY-MM, license

If redistribution restricted, serve only derived tile PNGs and not the raw rasters.

## Pipeline

Targets produce reproducible outputs with minimal manual steps.

1. ingest → `/data/raw`
2. reproject/resample → `/data/processed` (EPSG:4326, ~1 km)
3. rasterize WDPA mask → `/data/processed/wdpa_mask.tif`
4. normalize factors → `/data/factors/*.tif`
5. combine per preset → `/out/suitability_{preset}.tif` (uint8)
6. tile to PNG8 (paletted) z0–z7 → `/out/tiles/{preset}/z/x/y.png`
7. upload → CDN `/v1/tiles/{preset}/{z}/{x}/{y}.png`

## Scoring

S ∈ [0,1]; Score = round(100 * Σ wᵢ·Sᵢ) · Mask. Missing data: use neutral 0.6 and flag data-sparse.

- Solar (GHI): S = clamp((GHI−3)/(6−3), 0, 1)
- Water stress (ratio R): ≤0.4→1.0; 0.4–0.8→0.7; 0.8–1.2→0.4; 1.2–2.0→0.2; >2.0→0.05
- Remoteness T (min): S = clamp((T−30)/(180−30), 0, 1)
- Population (people/km²): ≤5→1.0; 5–50 linear to 0.3; 50–200 linear to 0.0; >200→0.0
- Flood (F∈[0,1]): S = 1−F
- Protected areas: Mask=0 inside WDPA else 1

## Notes
- Resample with average for continuous rasters, nearest for categorical/masks.
- Align pixel grids and NODATA consistently.
- Store normalization functions in `pipeline/normalize.py`.
- Keep test points in `tests/expected_points.csv` for QA (±1).