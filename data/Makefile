SHELL := /usr/bin/bash

RAW := $(PWD)/raw
PROCESSED := $(PWD)/processed
FACTORS := $(PWD)/factors
OUT := $(PWD)/out
TMP := $(PWD)/tmp

PRESETS := A B C

.PHONY: all ingest process factors combine tiles upload clean

all: tiles

ingest:
	@mkdir -p $(RAW)
	@echo "[ingest] Fetch datasets (placeholder)"
	@python pipeline/ingest.py --out $(RAW)

process: ingest
	@mkdir -p $(PROCESSED)
	@mkdir -p $(FACTORS)
	@echo "[process] Reproject/resample + rasterize WDPA"
	@python pipeline/process.py --raw $(RAW) --processed $(PROCESSED)
	@python pipeline/wdpa_mask.py --processed $(PROCESSED)

factors: process
	@echo "[factors] Normalize factor rasters"
	@python pipeline/normalize.py --processed $(PROCESSED) --out $(FACTORS)

combine: factors
	@mkdir -p $(OUT)
	@for p in $(PRESETS); do \
		echo "[combine] preset $$p"; \
		python pipeline/combine.py --factors $(FACTORS) --preset $$p --out $(OUT)/suitability_$$p.tif; \
	done

tiles: combine
	@echo "[tiles] Generate PNG8 tiles z0–z7"
	@python pipeline/tiles.py --input_dir $(OUT) --out_dir $(OUT)/tiles --minzoom 0 --maxzoom 7

upload: tiles
	@echo "[upload] Upload to CDN (placeholder)"
	@python pipeline/upload.py --tiles $(OUT)/tiles

clean:
	rm -rf $(TMP)