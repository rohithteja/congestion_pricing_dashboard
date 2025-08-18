'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {view === 'map' ? (
            <motion.div
              key="map"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome Section */}
              <div className="text-center space-y-4">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Explore Urban Emissions
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Simulate the impact of congestion pricing policies on air quality across Indian cities. 
                  Analyze emissions data and visualize environmental benefits through interactive modeling.
                </motion.p>
              </div>

              {/* India Map */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Cities Overview
                  </h2>
                  <div className="text-sm text-gray-600 bg-gray-50/50 px-3 py-1 rounded-full">
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
                <div className="text-center text-gray-600">
                  Loading city data...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
