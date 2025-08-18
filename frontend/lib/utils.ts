import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
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
