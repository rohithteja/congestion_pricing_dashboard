import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface CityData {
  name: string
  display_name: string
  population: number
  state: string
  lat: number
  lng: number
}

interface LeafletMapProps {
  citiesData: CityData[]
  onCitySelect: (cityName: string) => void
  selectedCity?: string
}

export default function LeafletMap({ citiesData, onCitySelect, selectedCity }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on India
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      doubleClickZoom: true
    })

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !citiesData.length) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Calculate population range for sizing
    const populations = citiesData.map(city => city.population)
    const minPop = Math.min(...populations)
    const maxPop = Math.max(...populations)

    // Add markers for each city
    citiesData.forEach(city => {
      if (!mapInstanceRef.current) return

      // Calculate marker size based on population (5-25px radius)
      const normalizedSize = (city.population - minPop) / (maxPop - minPop)
      const radius = 5 + (normalizedSize * 20)

      // Create circle marker
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: radius,
        fillColor: selectedCity === city.name ? '#ef4444' : '#3b82f6',
        color: selectedCity === city.name ? '#dc2626' : '#1d4ed8',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6
      })

      // Add popup with city information
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg">${city.display_name}</h3>
          <p class="text-sm text-gray-600">${city.state}</p>
          <p class="text-sm"><strong>Population:</strong> ${city.population.toLocaleString()}</p>
          <p class="text-xs text-blue-600 mt-1">Click to explore this city</p>
        </div>
      `
      
      marker.bindPopup(popupContent)

      // Add click handler
      marker.on('click', () => {
        onCitySelect(city.name)
      })

      // Add hover effects
      marker.on('mouseover', function(this: L.CircleMarker, e) {
        this.setStyle({
          fillOpacity: 0.9,
          weight: 3
        })
      })

      marker.on('mouseout', function(this: L.CircleMarker, e) {
        this.setStyle({
          fillOpacity: 0.6,
          weight: 2
        })
      })

      marker.addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
    })
  }, [citiesData, selectedCity, onCitySelect])

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700"
      style={{ minHeight: '500px' }}
    />
  )
}
