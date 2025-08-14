'use client';

import React from 'react';
import { SuitabilityScore } from '@/types';

interface LocationInspectorProps {
  score: SuitabilityScore | null;
  onClose: () => void;
  className?: string;
}

const LocationInspector: React.FC<LocationInspectorProps> = ({
  score,
  onClose,
  className = ''
}) => {
  if (!score) return null;

  const formatCoordinate = (coord: number, isLat: boolean) => {
    const abs = Math.abs(coord);
    const direction = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${abs.toFixed(4)}°${direction}`;
  };

  const getScoreColor = (value: number) => {
    if (value >= 75) return 'text-green-400';
    if (value >= 50) return 'text-yellow-400';
    if (value >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreDescription = (value: number) => {
    if (value >= 75) return 'Excellent';
    if (value >= 50) return 'Good';
    if (value >= 25) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`control-panel p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Location Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close location details"
        >
          ✕
        </button>
      </div>

      {/* Coordinates */}
      <div className="mb-4 pb-3 border-b border-gray-600">
        <div className="text-xs text-gray-400 mb-1">Coordinates</div>
        <div className="text-sm text-white font-mono">
          {formatCoordinate(score.location.lat, true)}, {formatCoordinate(score.location.lng, false)}
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-4 pb-3 border-b border-gray-600">
        <div className="text-xs text-gray-400 mb-2">Overall Suitability</div>
        <div className="flex items-center space-x-3">
          <div className={`text-2xl font-bold ${getScoreColor(score.total)}`}>
            {score.total}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${getScoreColor(score.total)}`}>
              {getScoreDescription(score.total)}
            </div>
            <div className="text-xs text-gray-500">
              out of 100
            </div>
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-3">Factor Breakdown</div>
        <div className="space-y-3">
          {Object.entries(score.factors).map(([factor, value]) => {
            const weight = score.weights[factor as keyof typeof score.weights];
            const weightedScore = value * weight * 100;
            
            return (
              <div key={factor} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-white capitalize">
                    {factor === 'remoteness' ? 'Distance from Cities' : factor}
                  </div>
                  <div className="text-xs text-gray-500">
                    Weight: {Math.round(weight * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getScoreColor(value * 100)}`}>
                    {Math.round(value * 100)}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{Math.round(weightedScore)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Quality */}
      {score.dataSparse && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
          <div className="text-xs text-yellow-400 font-medium">
            ⚠️ Data Sparse Area
          </div>
          <div className="text-xs text-yellow-300 mt-1">
            Limited data availability for this location. Scores may be less accurate.
          </div>
        </div>
      )}

      {/* Factor Explanations */}
      <div className="pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400 space-y-2">
          <div><strong>Solar:</strong> Energy generation potential</div>
          <div><strong>Water:</strong> Freshwater availability & stress</div>
          <div><strong>Distance:</strong> Remoteness from populated areas</div>
          <div><strong>Population:</strong> Local population density</div>
          <div><strong>Flood:</strong> Natural flood risk level</div>
        </div>
      </div>

      {/* Share/Export */}
      <div className="pt-3 border-t border-gray-600 mt-4">
        <button
          onClick={() => {
            const url = `${window.location.origin}${window.location.pathname}?ll=${score.location.lat.toFixed(4)},${score.location.lng.toFixed(4)}`;
            navigator.clipboard.writeText(url);
          }}
          className="w-full px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          📋 Copy Location Link
        </button>
      </div>
    </div>
  );
};

export default LocationInspector;