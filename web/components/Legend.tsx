'use client';

import React from 'react';
import { LegendItem } from '@/types';

interface LegendProps {
  className?: string;
}

const Legend: React.FC<LegendProps> = ({ className = '' }) => {
  const legendItems: LegendItem[] = [
    { value: 0, color: '#b22a2b', label: 'Unsuitable' },
    { value: 25, color: '#d6604d', label: 'Poor' },
    { value: 50, color: '#fee08b', label: 'Fair' },
    { value: 75, color: '#a6d96a', label: 'Good' },
    { value: 100, color: '#1a9850', label: 'Excellent' }
  ];

  return (
    <div className={`control-panel p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Suitability Score
      </h3>
      
      {/* Gradient bar */}
      <div className="space-y-3">
        <div className="relative">
          <div className="legend-gradient h-4 rounded border border-gray-600"></div>
          
          {/* Value markers */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Legend items */}
        <div className="space-y-2">
          {legendItems.map((item) => (
            <div key={item.value} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded border border-gray-600 flex-shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              ></div>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-gray-300">{item.label}</span>
                <span className="text-xs text-gray-500">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400">
          <p className="mb-2">
            <strong>Higher scores</strong> indicate better suitability for off-grid living based on:
          </p>
          <ul className="space-y-1 text-gray-500">
            <li>• Solar energy potential</li>
            <li>• Water availability</li>
            <li>• Distance from populated areas</li>
            <li>• Low population density</li>
            <li>• Reduced flood risk</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Legend;