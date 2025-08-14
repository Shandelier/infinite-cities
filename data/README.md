# Off-Grid Suitability Data Sources

This document tracks the datasets used in the off-grid suitability analysis, their vintages, and licensing information.

## Grid Specification
- **Coordinate System**: EPSG:4326 (WGS84)
- **Cell Size**: ~0.008333° (~1 km at equator)
- **Extent**: Global coverage
- **Output Format**: GeoTIFF (uint8, 0-100 scale)

## Dataset Information

### Solar Irradiation (GHI/PV Potential)
- **Source**: Global Solar Atlas / World Bank
- **Parameter**: Global Horizontal Irradiation (kWh/m²/day)
- **Vintage**: TBD
- **License**: Creative Commons
- **URL**: https://globalsolaratlas.info/

### Water Stress
- **Source**: Aqueduct Water Risk Atlas / WRI
- **Parameter**: Baseline water stress ratio
- **Vintage**: TBD  
- **License**: CC BY 4.0
- **URL**: https://www.wri.org/aqueduct

### Flood Risk
- **Source**: Aqueduct Floods / WRI or UNEP-GRID
- **Parameter**: Flood hazard index (0-1 scale)
- **Vintage**: TBD
- **License**: CC BY 4.0

### Remoteness (Travel Time to Cities)
- **Source**: Accessibility to Cities / Malaria Atlas Project
- **Parameter**: Travel time to nearest city >50k population (minutes)
- **Vintage**: 2015
- **License**: CC BY 3.0
- **URL**: https://malariaatlas.org/research-project/accessibility-to-cities/

### Population Density
- **Source**: WorldPop / GPWv4
- **Parameter**: People per km²
- **Vintage**: Latest available
- **License**: CC BY 4.0
- **URL**: https://www.worldpop.org/

### Protected Areas
- **Source**: World Database on Protected Areas (WDPA)
- **Parameter**: Binary mask (protected/not protected)
- **Vintage**: Latest monthly release
- **License**: No commercial redistribution of raw data
- **URL**: https://www.protectedplanet.net/

## Data Processing Notes

1. All datasets are reprojected to EPSG:4326 and resampled to ~1km grid
2. Missing data values are filled with neutral score (0.6) and flagged
3. Protected areas are used as a binary mask (score = 0 inside protected areas)
4. Only derived suitability tiles are distributed, not raw source data
5. Normalization functions preserve data quality while enabling combination

## Legal Disclaimer

This data is provided for educational and research purposes only. It should not be used for:
- Legal property decisions
- Immigration or visa planning  
- Zoning or land use compliance
- Commercial site selection without professional consultation

Always verify with local authorities and current regulations before making any decisions based on this analysis.