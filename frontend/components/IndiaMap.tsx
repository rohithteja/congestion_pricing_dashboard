'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

interface CityData {
  name: string
  display_name: string
  population: number
  state: string
  lat: number
  lng: number
}

interface IndiaMapProps {
  citiesData: CityData[]
  onCitySelect: (cityName: string) => void
  selectedCity?: string
}

// Dynamically import Leaflet to avoid SSR issues
const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }
)

export function IndiaMap({ citiesData, onCitySelect, selectedCity }: IndiaMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700" style={{ minHeight: '500px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <LeafletMap 
        citiesData={citiesData}
        onCitySelect={onCitySelect}
        selectedCity={selectedCity}
      />
    </div>
  )
}
