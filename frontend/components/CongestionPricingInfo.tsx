'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X, ExternalLink } from 'lucide-react'

export function CongestionPricingInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Info Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="mb-4 w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-700/30 rounded-lg text-sm text-blue-300 transition-colors group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Info className="h-4 w-4 group-hover:text-blue-200" />
        <span className="group-hover:text-blue-200">What is Congestion Pricing?</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Congestion Pricing: Policy & Science
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Definition */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">What is Congestion Pricing?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Congestion pricing is a traffic management strategy that charges drivers for entering certain areas during peak hours. 
                    By making driving more expensive, it encourages people to use public transport, carpool, or travel at different times, 
                    reducing traffic congestion and air pollution.
                  </p>
                </div>

                {/* Real-world Examples */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Real-World Success Stories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="font-semibold text-blue-300 mb-2">🇬🇧 London Congestion Charge</h4>
                      <p className="text-sm text-gray-300 mb-2">Introduced in 2003</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• <span className="text-green-400">30-40% CO₂ reduction</span> in central zone</li>
                        <li>• 30% reduction in traffic congestion</li>
                        <li>• £200M annual revenue for transport improvements</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="font-semibold text-blue-300 mb-2">🇸🇪 Stockholm Congestion Tax</h4>
                      <p className="text-sm text-gray-300 mb-2">Introduced in 2007</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• <span className="text-green-400">20-25% CO₂ reduction</span> in city center</li>
                        <li>• 22% reduction in traffic volume</li>
                        <li>• 14% reduction in PM₁₀ levels</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="font-semibold text-blue-300 mb-2">🇮🇹 Milan Area C</h4>
                      <p className="text-sm text-gray-300 mb-2">Introduced in 2012</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• <span className="text-green-400">35% CO₂ reduction</span> within zone</li>
                        <li>• 30% reduction in traffic</li>
                        <li>• 18% reduction in PM₁₀ pollution</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="font-semibold text-blue-300 mb-2">🇸🇬 Singapore ERP</h4>
                      <p className="text-sm text-gray-300 mb-2">Since 1998</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• <span className="text-green-400">15-20% CO₂ reduction</span> in peak hours</li>
                        <li>• 25% reduction in traffic during charging</li>
                        <li>• Dynamic pricing based on real-time congestion</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Our Computation */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Our Scientific Computation Model</h3>
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-5 border border-gray-600/30">
                    <h4 className="font-semibold text-emerald-300 mb-3">Methodology Based on Real-World Studies</h4>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <h5 className="font-medium text-white mb-2">1. Base Maximum Reductions (from literature):</h5>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• <span className="text-blue-300">CO₂:</span> Up to 35% (London/Milan studies)</li>
                          <li>• <span className="text-orange-300">NOx:</span> Up to 42% (improved traffic flow)</li>
                          <li>• <span className="text-red-300">PM2.5:</span> Up to 38% (reduced congestion & idling)</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-2">2. City-Specific Elasticity Factors:</h5>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• <span className="text-purple-300">Road Network Scale:</span> Extensive networks = lower per-road impact</li>
                          <li>• <span className="text-cyan-300">Population Density:</span> Higher density = greater effectiveness</li>
                          <li>• <span className="text-yellow-300">Public Transport:</span> Better alternatives = higher elasticity</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-2">3. Final Calculation:</h5>
                        <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-xs text-gray-300">
                          Reduction = Base_Max × Intensity_Factor × Road_Coverage × City_Elasticity
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-2">4. Economic Valuation:</h5>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• <span className="text-green-300">Carbon Cost:</span> $85/ton CO₂ (EPA 2023 social cost)</li>
                          <li>• <span className="text-red-300">Health Savings:</span> $60,000/ton PM2.5 (WHO studies)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Scientific References</h3>
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/20">
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li>• Transport for London (2008). "Central London Congestion Charging Scheme: Ex-post evaluation"</li>
                      <li>• Börjesson et al. (2012). "The Stockholm congestion charges—5 years on. Effects, acceptability and lessons learnt"</li>
                      <li>• Rotaris et al. (2010). "The urban road pricing scheme to curb pollution in Milan"</li>
                      <li>• EPA (2023). "Social Cost of Carbon, Methane, and Nitrous Oxide Interim Estimates"</li>
                      <li>• WHO (2021). "Ambient (outdoor) air pollution: Health impacts and economic costs"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
