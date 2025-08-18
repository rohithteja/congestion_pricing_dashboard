'use client'

import { motion } from 'framer-motion'
import { BarChart3, ExternalLink } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                City Emissions Simulator
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Interactive Congestion Pricing Dashboard
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Created by
              </p>
              <a
                href="https://www.rohithteja.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <span>Rohith Teja</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 font-medium">Live Dashboard</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
