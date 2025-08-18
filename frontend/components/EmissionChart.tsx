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
      className="bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-20"></div>
          <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Emissions Comparison
        </h3>
      </div>

      {/* Three separate charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pollutants.map((pollutant, index) => (
          <motion.div 
            key={pollutant.name} 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            {/* Chart Title */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-200">
                {pollutant.name} Emissions
              </h4>
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                pollutant.reduction > 0 
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' 
                  : pollutant.reduction < 0 
                    ? 'bg-red-900/30 text-red-400 border border-red-800/50' 
                    : 'bg-gray-800/30 text-gray-400 border border-gray-700/50'
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
              <div className="text-gray-500">
                Current: {pollutant.baseline.toFixed(1)} tons/yr
              </div>
              <div className="text-gray-300 font-semibold">
                After: {pollutant.projected.toFixed(1)} tons/yr
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Overall Impact Summary
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <motion.div 
              key={`summary-${pollutant.name}`}
              className="text-center p-3 bg-gray-800/50 rounded-xl border border-gray-700/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: "easeOut" }}
            >
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {pollutant.name}
              </div>
              <div className={`text-lg font-bold ${
                pollutant.reduction > 0 
                  ? 'text-emerald-400' 
                  : pollutant.reduction < 0 
                    ? 'text-red-400'
                    : 'text-gray-400'
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
