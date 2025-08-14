#!/usr/bin/env python3
"""
Tile Generation Script for Off-Grid Suitability Maps

Converts suitability rasters to web map tiles with proper color schemes.
"""

import os
import subprocess
import argparse
import json
import logging
from pathlib import Path
import tempfile
import numpy as np
import rasterio
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TileGenerator:
    """Generate web map tiles from suitability rasters."""
    
    def __init__(self, input_dir: str, output_dir: str):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Suitability color scheme (0-100 scale)
        self.color_map = self.create_color_map()
    
    def create_color_map(self) -> str:
        """Create color map file for gdal2tiles."""
        # Define color scheme: red (low) -> yellow -> green (high)
        colors = [
            "0 139 0 0 0",      # 0: transparent for nodata
            "1 178 24 43 255",  # Very low: dark red
            "25 214 96 77 255", # Low: red  
            "50 254 224 139 255", # Medium: yellow
            "75 166 217 106 255", # High: light green
            "100 26 152 80 255", # Very high: dark green
            "255 255 255 255 0" # nodata: transparent
        ]
        
        color_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False)
        for color in colors:
            color_file.write(f"{color}\n")
        color_file.close()
        
        return color_file.name
    
    def apply_color_map(self, input_raster: str, output_raster: str) -> None:
        """Apply color map to raster using gdaldem."""
        cmd = [
            'gdaldem', 'color-relief',
            input_raster,
            self.color_map,
            output_raster,
            '-alpha',
            '-of', 'GTiff'
        ]
        
        logger.info(f"Applying color map: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"gdaldem failed: {result.stderr}")
            raise RuntimeError(f"Color mapping failed: {result.stderr}")
        
        logger.info(f"Color mapped raster created: {output_raster}")
    
    def generate_tiles(self, colored_raster: str, preset_id: str, 
                      min_zoom: int = 0, max_zoom: int = 7) -> str:
        """Generate web map tiles from colored raster."""
        tile_dir = self.output_dir / preset_id
        tile_dir.mkdir(parents=True, exist_ok=True)
        
        cmd = [
            'gdal2tiles.py',
            '--zoom', f"{min_zoom}-{max_zoom}",
            '--processes', '4',
            '--webviewer', 'none',  # Don't generate viewer
            '--title', f'Off-Grid Suitability - Preset {preset_id}',
            '--resampling', 'near',  # Preserve exact values
            '--tiledriver', 'PNG',
            colored_raster,
            str(tile_dir)
        ]
        
        logger.info(f"Generating tiles: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"gdal2tiles failed: {result.stderr}")
            raise RuntimeError(f"Tile generation failed: {result.stderr}")
        
        logger.info(f"Tiles generated in: {tile_dir}")
        return str(tile_dir)
    
    def optimize_tiles(self, tile_dir: str) -> None:
        """Optimize PNG tiles for web delivery."""
        tile_path = Path(tile_dir)
        
        # Find all PNG files
        png_files = list(tile_path.rglob("*.png"))
        logger.info(f"Optimizing {len(png_files)} PNG tiles...")
        
        for png_file in png_files:
            try:
                # Use PIL to optimize PNG
                with Image.open(png_file) as img:
                    # Convert to palette mode if not already
                    if img.mode != 'P':
                        img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
                    
                    # Save with optimization
                    img.save(png_file, format='PNG', optimize=True)
                    
            except Exception as e:
                logger.warning(f"Failed to optimize {png_file}: {e}")
        
        logger.info("Tile optimization complete")
    
    def create_tileset_metadata(self, preset_id: str, tile_dir: str) -> str:
        """Create TileJSON metadata for the tileset."""
        metadata = {
            "tilejson": "3.0.0",
            "name": f"off-grid-suitability-{preset_id}",
            "description": f"Off-grid suitability scores - Preset {preset_id}",
            "version": "1.0.0",
            "scheme": "xyz",
            "tiles": [f"{{z}}/{{x}}/{{y}}.png"],
            "minzoom": 0,
            "maxzoom": 7,
            "bounds": [-180, -85.0511, 180, 85.0511],
            "center": [0, 0, 2],
            "attribution": "Off-Grid Suitability Analysis",
            "legend": "0: Unsuitable, 25: Poor, 50: Fair, 75: Good, 100: Excellent"
        }
        
        metadata_file = Path(tile_dir) / "metadata.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"Created metadata: {metadata_file}")
        return str(metadata_file)
    
    def process_preset(self, suitability_raster: str, preset_id: str) -> str:
        """Process a single preset: color mapping + tile generation."""
        logger.info(f"Processing preset {preset_id}: {suitability_raster}")
        
        # Create colored version
        colored_raster = self.input_dir / f"colored_{preset_id}.tif"
        self.apply_color_map(suitability_raster, str(colored_raster))
        
        # Generate tiles
        tile_dir = self.generate_tiles(str(colored_raster), preset_id)
        
        # Optimize tiles
        self.optimize_tiles(tile_dir)
        
        # Create metadata
        self.create_tileset_metadata(preset_id, tile_dir)
        
        # Clean up colored raster
        if colored_raster.exists():
            colored_raster.unlink()
        
        logger.info(f"Preset {preset_id} processing complete: {tile_dir}")
        return tile_dir
    
    def cleanup(self):
        """Clean up temporary files."""
        if hasattr(self, 'color_map') and os.path.exists(self.color_map):
            os.unlink(self.color_map)

def main():
    parser = argparse.ArgumentParser(description='Generate web map tiles from suitability rasters')
    parser.add_argument('--input-dir', default='out/suitability', help='Input directory with suitability rasters')
    parser.add_argument('--output-dir', default='out/tiles', help='Output directory for tiles')
    parser.add_argument('--presets', nargs='+', default=['A', 'B', 'C'], help='Preset IDs to process')
    parser.add_argument('--min-zoom', type=int, default=0, help='Minimum zoom level')
    parser.add_argument('--max-zoom', type=int, default=7, help='Maximum zoom level')
    args = parser.parse_args()
    
    generator = TileGenerator(args.input_dir, args.output_dir)
    
    try:
        for preset_id in args.presets:
            suitability_raster = Path(args.input_dir) / f"suitability_{preset_id}.tif"
            
            if not suitability_raster.exists():
                logger.warning(f"Suitability raster not found: {suitability_raster}")
                continue
            
            generator.process_preset(str(suitability_raster), preset_id)
        
        logger.info("All presets processed successfully!")
        
    finally:
        generator.cleanup()

if __name__ == "__main__":
    main()