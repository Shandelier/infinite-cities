#!/usr/bin/env python3
"""
Off-Grid Suitability Data Processing Pipeline

This script processes global datasets to create suitability rasters for off-grid living.
Implements the scoring methodology defined in the PRD.
"""

import os
import json
import numpy as np
import rasterio
from rasterio.warp import reproject, Resampling
from rasterio.transform import from_bounds
from rasterio.crs import CRS
import logging
from pathlib import Path
from typing import Dict, Tuple, Optional
import argparse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Global constants
TARGET_CRS = CRS.from_epsg(4326)
TARGET_RESOLUTION = 0.008333  # ~1km at equator
GLOBAL_BOUNDS = (-180, -90, 180, 90)  # minx, miny, maxx, maxy
NODATA_VALUE = 255
NEUTRAL_SCORE = 0.6  # For missing data

class SuitabilityProcessor:
    """Main class for processing off-grid suitability data."""
    
    def __init__(self, data_dir: str, out_dir: str):
        self.data_dir = Path(data_dir)
        self.out_dir = Path(out_dir)
        self.raw_dir = self.data_dir / "raw"
        self.processed_dir = self.data_dir / "processed"
        self.factors_dir = self.data_dir / "factors"
        
        # Create output directories
        for dir_path in [self.processed_dir, self.factors_dir, self.out_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def setup_target_grid(self) -> Tuple[rasterio.Affine, int, int]:
        """Create the target grid specification."""
        west, south, east, north = GLOBAL_BOUNDS
        width = int((east - west) / TARGET_RESOLUTION)
        height = int((north - south) / TARGET_RESOLUTION)
        
        transform = from_bounds(west, south, east, north, width, height)
        return transform, width, height
    
    def reproject_to_target_grid(self, src_path: str, dst_path: str, 
                                resampling: Resampling = Resampling.bilinear) -> None:
        """Reproject and resample raster to target grid."""
        transform, width, height = self.setup_target_grid()
        
        with rasterio.open(src_path) as src:
            # Create destination array
            dst_array = np.empty((height, width), dtype=src.dtypes[0])
            
            # Reproject
            reproject(
                source=rasterio.band(src, 1),
                destination=dst_array,
                src_transform=src.transform,
                src_crs=src.crs,
                dst_transform=transform,
                dst_crs=TARGET_CRS,
                resampling=resampling
            )
            
            # Write to destination
            profile = {
                'driver': 'GTiff',
                'dtype': src.dtypes[0],
                'nodata': src.nodata,
                'width': width,
                'height': height,
                'count': 1,
                'crs': TARGET_CRS,
                'transform': transform,
                'compress': 'lzw'
            }
            
            with rasterio.open(dst_path, 'w', **profile) as dst:
                dst.write(dst_array, 1)
        
        logger.info(f"Reprojected {src_path} -> {dst_path}")
    
    def normalize_solar(self, ghi_array: np.ndarray) -> np.ndarray:
        """
        Normalize Global Horizontal Irradiation to 0-1 scale.
        Formula: S = clamp((GHI-3)/(6-3), 0, 1)
        """
        return np.clip((ghi_array - 3.0) / (6.0 - 3.0), 0.0, 1.0)
    
    def normalize_water_stress(self, stress_array: np.ndarray) -> np.ndarray:
        """
        Normalize water stress ratio to 0-1 scale with step function.
        ≤0.4→1.0; 0.4–0.8→0.7; 0.8–1.2→0.4; 1.2–2.0→0.2; >2.0→0.05
        """
        result = np.zeros_like(stress_array, dtype=np.float32)
        
        result[stress_array <= 0.4] = 1.0
        result[(stress_array > 0.4) & (stress_array <= 0.8)] = 0.7
        result[(stress_array > 0.8) & (stress_array <= 1.2)] = 0.4
        result[(stress_array > 1.2) & (stress_array <= 2.0)] = 0.2
        result[stress_array > 2.0] = 0.05
        
        return result
    
    def normalize_remoteness(self, travel_time_array: np.ndarray) -> np.ndarray:
        """
        Normalize travel time to cities to 0-1 scale.
        Formula: S = clamp((T-30)/(180-30), 0, 1)
        """
        return np.clip((travel_time_array - 30.0) / (180.0 - 30.0), 0.0, 1.0)
    
    def normalize_population(self, pop_density_array: np.ndarray) -> np.ndarray:
        """
        Normalize population density to 0-1 scale with piecewise linear function.
        ≤5→1.0; 5–50 linear to 0.3; 50–200 linear to 0.0; >200→0.0
        """
        result = np.ones_like(pop_density_array, dtype=np.float32)
        
        # 5-50: linear from 1.0 to 0.3
        mask1 = (pop_density_array > 5) & (pop_density_array <= 50)
        result[mask1] = 1.0 - 0.7 * (pop_density_array[mask1] - 5) / (50 - 5)
        
        # 50-200: linear from 0.3 to 0.0
        mask2 = (pop_density_array > 50) & (pop_density_array <= 200)
        result[mask2] = 0.3 - 0.3 * (pop_density_array[mask2] - 50) / (200 - 50)
        
        # >200: 0.0
        result[pop_density_array > 200] = 0.0
        
        return result
    
    def normalize_flood_risk(self, flood_index_array: np.ndarray) -> np.ndarray:
        """
        Normalize flood risk index to 0-1 scale.
        Formula: S = 1 - F (where F is flood index 0-1)
        """
        return 1.0 - np.clip(flood_index_array, 0.0, 1.0)
    
    def process_factor_rasters(self) -> Dict[str, str]:
        """Process all factor rasters and return paths to normalized versions."""
        factor_paths = {}
        
        # Define factor processing mapping
        factors = {
            'solar': ('solar_ghi.tif', self.normalize_solar),
            'water': ('water_stress.tif', self.normalize_water_stress),
            'remoteness': ('travel_time.tif', self.normalize_remoteness),
            'population': ('pop_density.tif', self.normalize_population),
            'flood': ('flood_risk.tif', self.normalize_flood_risk)
        }
        
        for factor_name, (filename, normalize_func) in factors.items():
            processed_path = self.processed_dir / filename
            factor_path = self.factors_dir / f"{factor_name}_normalized.tif"
            
            if not processed_path.exists():
                logger.warning(f"Processed file not found: {processed_path}")
                continue
            
            with rasterio.open(processed_path) as src:
                data = src.read(1)
                profile = src.profile.copy()
                
                # Handle nodata
                valid_mask = data != src.nodata if src.nodata is not None else np.ones_like(data, dtype=bool)
                
                # Normalize valid data
                normalized = np.full_like(data, NEUTRAL_SCORE, dtype=np.float32)
                if np.any(valid_mask):
                    normalized[valid_mask] = normalize_func(data[valid_mask].astype(np.float32))
                
                # Update profile
                profile.update(dtype=rasterio.float32, nodata=None)
                
                with rasterio.open(factor_path, 'w', **profile) as dst:
                    dst.write(normalized, 1)
                
                factor_paths[factor_name] = str(factor_path)
                logger.info(f"Normalized {factor_name}: {factor_path}")
        
        return factor_paths
    
    def create_protected_areas_mask(self) -> Optional[str]:
        """Create protected areas mask from WDPA data."""
        # Placeholder - in real implementation would rasterize WDPA polygons
        mask_path = self.factors_dir / "protected_mask.tif"
        
        # For now, create a dummy mask (all areas available)
        transform, width, height = self.setup_target_grid()
        
        profile = {
            'driver': 'GTiff',
            'dtype': rasterio.uint8,
            'nodata': None,
            'width': width,
            'height': height,
            'count': 1,
            'crs': TARGET_CRS,
            'transform': transform,
            'compress': 'lzw'
        }
        
        mask_data = np.ones((height, width), dtype=np.uint8)
        
        with rasterio.open(mask_path, 'w', **profile) as dst:
            dst.write(mask_data, 1)
        
        logger.info(f"Created protected areas mask: {mask_path}")
        return str(mask_path)
    
    def combine_factors(self, factor_paths: Dict[str, str], weights: Dict[str, float], 
                       preset_name: str, mask_path: Optional[str] = None) -> str:
        """Combine normalized factors using preset weights."""
        output_path = self.out_dir / f"suitability_{preset_name}.tif"
        
        # Load all factors
        factors_data = {}
        reference_profile = None
        
        for factor_name, factor_path in factor_paths.items():
            if not os.path.exists(factor_path):
                logger.warning(f"Factor file not found: {factor_path}")
                continue
                
            with rasterio.open(factor_path) as src:
                factors_data[factor_name] = src.read(1)
                if reference_profile is None:
                    reference_profile = src.profile.copy()
        
        if not factors_data:
            raise ValueError("No factor data available")
        
        # Calculate weighted sum
        height, width = list(factors_data.values())[0].shape
        suitability = np.zeros((height, width), dtype=np.float32)
        
        for factor_name, weight in weights.items():
            if factor_name in factors_data:
                suitability += weight * factors_data[factor_name]
                logger.info(f"Added {factor_name} with weight {weight}")
        
        # Apply protected areas mask if available
        if mask_path and os.path.exists(mask_path):
            with rasterio.open(mask_path) as mask_src:
                mask_data = mask_src.read(1)
                suitability = suitability * mask_data
                logger.info("Applied protected areas mask")
        
        # Convert to 0-100 uint8 scale
        suitability_uint8 = np.clip(np.round(suitability * 100), 0, 100).astype(np.uint8)
        
        # Update profile
        reference_profile.update(dtype=rasterio.uint8, nodata=NODATA_VALUE)
        
        with rasterio.open(output_path, 'w', **reference_profile) as dst:
            dst.write(suitability_uint8, 1)
        
        logger.info(f"Created suitability raster: {output_path}")
        return str(output_path)
    
    def process_all_presets(self, presets_config: Dict) -> Dict[str, str]:
        """Process all presets and return paths to suitability rasters."""
        # Process factor rasters
        factor_paths = self.process_factor_rasters()
        
        # Create protected areas mask
        mask_path = self.create_protected_areas_mask()
        
        # Process each preset
        suitability_paths = {}
        for preset_key, preset_config in presets_config['presets'].items():
            preset_id = preset_config['id']
            weights = preset_config['weights']
            
            logger.info(f"Processing preset {preset_id}: {preset_config['name']}")
            
            suitability_path = self.combine_factors(
                factor_paths, weights, preset_id, mask_path
            )
            suitability_paths[preset_id] = suitability_path
        
        return suitability_paths

def main():
    parser = argparse.ArgumentParser(description='Process off-grid suitability data')
    parser.add_argument('--data-dir', default='data', help='Data directory path')
    parser.add_argument('--out-dir', default='out/suitability', help='Output directory path')
    parser.add_argument('--config', default='web/config/presets.json', help='Presets config file')
    args = parser.parse_args()
    
    # Load presets configuration
    with open(args.config, 'r') as f:
        presets_config = json.load(f)
    
    # Initialize processor
    processor = SuitabilityProcessor(args.data_dir, args.out_dir)
    
    # Process all presets
    suitability_paths = processor.process_all_presets(presets_config)
    
    logger.info("Processing complete!")
    for preset_id, path in suitability_paths.items():
        logger.info(f"Preset {preset_id}: {path}")

if __name__ == "__main__":
    main()