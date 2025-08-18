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
  onRoadSelect: (roadIds: number[] | ((prev: number[]) => number[])) => void
  showEmissions?: boolean
}

export function EmissionMap({ cityData, selectedRoads, onRoadSelect, showEmissions = true }: EmissionMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <DynamicMap
        cityData={cityData}
        selectedRoads={selectedRoads}
        onRoadSelect={onRoadSelect}
        showEmissions={showEmissions}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Map Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded border border-blue-700"></div>
            <span className="text-gray-700 dark:text-gray-300">Ward Boundaries</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded border border-red-700"></div>
            <span className="text-gray-700 dark:text-gray-300">Selected for Pricing</span>
          </div>
          {showEmissions && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-red-600 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Emission Grid (μg/m³)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}