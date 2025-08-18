export interface EmissionStats {
  co2: number
  nox: number
  pm25: number
}

export interface RoadFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[][][] | number[][]
  }
  properties: {
    road_id: number
    name: string
    Id?: number
    Wards?: string
    Area?: number
    Pop_2011?: number
    Pop_2001?: number
    Area_in_HA?: number
    Density?: number
    ward_type?: string
    ward_category?: string
    [key: string]: any
  }
}

export interface CityEmissionData {
  city: string
  emission_grid: number[][]
  coordinates: {
    latitudes: number[]
    longitudes: number[]
  }
  roads: RoadFeature[]
  baseline_stats: EmissionStats
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface PolicyRequest {
  city: string
  selected_roads: number[]
  pricing_intensity: number
}

export interface PolicyResponse {
  city: string
  baseline_stats: EmissionStats
  projected_stats: EmissionStats
  reduction_percentage: {
    co2: number
    nox: number
    pm25: number
  }
  affected_roads: number[]
  pricing_intensity: number
  estimated_cost_savings: number
}
