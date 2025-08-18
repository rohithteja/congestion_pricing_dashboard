'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react'
import { EmissionStats, PolicyResponse } from '@/types'
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils'

interface EmissionCardsProps {
  currentStats: EmissionStats
  baselineStats: EmissionStats
  policyResult?: PolicyResponse | null
}

interface EmissionCardProps {
  title: string
  value: number
  unit: string
  baseline?: number
  reduction?: number
  icon: React.ReactNode
  color: string
  delay: number
}

function EmissionCard({ title, value, unit, baseline, reduction, icon, color, delay }: EmissionCardProps) {
  const hasReduction = reduction !== undefined && baseline !== undefined

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {hasReduction && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            reduction > 0 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {reduction > 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            <span>{formatPercentage(Math.abs(reduction))}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(value)} {unit}
          </div>
          {hasReduction && baseline && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="line-through">{formatNumber(baseline)}</span>
              <span className="ml-2 text-green-600 dark:text-green-400">
                -{formatNumber(baseline - value)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function EmissionCards({ currentStats, baselineStats, policyResult }: EmissionCardsProps) {
  const cards = [
    {
      title: 'CO₂ Emissions',
      value: currentStats.co2,
      unit: 'tons/yr',
      baseline: baselineStats.co2,
      reduction: policyResult?.reduction_percentage.co2,
      icon: <div className="w-5 h-5 bg-blue-600 rounded-full"></div>,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'NOx Emissions',
      value: currentStats.nox,
      unit: 'tons/yr',
      baseline: baselineStats.nox,
      reduction: policyResult?.reduction_percentage.nox,
      icon: <div className="w-5 h-5 bg-orange-600 rounded-full"></div>,
      color: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      title: 'PM2.5 Emissions',
      value: currentStats.pm25,
      unit: 'tons/yr',
      baseline: baselineStats.pm25,
      reduction: policyResult?.reduction_percentage.pm25,
      icon: <div className="w-5 h-5 bg-red-600 rounded-full"></div>,
      color: 'bg-red-100 dark:bg-red-900',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Emission Statistics
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <EmissionCard
            key={card.title}
            {...card}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Cost Savings Card */}
      {policyResult && (
        <motion.div
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Estimated Cost Savings</h3>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(policyResult.estimated_cost_savings)}
          </div>
          <div className="text-sm opacity-90 mt-1">
            Annual savings from reduced emissions and health costs
          </div>
        </motion.div>
      )}

      {/* Policy Impact Summary */}
      {policyResult && (
        <motion.div
          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Policy Impact Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Affected Roads:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {policyResult.affected_roads.length} roads
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Pricing Intensity:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {policyResult.pricing_intensity}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
