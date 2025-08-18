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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Policy Controls
        </h3>
      </div>

      <div className="space-y-6">
        {/* Selected Wards Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Selected Wards
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedRoads.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {selectedRoads.length === 0
              ? 'Click wards on the map to select'
              : `Ward IDs: ${selectedRoads.slice(0, 5).join(', ')}${selectedRoads.length > 5 ? '...' : ''}`
            }
          </div>
        </div>

        {/* Pricing Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Congestion Pricing Intensity
            </label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {pricingIntensity}%
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
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
              <span>No Charge</span>
              <span>Moderate</span>
              <span>High Charge</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {pricingIntensity < 25 && "💡 Low pricing may have minimal impact"}
            {pricingIntensity >= 25 && pricingIntensity < 50 && "⚖️ Balanced approach - moderate reductions"}
            {pricingIntensity >= 50 && pricingIntensity < 75 && "🎯 Significant impact expected"}
            {pricingIntensity >= 75 && "🚫 High pricing - maximum emission reduction"}
          </div>
        </div>

        {/* Apply Policy Button */}
        <motion.button
          onClick={onApplyPolicy}
          disabled={!canApplyPolicy}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
            canApplyPolicy
              ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          whileHover={canApplyPolicy ? { scale: 1.02 } : {}}
          whileTap={canApplyPolicy ? { scale: 0.98 } : {}}
        >
          {isApplying ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Applying Policy...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Apply Congestion Pricing</span>
            </>
          )}
        </motion.button>

        {!canApplyPolicy && !isApplying && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Select wards on the map to enable policy application
          </p>
        )}
      </div>
    </motion.div>
  )
}
