'use client'

import { motion } from 'framer-motion'
import { MapPin, ChevronDown } from 'lucide-react'

interface CitySelectorProps {
  cities: string[]
  selectedCity: string
  onCityChange: (city: string) => void
}

export function CitySelector({ cities, selectedCity, onCityChange }: CitySelectorProps) {
  const formatCityName = (city: string) => {
    return city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-500" />
          <label htmlFor="city-select" className="text-lg font-semibold text-gray-900 dark:text-white">
            Select City:
          </label>
        </div>
        
        <div className="relative flex-1 max-w-xs">
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {formatCityName(city)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {cities.length} cities available
        </div>
      </div>
    </motion.div>
  )
}
