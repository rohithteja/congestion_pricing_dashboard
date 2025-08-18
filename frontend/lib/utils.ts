import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 2): string {
  // Handle million notation for large numbers
  if (Math.abs(num) >= 1000000) {
    const millions = num / 1000000
    return `${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: millions % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(millions)}M`
  }
  
  // Handle thousand notation for medium numbers
  if (Math.abs(num) >= 1000) {
    const thousands = num / 1000
    return `${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: thousands % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(thousands)}K`
  }
  
  // Handle regular numbers
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: num % 1 === 0 ? 0 : Math.min(decimals, 2),
    maximumFractionDigits: Math.min(decimals, 2),
  }).format(num)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value, 1)}%`
}

export function getEmissionColor(value: number, max: number): string {
  const intensity = value / max
  if (intensity < 0.2) return '#22c55e' // green
  if (intensity < 0.4) return '#84cc16' // lime
  if (intensity < 0.6) return '#eab308' // yellow
  if (intensity < 0.8) return '#f97316' // orange
  return '#ef4444' // red
}

export function interpolateColor(value: number, min: number, max: number): string {
  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1)
  
  // Color interpolation from green to red
  const r = Math.round(255 * normalized)
  const g = Math.round(255 * (1 - normalized))
  const b = 0
  
  return `rgb(${r}, ${g}, ${b})`
}
