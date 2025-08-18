'use client'

import { motion } from 'framer-motion'
import { EmissionMap } from './EmissionMap'
import { EmissionCards } from './EmissionCards'
import { PolicyControls } from './PolicyControls'
import { EmissionChart } from './EmissionChart'
import { CityEmissionData, PolicyResponse, EmissionStats } from '@/types'

interface CityDetailViewProps {
  cityData: CityEmissionData
  selectedRoads: number[]
  onRoadSelect: (wardIds: number[] | ((prev: number[]) => number[])) => void
  pricingIntensity: number
  onIntensityChange: (intensity: number) => void
  onApplyPolicy: () => void
  isApplyingPolicy: boolean
  policyResult: PolicyResponse | null
  showEmissions: boolean
  onToggleEmissions: () => void
  selectedCityName: string
}

export function CityDetailView({
  cityData,
  selectedRoads,
  onRoadSelect,
  pricingIntensity,
  onIntensityChange,
  onApplyPolicy,
  isApplyingPolicy,
  policyResult,
  showEmissions,
  onToggleEmissions,
  selectedCityName
}: CityDetailViewProps) {
  const currentStats: EmissionStats = policyResult?.projected_stats || cityData?.baseline_stats || {
    co2: 0,
    nox: 0,
    pm25: 0
  }

  return (
    <div className="h-full flex flex-col">
      {/* City Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-2">
          {selectedCityName.replace(/-/g, ' ')} City Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select roads on the map to apply congestion pricing policies
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emission Map & Ward Boundaries
              </h3>
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
                  onClick={onToggleEmissions}
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
            <div className="h-[500px]">
              <EmissionMap
                cityData={cityData}
                selectedRoads={selectedRoads}
                onRoadSelect={onRoadSelect}
                showEmissions={showEmissions}
              />
            </div>
          </div>
        </motion.div>

        {/* Controls & Stats */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Policy Controls */}
          <PolicyControls
            pricingIntensity={pricingIntensity}
            onIntensityChange={onIntensityChange}
            selectedRoads={selectedRoads}
            onApplyPolicy={onApplyPolicy}
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
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Emissions Comparison
            </h3>
            <EmissionChart
              baseline={cityData.baseline_stats}
              projected={policyResult.projected_stats}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
