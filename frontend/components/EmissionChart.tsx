'use client'

import { useEffect, useRef } from 'react'
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
  const chartRef = useRef<ChartJS<"bar", number[], string>>(null)

  const data = {
    labels: ['CO₂', 'NOx', 'PM2.5'],
    datasets: [
      {
        label: 'Baseline Emissions',
        data: [baseline.co2, baseline.nox, baseline.pm25],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Projected Emissions',
        data: [projected.co2, projected.nox, projected.pm25],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
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
          color: 'rgba(156, 163, 175, 0.3)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return `${value} tons/yr`
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  }

  // Calculate reduction percentages
  const reductions = {
    co2: ((baseline.co2 - projected.co2) / baseline.co2) * 100,
    nox: ((baseline.nox - projected.nox) / baseline.nox) * 100,
    pm25: ((baseline.pm25 - projected.pm25) / baseline.pm25) * 100,
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chart */}
      <div className="h-80">
        <Bar ref={chartRef} data={data} options={options} />
      </div>

      {/* Reduction Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(reductions).map(([pollutant, reduction], index) => (
          <motion.div
            key={pollutant}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              -{reduction.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {pollutant === 'pm25' ? 'PM2.5' : pollutant.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Before Policy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>After Policy</span>
        </div>
      </div>
    </motion.div>
  )
}
