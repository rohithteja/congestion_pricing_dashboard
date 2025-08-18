'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { CitySelector } from '@/components/CitySelector'
import { EmissionMap } from '@/components/EmissionMap'
import { EmissionCards } from '@/components/EmissionCards'
import { PolicyControls } from '@/components/PolicyControls'
import { EmissionChart } from '@/components/EmissionChart'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { apiService } from '@/lib/api'
import { CityEmissionData, PolicyResponse, EmissionStats } from '@/types'

export default function Home() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [cityData, setCityData] = useState<CityEmissionData | null>(null)
  const [selectedRoads, setSelectedRoads] = useState<number[]>([])
  const [pricingIntensity, setPricingIntensity] = useState<number>(50)
  const [policyResult, setPolicyResult] = useState<PolicyResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isApplyingPolicy, setIsApplyingPolicy] = useState<boolean>(false)
  const [showEmissions, setShowEmissions] = useState<boolean>(false)

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityList = await apiService.getCities()
        setCities(cityList)
        if (cityList.length > 0) {
          setSelectedCity(cityList[0])
        }
      } catch (error) {
        console.error('Error loading cities:', error)
      }
    }
    loadCities()
  }, [])

  // Load city data when city changes
  useEffect(() => {
    if (selectedCity) {
      loadCityData(selectedCity)
    }
  }, [selectedCity])

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

  const currentStats: EmissionStats = policyResult?.projected_stats || cityData?.baseline_stats || {
    co2: 0,
    nox: 0,
    pm25: 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* City Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : cityData ? (
          <>
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Map Section */}
              <motion.div
                className="xl:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Emission Map & Ward Boundaries
                    </h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded border-2 border-blue-700 bg-blue-200"></div>
                        <span className="text-gray-600 dark:text-gray-400">Unselected Ward</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded border-2 border-red-700 bg-red-200"></div>
                        <span className="text-gray-600 dark:text-gray-400">Selected Ward</span>
                      </div>
                      <button
                        onClick={() => setShowEmissions(!showEmissions)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          showEmissions 
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {showEmissions ? '🔴 Hide Grid' : '⚪ Show Grid'}
                      </button>
                    </div>
                  </div>
                  <EmissionMap
                    cityData={cityData}
                    selectedRoads={selectedRoads}
                    onRoadSelect={handleWardSelect}
                    showEmissions={showEmissions}
                  />
                </div>
              </motion.div>

              {/* Controls & Stats */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Policy Controls */}
                <PolicyControls
                  pricingIntensity={pricingIntensity}
                  onIntensityChange={setPricingIntensity}
                  selectedRoads={selectedRoads}
                  onApplyPolicy={handleApplyPolicy}
                  isApplying={isApplyingPolicy}
                />

                {/* Emission Cards */}
                <EmissionCards
                  currentStats={currentStats}
                  baselineStats={cityData.baseline_stats}
                  policyResult={policyResult}
                />
              </motion.div>
            </div>

            {/* Chart Section */}
            {policyResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Emissions Comparison
                  </h2>
                  <EmissionChart
                    baseline={cityData.baseline_stats}
                    projected={policyResult.projected_stats}
                  />
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Select a city to view emission data
          </div>
        )}
      </main>
    </div>
  )
}
