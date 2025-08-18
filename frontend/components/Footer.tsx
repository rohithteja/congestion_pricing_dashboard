'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, ExternalLink, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-xl border-t border-gray-800/50 mt-12">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left side - Project info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by a single person</span>
            </div>
            <p className="text-xs text-gray-500 text-center md:text-left">
              Interactive dashboard for urban emissions analysis and congestion pricing simulation
            </p>
          </div>

          {/* Center - Tech stack */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Next.js</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>FastAPI</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span>Python</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span>Leaflet</span>
            </div>
          </div>

          {/* Right side - Personal links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.rohithteja.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/rohithteja"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/rohithteja"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom line */}
        <motion.div
          className="mt-6 pt-6 border-t border-gray-800/50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <p className="text-xs text-gray-500">
            © 2025 Rohith Teja. Data Scientist. Urban Mobility.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
