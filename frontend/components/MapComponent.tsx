'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CityEmissionData } from '@/types'
import { getEmissionColor } from '@/lib/utils'

// Fix for default markers
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface MapComponentProps {
  cityData: CityEmissionData
  selectedRoads: number[]
  onRoadSelect: (roadIds: number[]) => void
  showEmissions?: boolean
}

interface EmissionHeatmapProps {
  emissionGrid: number[][]
  coordinates: { latitudes: number[]; longitudes: number[] }
  showEmissions: boolean
}

function EmissionHeatmap({ emissionGrid, coordinates, showEmissions }: EmissionHeatmapProps) {
  const map = useMap()

  useEffect(() => {
    // Always clear existing emission layers first
    map.eachLayer((layer) => {
      if ((layer as any).isEmissionLayer) {
        map.removeLayer(layer)
      }
    })

    // Only create new layers if showEmissions is true
    if (!showEmissions || !emissionGrid.length || !coordinates.latitudes.length) {
      return
    }

    const { latitudes, longitudes } = coordinates
    const maxEmission = Math.max(...emissionGrid.flat())
    
    // Calculate grid cell size (500m resolution)
    const latStep = latitudes.length > 1 ? Math.abs(latitudes[1] - latitudes[0]) : 0.005
    const lonStep = longitudes.length > 1 ? Math.abs(longitudes[1] - longitudes[0]) : 0.005

    // Create grid rectangles for emission data
    emissionGrid.forEach((row, i) => {
      row.forEach((emission, j) => {
        if (emission > 0 && latitudes[i] && longitudes[j]) {
          const lat = latitudes[i]
          const lon = longitudes[j]
          
          // Create bounds for the 500m grid cell
          const bounds: L.LatLngBoundsExpression = [
            [lat - latStep/2, lon - lonStep/2],  // Southwest corner
            [lat + latStep/2, lon + lonStep/2]   // Northeast corner
          ]
          
          // Calculate opacity and color based on emission value
          const normalizedEmission = emission / maxEmission
          const opacity = Math.max(0.2, normalizedEmission * 0.8) // Min 0.2, max 0.8 opacity
          const color = getEmissionColor(emission, maxEmission)
          
          // Create rectangle for this grid cell
          const rectangle = L.rectangle(bounds, {
            fillColor: color,
            fillOpacity: opacity,
            color: color,
            weight: 0.5,
            opacity: 0.8
          })
          
          // Add tooltip with emission value
          rectangle.bindTooltip(`Emission: ${emission.toFixed(2)} μg/m³`, {
            permanent: false,
            direction: 'top'
          })
          
          ;(rectangle as any).isEmissionLayer = true
          rectangle.addTo(map)
        }
      })
    })

  }, [map, emissionGrid, coordinates, showEmissions])

  return null
}

export default function MapComponent({ cityData, selectedRoads, onRoadSelect, showEmissions = true }: MapComponentProps) {
  const center: [number, number] = [
    (cityData.bounds.north + cityData.bounds.south) / 2,
    (cityData.bounds.east + cityData.bounds.west) / 2
  ]
  
  const wardLayersRef = useRef<Map<number, L.Layer>>(new Map())
  const selectedRoadsRef = useRef<number[]>(selectedRoads)

  // Keep ref in sync with props
  useEffect(() => {
    selectedRoadsRef.current = selectedRoads
  }, [selectedRoads])

  const wardStyle = (feature: any) => {
    const wardId = feature.properties.road_id
    const isSelected = selectedRoadsRef.current.includes(wardId)
    
    return {
      color: isSelected ? '#dc2626' : '#1e40af',
      weight: isSelected ? 3 : 2,
      opacity: isSelected ? 1.0 : 0.7,
      fillColor: isSelected ? '#ef4444' : '#3b82f6',
      fillOpacity: isSelected ? 0.5 : 0.15,
      dashArray: isSelected ? undefined : '3, 3',
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    const wardId = feature.properties.road_id
    
    // Store layer reference for later style updates
    wardLayersRef.current.set(wardId, layer)
    
    // Simple click to select/deselect - no popup
    layer.on('click', () => {
      // Use a callback to get the latest selectedRoads state
      onRoadSelect((currentSelection: number[]) => {
        const wasSelected = currentSelection.includes(wardId)
        const newSelection = wasSelected
          ? currentSelection.filter(id => id !== wardId)
          : [...currentSelection, wardId]
        console.log(`Ward ${wardId} clicked. Was selected: ${wasSelected}, Current: ${currentSelection}, New selection:`, newSelection)
        
        // Immediately update styles for all wards with the new selection
        wardLayersRef.current.forEach((wardLayer, id) => {
          const isNowSelected = newSelection.includes(id)
          const newStyle = {
            color: isNowSelected ? '#dc2626' : '#1e40af',
            weight: isNowSelected ? 3 : 2,
            opacity: isNowSelected ? 1.0 : 0.7,
            fillColor: isNowSelected ? '#ef4444' : '#3b82f6',
            fillOpacity: isNowSelected ? 0.5 : 0.15,
            dashArray: isNowSelected ? undefined : '3, 3',
          }
          wardLayer.setStyle(newStyle)
        })
        
        return newSelection
      })
    })

    // Hover effects for better UX
    layer.on('mouseover', () => {
      const isSelected = selectedRoadsRef.current.includes(wardId)
      layer.setStyle({
        weight: 4,
        opacity: 1,
        fillOpacity: isSelected ? 0.7 : 0.6,
        color: isSelected ? '#dc2626' : '#1e40af',
        fillColor: isSelected ? '#ef4444' : '#3b82f6',
      })
    })

    layer.on('mouseout', () => {
      layer.setStyle(wardStyle(feature))
    })
  }
  
  // Update ward styles when selection changes
  useEffect(() => {
    console.log('Updating ward styles for selection:', selectedRoads)
    wardLayersRef.current.forEach((layer, wardId) => {
      const isSelected = selectedRoads.includes(wardId)
      const newStyle = {
        color: isSelected ? '#dc2626' : '#1e40af',
        weight: isSelected ? 3 : 2,
        opacity: isSelected ? 1.0 : 0.7,
        fillColor: isSelected ? '#ef4444' : '#3b82f6',
        fillOpacity: isSelected ? 0.5 : 0.15,
        dashArray: isSelected ? undefined : '3, 3',
      }
      console.log(`Ward ${wardId}: ${isSelected ? 'SELECTED' : 'unselected'}`, newStyle)
      layer.setStyle(newStyle)
    })
  }, [selectedRoads])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Emission Heatmap */}
      <EmissionHeatmap
        emissionGrid={cityData.emission_grid}
        coordinates={cityData.coordinates}
        showEmissions={showEmissions}
      />
      
      {/* Ward Boundaries */}
      {cityData.roads.map((ward, index) => (
        <GeoJSON
          key={`ward-${index}`}
          data={ward as any}
          style={wardStyle}
          onEachFeature={onEachFeature}
        />
      ))}
    </MapContainer>
  )
}
