import axios from 'axios'
import { CityEmissionData, PolicyRequest, PolicyResponse, EmissionStats } from '@/types'

// Production backend URL (update this after deploying to Render)
const PRODUCTION_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://congestion-pricing-backend.onrender.com'
const API_BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  async getCities(): Promise<string[]> {
    try {
      const response = await api.get('/cities')
      return response.data
    } catch (error) {
      console.error('Error fetching cities:', error)
      return []
    }
  },

  async getCitiesWithPopulation(): Promise<Array<{
    name: string
    display_name: string
    population: number
    state: string
    lat: number
    lng: number
  }>> {
    try {
      const response = await api.get('/cities/population')
      return response.data
    } catch (error) {
      console.error('Error fetching cities with population:', error)
      return []
    }
  },

  async getCityData(city: string): Promise<CityEmissionData> {
    try {
      const response = await api.get(`/city/${city}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching city data for ${city}:`, error)
      throw error
    }
  },

  async applyPolicy(request: PolicyRequest): Promise<PolicyResponse> {
    try {
      const response = await api.post('/apply_policy', request)
      return response.data
    } catch (error) {
      console.error('Error applying policy:', error)
      throw error
    }
  },

  async getCityStats(city: string): Promise<EmissionStats> {
    try {
      const response = await api.get(`/city/${city}/stats`)
      return response.data
    } catch (error) {
      console.error(`Error fetching stats for ${city}:`, error)
      throw error
    }
  },
}

// Add request/response interceptors for better error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
