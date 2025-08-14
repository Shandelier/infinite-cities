'use client';

import React from 'react';

interface OpacityControlProps {
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  className?: string;
}

const OpacityControl: React.FC<OpacityControlProps> = ({
  opacity,
  onOpacityChange,
  className = ''
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(event.target.value);
    onOpacityChange(newOpacity);
  };

  return (
    <div className={`control-panel p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Layer Opacity
      </h3>
      
      <div className="space-y-3">
        {/* Opacity slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleSliderChange}
            className="range-slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Adjust layer opacity"
          />
          
          {/* Slider track indicators */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Current value display */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Current:</span>
          <span className="text-sm font-medium text-white">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        
        {/* Quick preset buttons */}
        <div className="flex space-x-2">
          {[0.3, 0.7, 1.0].map((value) => (
            <button
              key={value}
              onClick={() => onOpacityChange(value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(opacity - value) < 0.05
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label={`Set opacity to ${Math.round(value * 100)}%`}
            >
              {Math.round(value * 100)}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400">
          Adjust transparency to see base map features underneath the suitability layer.
        </div>
      </div>
    </div>
  );
};

export default OpacityControl;