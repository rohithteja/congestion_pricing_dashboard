'use client'

import { motion } from 'framer-motion'
import { Play, Settings } from 'lucide-react'
import { CongestionPricingInfo } from './CongestionPricingInfo'

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
      className="bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Congestion Pricing Information */}
      <CongestionPricingInfo />

      <div className="flex items-center space-x-3 mb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur-sm opacity-20"></div>
          <div className="relative p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Settings className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Policy Controls
        </h3>
      </div>

      <div className="space-y-4">
        {/* Compact Selected Wards Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Selected Wards
            </div>
            <div className="text-xl font-bold text-gray-200">
              {selectedRoads.length}
            </div>
          </div>
          {selectedRoads.length === 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Click wards on the map to select
            </div>
          )}
        </div>

        {/* Compact Pricing Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-300">
              Pricing Intensity
            </label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-200">
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
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
            canApplyPolicy
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canApplyPolicy ? { scale: 1.02, y: -1 } : {}}
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
          <p className="text-xs text-gray-500 text-center">
            Select wards to enable policy
          </p>
        )}
      </div>
    </motion.div>
  )
}
