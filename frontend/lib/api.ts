import axios from 'axios'
import { CityEmissionData, PolicyRequest, PolicyResponse, EmissionStats } from '@/types'
import { StaticDataService } from './static-api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const USE_STATIC_MODE = !API_BASE_URL || API_BASE_URL === ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  async getCities(): Promise<string[]> {
    if (USE_STATIC_MODE) {
      return StaticDataService.getCities()
    }
    const response = await api.get('/cities')
    return response.data
  },

  async getCitiesWithPopulation(): Promise<Array<{
    name: string
    display_name: string
    population: number
    state: string
    lat: number
    lng: number
  }>> {
    if (USE_STATIC_MODE) {
      return StaticDataService.getCitiesByPopulation()
    }
    const response = await api.get('/cities/population')
    return response.data
  },

  async getCityData(city: string): Promise<CityEmissionData> {
    if (USE_STATIC_MODE) {
      return StaticDataService.getCityData(city)
    }
    const response = await api.get(`/city/${city}`)
    return response.data
  },

  async applyPolicy(request: PolicyRequest): Promise<PolicyResponse> {
    if (USE_STATIC_MODE) {
      return StaticDataService.applyPolicy(request.city, request)
    }
    const response = await api.post('/apply_policy', request)
    return response.data
  },

  async getCityStats(city: string): Promise<EmissionStats> {
    if (USE_STATIC_MODE) {
      return StaticDataService.getCityStats(city)
    }
    const response = await api.get(`/city/${city}/stats`)
    return response.data
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
