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
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`relative p-2 rounded-xl ${color}`}>
            <div className={`absolute inset-0 ${color} rounded-xl blur-sm opacity-20`}></div>
            <div className="relative">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {title}
            </h3>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(value)} <span className="text-sm font-medium text-gray-500">{unit}</span>
            </div>
          </div>
        </div>
        
        {hasReduction && (
          <div className="text-right">
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              reduction > 0 
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {reduction > 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              <span>{formatPercentage(Math.abs(reduction))}</span>
            </div>
            {baseline && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="line-through">{formatNumber(baseline)}</span>
              </div>
            )}
          </div>
        )}
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
      
      <div className="space-y-3">
        {cards.map((card, index) => (
          <EmissionCard
            key={card.title}
            {...card}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Compact Cost Savings */}
      {policyResult && (
        <motion.div
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <div>
                <h3 className="text-sm font-semibold">Cost Savings</h3>
                <div className="text-lg font-bold">
                  {formatCurrency(policyResult.estimated_cost_savings)}
                </div>
              </div>
            </div>
            <div className="text-xs opacity-90 text-right">
              <div>Annual savings</div>
              <div>Health + Emissions</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
