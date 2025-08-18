'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { EmissionStats } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface EmissionChartProps {
  baseline: EmissionStats
  projected: EmissionStats
}

export function EmissionChart({ baseline, projected }: EmissionChartProps) {
  // Calculate reduction percentages
  const reductions = {
    co2: ((baseline.co2 - projected.co2) / baseline.co2) * 100,
    nox: ((baseline.nox - projected.nox) / baseline.nox) * 100,
    pm25: ((baseline.pm25 - projected.pm25) / baseline.pm25) * 100,
  }

  // Chart data for each pollutant
  const pollutants = [
    {
      name: 'CO₂',
      baseline: baseline.co2,
      projected: projected.co2,
      color: '#3b82f6',
      reduction: reductions.co2
    },
    {
      name: 'NOx',
      baseline: baseline.nox,
      projected: projected.nox,
      color: '#f59e0b',
      reduction: reductions.nox
    },
    {
      name: 'PM2.5',
      baseline: baseline.pm25,
      projected: projected.pm25,
      color: '#ef4444',
      reduction: reductions.pm25
    }
  ]

  const createChartData = (pollutant: any) => ({
    labels: ['Baseline', 'After Policy'],
    datasets: [{
      label: `${pollutant.name} Emissions`,
      data: [pollutant.baseline, pollutant.projected],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 1,
    }]
  })

  const createChartOptions = (pollutant: any) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y
            const label = context.label === 'Baseline' ? 'Current' : 'After Policy'
            return `${label}: ${value.toFixed(2)} tons/yr`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return `${value.toFixed(0)}`
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  })

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Emissions Comparison
        </h3>
      </div>

      {/* Three separate charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pollutants.map((pollutant, index) => (
          <motion.div 
            key={pollutant.name} 
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Chart Title */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {pollutant.name} Emissions
              </h4>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                pollutant.reduction > 0 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : pollutant.reduction < 0 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>
                {pollutant.reduction > 0 ? '-' : pollutant.reduction < 0 ? '+' : ''}{Math.abs(pollutant.reduction).toFixed(1)}%
              </div>
            </div>

            {/* Chart */}
            <div className="h-32 mb-3">
              <Bar 
                data={createChartData(pollutant)} 
                options={createChartOptions(pollutant)} 
              />
            </div>
            
            {/* Bottom stats */}
            <div className="flex justify-between items-center text-xs">
              <div className="text-gray-500 dark:text-gray-400">
                Current: {pollutant.baseline.toFixed(1)} tons/yr
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                After: {pollutant.projected.toFixed(1)} tons/yr
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Overall Impact Summary
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <motion.div 
              key={`summary-${pollutant.name}`}
              className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {pollutant.name}
              </div>
              <div className={`text-lg font-bold ${
                pollutant.reduction > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : pollutant.reduction < 0 
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
              }`}>
                {pollutant.reduction > 0 ? '-' : pollutant.reduction < 0 ? '+' : ''}{Math.abs(pollutant.reduction).toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
