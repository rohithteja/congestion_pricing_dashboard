'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CityEmissionData } from '@/types'

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  ),
})

interface EmissionMapProps {
  cityData: CityEmissionData
  selectedRoads: number[]
  onRoadSelect: (roadIds: number[]) => void
  showEmissions?: boolean
}

export function EmissionMap({ cityData, selectedRoads, onRoadSelect, showEmissions = true }: EmissionMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden relative">
      <DynamicMap
        cityData={cityData}
        selectedRoads={selectedRoads}
        onRoadSelect={onRoadSelect}
        showEmissions={showEmissions}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Wards</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Selected Wards</span>
          </div>
          {showEmissions && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-red-600"></div>
              <span className="text-gray-700 dark:text-gray-300">500m Grid (μg/m³)</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Selection Counter & Instructions */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        {selectedRoads.length > 0 && (
          <div className="bg-green-500 text-white p-3 rounded-lg shadow-lg max-w-xs">
            <div className="text-sm font-medium">
              ✅ {selectedRoads.length} Ward{selectedRoads.length !== 1 ? 's' : ''} Selected
            </div>
            <div className="text-xs mt-1 opacity-90">
              Click more wards to add them or click selected wards to deselect
            </div>
          </div>
        )}
        
        {selectedRoads.length === 0 && (
          <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg max-w-xs">
            <div className="text-sm">
              💡 Click on ward boundaries to select them for congestion pricing
            </div>
          </div>
        )}
      </div>
    </div>
  )
}