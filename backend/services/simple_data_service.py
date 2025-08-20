import json
from pathlib import Path
from typing import List, Dict, Any

from models import CityEmissionData, PolicyResponse, EmissionStats, RoadFeature, EmissionPoint

class SimpleDataService:
    """Simplified service for loading JSON-based city data"""
    
    def __init__(self, data_dir: str = "../data"):
        self.data_dir = Path(data_dir)
        
    def load_city_data(self, city: str) -> CityEmissionData:
        """Load complete city data from simplified JSON format"""
        
        # Load the unified JSON data
        json_file = self.data_dir / city / "data.json"
        if not json_file.exists():
            raise FileNotFoundError(f"No data file found for {city}")
        
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        # Extract emission data
        emission_data = self._process_emission_data(data['emissions'])
        
        # Extract road data from GeoJSON
        road_data = self._process_road_data(data['geometry'])
        
        # Calculate baseline statistics
        baseline_stats = self._calculate_baseline_stats(data['emissions']['summary'])
        
        # Calculate bounds
        bounds = self._calculate_bounds(emission_data['coordinates'], road_data)
        
        return CityEmissionData(
            city=city,
            emission_grid=emission_data['emission_grid'],
            coordinates=emission_data['coordinates'],
            roads=road_data,
            baseline_stats=baseline_stats,
            bounds=bounds
        )
    
    def _process_emission_data(self, emission_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process emission data from JSON format"""
        
        # Extract coordinates
        coordinates = {
            'latitudes': emission_data['coordinates']['lat'],
            'longitudes': emission_data['coordinates']['lon']
        }
        
        # Use CO2 data as the main emission grid for visualization
        emission_grid = emission_data['emissions']['co2_total']
        
        return {
            'emission_grid': emission_grid,
            'coordinates': coordinates
        }
    
    def _process_road_data(self, geojson_data: Dict[str, Any]) -> List[RoadFeature]:
        """Process GeoJSON road data"""
        
        roads = []
        features = geojson_data.get('features', [])
        
        for i, feature in enumerate(features):
            # Skip features with missing or null geometry
            geometry = feature.get('geometry')
            if not geometry:
                continue
                
            # Ensure properties exist
            properties = feature.get('properties', {})
            ward_no = properties.get('Ward_No.', i + 1)
            
            # Update properties with ward information
            properties.update({
                'road_id': i,
                'name': f'Ward {ward_no}',
                'ward_number': ward_no,
                'Wards': f'W/{ward_no:02d}',  # Format as W/01, W/02, etc.
                'ward_category': 'Municipal Ward'
            })
            
            roads.append(RoadFeature(
                type=feature.get('type', 'Feature'),
                geometry=geometry,
                properties=properties
            ))
        
        return roads
    
    def _calculate_baseline_stats(self, summary: Dict[str, float]) -> EmissionStats:
        """Calculate baseline statistics from emission summary"""
        
        # Values are already in tons, keep them in tons
        co2_tons = summary['co2_total_sum']
        nox_tons = summary['nox_total_sum']
        pm25_tons = summary['pm25_total_sum']
        total_tons = co2_tons + nox_tons + pm25_tons
        
        return EmissionStats(
            co2=float(co2_tons),
            nox=float(nox_tons),
            pm25=float(pm25_tons),
            total=float(total_tons)
        )
    
    def _calculate_bounds(self, coordinates: Dict[str, List[float]], roads: List[RoadFeature]) -> Dict[str, float]:
        """Calculate bounding box for the map"""
        
        # Get bounds from coordinates
        lats = coordinates['latitudes']
        lons = coordinates['longitudes']
        
        min_lat, max_lat = min(lats), max(lats)
        min_lon, max_lon = min(lons), max(lons)
        
        # Add some padding
        lat_padding = (max_lat - min_lat) * 0.05
        lon_padding = (max_lon - min_lon) * 0.05
        
        return {
            'north': max_lat + lat_padding,
            'south': min_lat - lat_padding,
            'east': max_lon + lon_padding,
            'west': min_lon - lon_padding
        }
    
    def apply_congestion_pricing(self, city: str, selected_roads: List[int], pricing_intensity: float) -> PolicyResponse:
        """Apply congestion pricing policy and calculate projected emissions"""
        
        # Load baseline data
        baseline_data = self.load_city_data(city)
        baseline_stats = baseline_data.baseline_stats
        
        # Calculate reduction based on pricing intensity and affected roads
        # Assume linear relationship: 50% pricing intensity on 100% roads = 25% reduction
        road_coverage = len(selected_roads) / len(baseline_data.roads) if baseline_data.roads else 0.1
        
        # Base reduction rates per pollutant (at 100% intensity, 100% coverage)
        base_reductions = {
            'co2': 0.30,    # 30% max reduction for CO2
            'nox': 0.35,    # 35% max reduction for NOx
            'pm25': 0.40,   # 40% max reduction for PM2.5
        }
        
        # Calculate actual reductions
        actual_reductions = {}
        for pollutant, base_rate in base_reductions.items():
            reduction = base_rate * (pricing_intensity / 100) * road_coverage
            actual_reductions[pollutant] = min(reduction, 0.5)  # Cap at 50% reduction
        
        # Calculate projected emissions
        projected_stats = EmissionStats(
            co2=baseline_stats.co2 * (1 - actual_reductions['co2']),
            nox=baseline_stats.nox * (1 - actual_reductions['nox']),
            pm25=baseline_stats.pm25 * (1 - actual_reductions['pm25']),
            total=baseline_stats.total * (1 - actual_reductions['co2'])  # Use CO2 reduction for total
        )
        
        # Calculate percentage reductions
        reduction_percentage = {
            'co2': actual_reductions['co2'] * 100,
            'nox': actual_reductions['nox'] * 100,
            'pm25': actual_reductions['pm25'] * 100,
            'total': actual_reductions['co2'] * 100
        }
        
        # Estimate cost savings (simplified calculation)
        # Assume $50 per ton of CO2, $100 per ton of NOx, $200 per ton of PM2.5
        co2_savings = (baseline_stats.co2 - projected_stats.co2) * 50
        nox_savings = (baseline_stats.nox - projected_stats.nox) * 100
        pm25_savings = (baseline_stats.pm25 - projected_stats.pm25) * 200
        estimated_cost_savings = co2_savings + nox_savings + pm25_savings
        
        return PolicyResponse(
            city=city,
            baseline_stats=baseline_stats,
            projected_stats=projected_stats,
            reduction_percentage=reduction_percentage,
            affected_roads=selected_roads,
            pricing_intensity=pricing_intensity,
            estimated_cost_savings=float(estimated_cost_savings)
        )
    
    def get_emission_stats(self, city: str) -> EmissionStats:
        """Get emission statistics for a city"""
        city_data = self.load_city_data(city)
        return city_data.baseline_stats
