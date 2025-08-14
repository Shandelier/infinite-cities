'use client';

import React from 'react';
import { Preset } from '@/types';

interface PresetSelectorProps {
  presets: Preset[];
  selectedPreset: string;
  onPresetChange: (presetId: string) => void;
  className?: string;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  selectedPreset,
  onPresetChange,
  className = ''
}) => {
  return (
    <div className={`control-panel p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Scoring Preset
      </h3>
      
      <div className="space-y-2">
        {presets.map((preset) => (
          <label
            key={preset.id}
            className="flex items-start space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="preset"
              value={preset.id}
              checked={selectedPreset === preset.id}
              onChange={(e) => onPresetChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-500 border-gray-500 bg-gray-700 focus:ring-blue-400 focus:ring-2"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                {preset.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {preset.description}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Solar: {Math.round(preset.weights.solar * 100)}%, 
                Water: {Math.round(preset.weights.water * 100)}%, 
                Remote: {Math.round(preset.weights.remoteness * 100)}%
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400">
          Each preset weights factors differently to highlight specific priorities for off-grid living.
        </div>
      </div>
    </div>
  );
};

export default PresetSelector;