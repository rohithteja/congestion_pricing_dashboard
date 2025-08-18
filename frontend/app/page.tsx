'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { IndiaMap } from '@/components/IndiaMap'
import { CityDetailView } from '@/components/CityDetailView'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { apiService } from '@/lib/api'
import { CityEmissionData, PolicyResponse, EmissionStats } from '@/types'

interface CityData {
  name: string
  display_name: string
  population: number
  state: string
  lat: number
  lng: number
}

export default function Home() {
  const [citiesData, setCitiesData] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [cityData, setCityData] = useState<CityEmissionData | null>(null)
  const [selectedRoads, setSelectedRoads] = useState<number[]>([])
  const [pricingIntensity, setPricingIntensity] = useState<number>(50)
  const [policyResult, setPolicyResult] = useState<PolicyResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isApplyingPolicy, setIsApplyingPolicy] = useState<boolean>(false)
  const [showEmissions, setShowEmissions] = useState<boolean>(false)
  const [view, setView] = useState<'map' | 'city'>('map')

  // Load cities with population data on component mount
  useEffect(() => {
    const loadCitiesData = async () => {
      setLoading(true)
      try {
        const data = await apiService.getCitiesWithPopulation()
        setCitiesData(data)
      } catch (error) {
        console.error('Error loading cities data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCitiesData()
  }, [])

  // Load city data when city is selected
  useEffect(() => {
    if (selectedCity && view === 'city') {
      loadCityData(selectedCity)
    }
  }, [selectedCity, view])

  const loadCityData = async (city: string) => {
    setLoading(true)
    setPolicyResult(null)
    setSelectedRoads([])
    try {
      const data = await apiService.getCityData(city)
      setCityData(data)
    } catch (error) {
      console.error('Error loading city data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName)
    setView('city')
  }

  const handleBackToMap = () => {
    setView('map')
    setSelectedCity('')
    setCityData(null)
    setPolicyResult(null)
    setSelectedRoads([])
  }

  const handleApplyPolicy = async () => {
    if (!selectedCity || selectedRoads.length === 0) return

    setIsApplyingPolicy(true)
    try {
      const result = await apiService.applyPolicy({
        city: selectedCity,
        selected_roads: selectedRoads,
        pricing_intensity: pricingIntensity
      })
      setPolicyResult(result)
    } catch (error) {
      console.error('Error applying policy:', error)
    } finally {
      setIsApplyingPolicy(false)
    }
  }

  const handleWardSelect = (wardIds: number[] | ((prev: number[]) => number[])) => {
    setSelectedRoads(wardIds)
    setPolicyResult(null) // Clear previous results when selection changes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'map' ? (
            <motion.div
              key="india-map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Map Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  India Emissions Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Explore emission data across 100+ Indian cities. Click on any city to analyze congestion pricing policies and their environmental impact.
                </p>
              </div>

              {/* India Map */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cities Overview
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Circle size represents population • Click to explore
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-[600px]">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="h-[600px]">
                    <IndiaMap 
                      citiesData={citiesData}
                      onCitySelect={handleCitySelect}
                      selectedCity={selectedCity}
                    />
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {citiesData.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Cities Available</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {citiesData.reduce((sum, city) => sum + city.population, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Total Population</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(citiesData.map(city => city.state)).size}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">States Covered</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="city-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={handleBackToMap}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to India Map</span>
              </button>

              {/* City Detail View */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : cityData ? (
                <CityDetailView
                  cityData={cityData}
                  selectedRoads={selectedRoads}
                  onRoadSelect={handleWardSelect}
                  pricingIntensity={pricingIntensity}
                  onIntensityChange={setPricingIntensity}
                  onApplyPolicy={handleApplyPolicy}
                  isApplyingPolicy={isApplyingPolicy}
                  policyResult={policyResult}
                  showEmissions={showEmissions}
                  onToggleEmissions={() => setShowEmissions(!showEmissions)}
                  selectedCityName={selectedCity}
                />
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  Loading city data...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
