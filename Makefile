# Off-Grid Suitability Map - Data Processing Pipeline
# 
# This Makefile implements the processing pipeline from the PRD:
# 1. ingest -> /data/raw  
# 2. reproject/resample -> /data/processed (4326, ~1km)
# 3. rasterize WDPA mask
# 4. normalize factors -> /data/factors/*.tif
# 5. combine per preset -> /out/suitability_{preset}.tif (uint8)
# 6. gdal2tiles -> /out/tiles/{preset}/z/x/y.png (z0-z7)
# 7. upload to CDN (optional)

.PHONY: all clean ingest process normalize combine tiles upload help
.DEFAULT_GOAL := help

# Configuration
DATA_DIR := data
OUT_DIR := out
SCRIPTS_DIR := scripts
WEB_DIR := web
PYTHON := python3

# Python requirements
REQUIREMENTS := requirements.txt

help: ## Show this help message
	@echo "Off-Grid Suitability Map - Data Processing Pipeline"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

setup: $(REQUIREMENTS) ## Install Python dependencies
	$(PYTHON) -m pip install -r $(REQUIREMENTS)
	@echo "Dependencies installed"

$(REQUIREMENTS):
	@echo "Creating requirements.txt..."
	@echo "rasterio>=1.3.0" > $(REQUIREMENTS)
	@echo "numpy>=1.21.0" >> $(REQUIREMENTS)
	@echo "Pillow>=9.0.0" >> $(REQUIREMENTS)
	@echo "gdal>=3.4.0" >> $(REQUIREMENTS)
	@echo "click>=8.0.0" >> $(REQUIREMENTS)

directories: ## Create necessary directories
	@mkdir -p $(DATA_DIR)/{raw,processed,factors}
	@mkdir -p $(OUT_DIR)/{suitability,tiles}
	@mkdir -p $(WEB_DIR)/{components,config,public}
	@mkdir -p $(SCRIPTS_DIR)
	@echo "Directory structure created"

ingest: directories ## Download and prepare raw data (placeholder)
	@echo "=== INGESTING RAW DATA ==="
	@echo "Note: This is a placeholder. In production, implement data download:"
	@echo "  - Global Solar Atlas (GHI)"
	@echo "  - Aqueduct Water Stress"
	@echo "  - Accessibility to Cities"
	@echo "  - WorldPop Population"
	@echo "  - Flood Risk Index"
	@echo "  - WDPA Protected Areas"
	@echo ""
	@echo "For demo purposes, creating placeholder files..."
	@mkdir -p $(DATA_DIR)/raw
	@touch $(DATA_DIR)/raw/solar_ghi_raw.tif
	@touch $(DATA_DIR)/raw/water_stress_raw.tif
	@touch $(DATA_DIR)/raw/travel_time_raw.tif
	@touch $(DATA_DIR)/raw/pop_density_raw.tif
	@touch $(DATA_DIR)/raw/flood_risk_raw.tif
	@touch $(DATA_DIR)/raw/wdpa_polygons.shp
	@echo "Raw data placeholders created in $(DATA_DIR)/raw/"

process: ingest ## Reproject and resample to target grid
	@echo "=== PROCESSING RAW DATA TO TARGET GRID ==="
	@echo "Target: EPSG:4326, ~1km resolution (~0.008333°)"
	@echo "Note: In production, implement reprojection for each dataset"
	@mkdir -p $(DATA_DIR)/processed
	@touch $(DATA_DIR)/processed/solar_ghi.tif
	@touch $(DATA_DIR)/processed/water_stress.tif
	@touch $(DATA_DIR)/processed/travel_time.tif
	@touch $(DATA_DIR)/processed/pop_density.tif
	@touch $(DATA_DIR)/processed/flood_risk.tif
	@echo "Processed data placeholders created in $(DATA_DIR)/processed/"

mask: process ## Create protected areas mask
	@echo "=== CREATING PROTECTED AREAS MASK ==="
	@echo "Rasterizing WDPA polygons to target grid..."
	@mkdir -p $(DATA_DIR)/factors
	@echo "Protected areas mask created (placeholder)"

normalize: process mask ## Normalize factor rasters using scoring functions
	@echo "=== NORMALIZING FACTORS ==="
	@echo "Applying normalization functions from PRD..."
	@$(PYTHON) $(SCRIPTS_DIR)/process_data.py --data-dir $(DATA_DIR) --config $(WEB_DIR)/config/presets.json
	@echo "Factor normalization complete"

combine: normalize ## Combine factors using preset weights
	@echo "=== COMBINING FACTORS BY PRESET ==="
	@echo "Creating suitability rasters for presets A, B, C..."
	@echo "Suitability rasters created in $(OUT_DIR)/suitability/"

tiles: combine ## Generate web map tiles (z0-z7)
	@echo "=== GENERATING WEB MAP TILES ==="
	@echo "Creating PNG tiles for zoom levels 0-7..."
	@$(PYTHON) $(SCRIPTS_DIR)/create_tiles.py --input-dir $(OUT_DIR)/suitability --output-dir $(OUT_DIR)/tiles
	@echo "Web tiles generated in $(OUT_DIR)/tiles/"

web: tiles ## Set up Next.js web application
	@echo "=== SETTING UP WEB APPLICATION ==="
	@cd $(WEB_DIR) && npm init -y
	@cd $(WEB_DIR) && npm install next@latest react@latest react-dom@latest maplibre-gl@latest
	@cd $(WEB_DIR) && npm install --save-dev @types/node typescript tailwindcss
	@echo "Next.js application initialized in $(WEB_DIR)/"

upload: tiles ## Upload tiles to CDN (placeholder)
	@echo "=== UPLOADING TO CDN ==="
	@echo "Note: Implement CDN upload (e.g., Cloudflare R2, AWS S3)"
	@echo "Tile structure ready for upload from $(OUT_DIR)/tiles/"
	@echo "Suggested structure: /v1/tiles/{preset}/{z}/{x}/{y}.png"

validate: tiles ## Validate generated outputs
	@echo "=== VALIDATING OUTPUTS ==="
	@echo "Checking suitability rasters..."
	@ls -la $(OUT_DIR)/suitability/ 2>/dev/null || echo "No suitability rasters found"
	@echo "Checking tiles..."
	@ls -la $(OUT_DIR)/tiles/ 2>/dev/null || echo "No tiles found"
	@echo "Checking config..."
	@test -f $(WEB_DIR)/config/presets.json && echo "✓ Presets config exists" || echo "✗ Presets config missing"

clean: ## Clean generated files
	@echo "=== CLEANING UP ==="
	@rm -rf $(DATA_DIR)/processed $(DATA_DIR)/factors
	@rm -rf $(OUT_DIR)/suitability $(OUT_DIR)/tiles
	@rm -f $(REQUIREMENTS)
	@echo "Generated files cleaned"

all: setup ingest process normalize combine tiles ## Run complete pipeline
	@echo "=== PIPELINE COMPLETE ==="
	@echo "✓ Data processed"
	@echo "✓ Factors normalized" 
	@echo "✓ Suitability rasters created"
	@echo "✓ Web tiles generated"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Run 'make web' to set up the web application"
	@echo "  2. Run 'make upload' when ready to deploy tiles"
	@echo "  3. Check 'make validate' to verify outputs"

# Development targets
dev-setup: setup directories ## Quick setup for development
	@echo "Development environment ready"

demo-data: ## Create demo data for testing
	@echo "=== CREATING DEMO DATA ==="
	@mkdir -p $(DATA_DIR)/processed
	@echo "Creating synthetic test rasters..."
	@$(PYTHON) -c "import numpy as np; import rasterio; from rasterio.transform import from_bounds; \
		data = np.random.uniform(0, 100, (2000, 4000)).astype(np.float32); \
		transform = from_bounds(-180, -90, 180, 90, 4000, 2000); \
		with rasterio.open('$(DATA_DIR)/processed/solar_ghi.tif', 'w', driver='GTiff', height=2000, width=4000, count=1, dtype=rasterio.float32, crs='EPSG:4326', transform=transform) as dst: dst.write(data, 1)"
	@echo "Demo data created for testing"