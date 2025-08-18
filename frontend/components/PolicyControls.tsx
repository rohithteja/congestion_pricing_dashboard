'use client'

import { motion } from 'framer-motion'
import { Play, Settings } from 'lucide-react'

interface PolicyControlsProps {
  pricingIntensity: number
  onIntensityChange: (value: number) => void
  selectedRoads: number[]
  onApplyPolicy: () => void
  isApplying: boolean
}

export function PolicyControls({
  pricingIntensity,
  onIntensityChange,
  selectedRoads,
  onApplyPolicy,
  isApplying
}: PolicyControlsProps) {
  const canApplyPolicy = selectedRoads.length > 0 && !isApplying

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-4 w-4 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Policy Controls
        </h3>
      </div>

      <div className="space-y-4">
        {/* Compact Selected Wards Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected Wards
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedRoads.length}
            </div>
          </div>
          {selectedRoads.length === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click wards on the map to select
            </div>
          )}
        </div>

        {/* Compact Pricing Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pricing Intensity
            </label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {pricingIntensity}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={pricingIntensity}
              onChange={(e) => onIntensityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${pricingIntensity}%, #e5e7eb ${pricingIntensity}%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {pricingIntensity < 25 && "💡 Minimal impact"}
            {pricingIntensity >= 25 && pricingIntensity < 50 && "⚖️ Moderate reductions"}
            {pricingIntensity >= 50 && pricingIntensity < 75 && "🎯 Significant impact"}
            {pricingIntensity >= 75 && "🚫 Maximum reduction"}
          </div>
        </div>

        {/* Compact Apply Policy Button */}
        <motion.button
          onClick={onApplyPolicy}
          disabled={!canApplyPolicy}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
            canApplyPolicy
              ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          whileHover={canApplyPolicy ? { scale: 1.02 } : {}}
          whileTap={canApplyPolicy ? { scale: 0.98 } : {}}
        >
          {isApplying ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Applying...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Apply Policy</span>
            </>
          )}
        </motion.button>

        {!canApplyPolicy && !isApplying && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Select wards to enable policy
          </p>
        )}
      </div>
    </motion.div>
  )
}
