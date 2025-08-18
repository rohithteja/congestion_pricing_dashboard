import xarray as xr
import geopandas as gpd
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict, Any
import json
from shapely.geometry import Point, LineString
from shapely.ops import transform
import pyproj

from models import CityEmissionData, PolicyResponse, EmissionStats, RoadFeature, EmissionPoint

class DataService:
    """Service for loading and processing emission and map data"""
    
    def __init__(self, data_dir: str = "../data"):
        self.data_dir = Path(data_dir)
        # Load static city dataset (population, GDP, road length, PT VKT, densities, etc.)
        try:
            static_path = self.data_dir / "others" / "df_static.csv"
            if static_path.exists():
                self.static_df = pd.read_csv(static_path)
                # normalize city name to lowercase for joins
                if "city" in self.static_df.columns:
                    self.static_df["city"] = self.static_df["city"].astype(str).str.strip().str.lower()
            else:
                self.static_df = None
        except Exception:
            self.static_df = None
        
    def load_city_data(self, city: str) -> CityEmissionData:
        """Load complete city data including emissions and roads"""
        
        # Load emission data
        emission_file = self.data_dir / city / "emissions.nc"
        if emission_file.exists():
            emission_data = self._process_emission_data(emission_file)
        else:
            print(f"Emission data not found for {city}, creating sample data")
            emission_data = self._create_sample_emission_data(city)
        
        # Load map data
        map_file = self.data_dir / city / "map.geojson"
        if map_file.exists():
            road_data = self._process_road_data(map_file)
        else:
            print(f"Map data not found for {city}, creating sample data")
            road_data = self._create_dummy_roads(city)
        
        # Calculate baseline statistics (use pollutant totals if available and static data proxies)
        baseline_stats = self._calculate_baseline_stats(emission_data, city)
        
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
    
    def _process_emission_data(self, emission_file: Path) -> Dict[str, Any]:
        """Process NetCDF emission data"""
        try:
            ds = xr.open_dataset(emission_file)
            
            # Get coordinate variables
            lat_vars = [v for v in ds.coords if 'lat' in v.lower()]
            lon_vars = [v for v in ds.coords if 'lon' in v.lower()]
            
            if not lat_vars or not lon_vars:
                raise ValueError("Latitude/longitude coordinates not found in NetCDF file")
            
            lat_var = lat_vars[0]
            lon_var = lon_vars[0]
            
            # Get emission variables (try common names, robust to naming like PM_2.5)
            emission_vars = []
            for var in ds.data_vars:
                var_lower = var.lower()
                if any(term in var_lower for term in [
                    'co2', 'nox', 'pm25', 'pm_2.5', 'pm2_5', 'pm 2.5', 'emission', 'pollutant'
                ]):
                    emission_vars.append(var)
            
            if not emission_vars:
                # Fallback to first data variable
                emission_vars = list(ds.data_vars.keys())[:1]
            
            # Extract coordinates
            lats = ds[lat_var].values
            lons = ds[lon_var].values
            
            # Process emission data (use the first matching variable as display grid)
            if len(emission_vars) > 0:
                display_grid = ds[emission_vars[0]].values
                # If 3D data, take the first time slice or sum over time
                if display_grid.ndim == 3:
                    display_grid = display_grid[0] if display_grid.shape[0] == 1 else display_grid.sum(axis=0)
                emission_grid = display_grid.tolist()
            else:
                # Create dummy data if no emission variables found
                emission_grid = np.random.rand(len(lats), len(lons)).tolist()

            # Compute pollutant-specific totals when available (do NOT sum to make a total later)
            def _sum_var(name_candidates: List[str]) -> float:
                total = 0.0
                found = False
                for var in ds.data_vars:
                    vlow = var.lower()
                    if any(c in vlow for c in name_candidates):
                        arr = ds[var].values
                        if arr.ndim == 3:
                            arr = arr[0] if arr.shape[0] == 1 else arr.sum(axis=0)
                        total += float(np.nansum(arr))
                        found = True
                return total if found else None

            co2_total = _sum_var(['co2'])
            nox_total = _sum_var(['nox'])
            pm25_total = _sum_var(['pm25', 'pm_2.5', 'pm2_5', 'pm 2.5'])
            
            result: Dict[str, Any] = {
                'emission_grid': emission_grid,
                'coordinates': {
                    'latitudes': lats.tolist(),
                    'longitudes': lons.tolist()
                }
            }
            # attach pollutant totals (convert to tons if likely kg)
            pollutant_totals: Dict[str, float] = {}
            if co2_total is not None:
                pollutant_totals['co2'] = float(co2_total) / 1000.0
            if nox_total is not None:
                pollutant_totals['nox'] = float(nox_total) / 1000.0
            if pm25_total is not None:
                pollutant_totals['pm25'] = float(pm25_total) / 1000.0
            if pollutant_totals:
                result['pollutant_totals_tons'] = pollutant_totals
            return result
            
        except Exception as e:
            # Create dummy data if file can't be read
            print(f"Error reading emission data: {e}, creating dummy data")
            lats = np.linspace(20, 30, 50)
            lons = np.linspace(70, 80, 50)
            emission_grid = np.random.rand(50, 50).tolist()
            
            return {
                'emission_grid': emission_grid,
                'coordinates': {
                    'latitudes': lats.tolist(),
                    'longitudes': lons.tolist()
                }
            }

    def _calculate_baseline_stats(self, emission_data: Dict[str, Any], city: str) -> EmissionStats:
        """Derive baseline stats. Prefer pollutant-specific totals from NetCDF if available.
        'total' is NOT computed as a sum of pollutants; it's the sum of the display emission grid.
        All pollutant totals are expressed in tons (annual scale)."""
        emission_grid = emission_data['emission_grid']
        emission_array = np.array(emission_grid)
        total_emissions = float(np.nansum(emission_array))
        # Convert grid total to tons (assume kg if magnitudes are large)
        grid_total_tons = total_emissions / 1000.0

        # Prefer NetCDF-provided pollutant totals
        co2_tons = None
        nox_tons = None
        pm25_tons = None
        if 'pollutant_totals_tons' in emission_data:
            pol = emission_data['pollutant_totals_tons']
            co2_tons = pol.get('co2')
            nox_tons = pol.get('nox')
            pm25_tons = pol.get('pm25')

        # If any are missing, estimate using static city factors as proxies
        if self.static_df is not None:
            row = self._get_static_city_row(city)
        else:
            row = None

        if co2_tons is None or nox_tons is None or pm25_tons is None:
            # Use proxy splits modulated by static indicators when actual pollutant totals unavailable
            # Base split: CO2 65%, NOx 20%, PM2.5 15%
            base_split = {
                'co2': 0.65,
                'nox': 0.20,
                'pm25': 0.15
            }
            # If strong public transport (higher vkt_public_transport per capita), NOx/PM2.5 share may be higher
            if row is not None and 'vkt_public_transport' in row and 'population_2020' in row and row['population_2020']:
                pt_per_cap = float(row['vkt_public_transport']) / float(row['population_2020'])
                pt_factor = max(0.8, min(1.2, 0.8 + pt_per_cap / 1e3))
            else:
                pt_factor = 1.0
            split = {
                'co2': base_split['co2'] * (2.0 - pt_factor) / 1.8,
                'nox': base_split['nox'] * pt_factor,
                'pm25': base_split['pm25'] * pt_factor
            }
            # Normalize split
            s = sum(split.values())
            split = {k: v / s for k, v in split.items()}
            if co2_tons is None:
                co2_tons = grid_total_tons * split['co2']
            if nox_tons is None:
                nox_tons = grid_total_tons * split['nox']
            if pm25_tons is None:
                pm25_tons = grid_total_tons * split['pm25']

        return EmissionStats(
            co2=float(co2_tons),
            nox=float(nox_tons),
            pm25=float(pm25_tons),
            total=float(grid_total_tons)
        )

    def _get_static_city_row(self, city: str) -> Dict[str, Any]:
        """Return static row for a city or empty dict."""
        if self.static_df is None:
            return {}
        try:
            row = self.static_df[self.static_df['city'] == str(city).strip().lower()].iloc[0].to_dict()
            return row
        except Exception:
            return {}
    
    def _process_road_data(self, map_file: Path) -> List[RoadFeature]:
        """Process GeoJSON road data"""
        try:
            with open(map_file, 'r') as f:
                geojson_data = json.load(f)
            
            roads = []
            features = geojson_data.get('features', [])
            
            for i, feature in enumerate(features):
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
                    geometry=feature.get('geometry', {}),
                    properties=properties
                ))
            
            return roads
            
        except Exception as e:
            # Create dummy road data if file can't be read
            print(f"Error reading road data: {e}, creating dummy data")
            return self._create_dummy_roads()
    
    def _create_sample_emission_data(self, city: str) -> Dict[str, Any]:
        """Create sample emission data for testing based on ward boundaries"""
        
        # Try to load the actual ward boundaries first to get realistic spatial extent
        map_file = self.data_dir / city / "map.geojson"
        if map_file.exists():
            try:
                # Get actual bounds from the ward boundaries
                ward_data = self._process_road_data(map_file)
                
                # Extract coordinates from all ward boundaries
                all_coords = []
                for ward in ward_data:
                    if ward.geometry and ward.geometry.get('coordinates'):
                        coords = ward.geometry['coordinates'][0]  # First ring of polygon
                        if isinstance(coords, list) and len(coords) > 0:
                            all_coords.extend(coords)
                
                if all_coords:
                    # Calculate actual bounds from ward data
                    lons = [coord[0] for coord in all_coords]
                    lats = [coord[1] for coord in all_coords]
                    
                    min_lat, max_lat = min(lats), max(lats)
                    min_lon, max_lon = min(lons), max(lons)
                    
                    # Create grid covering the actual ward area with 500m resolution
                    # Approximate 500m in degrees (varies by latitude)
                    lat_step = 0.0045  # ~500m at mid-latitudes
                    lon_step = 0.0045  # ~500m at mid-latitudes 
                    
                    # Expand bounds slightly
                    padding = 0.01  
                    min_lat -= padding
                    max_lat += padding
                    min_lon -= padding  
                    max_lon += padding
                    
                    # Create coordinate arrays
                    lats = np.arange(min_lat, max_lat, lat_step)
                    lons = np.arange(min_lon, max_lon, lon_step)
                    
                    print(f"Creating emission grid for {city}: {len(lats)}x{len(lons)} cells covering actual ward area")
                    
                else:
                    raise ValueError("No valid coordinates found in ward data")
                    
            except Exception as e:
                print(f"Could not extract bounds from ward data for {city}: {e}, using city center")
                # Fallback to city center approach
                base_lat, base_lon = self._get_city_coordinates(city)
                lat_range = 0.08
                lon_range = 0.08
                grid_size = 25
                lats = np.linspace(base_lat - lat_range/2, base_lat + lat_range/2, grid_size)
                lons = np.linspace(base_lon - lon_range/2, base_lon + lon_range/2, grid_size)
        else:
            # Fallback: use city center coordinates
            base_lat, base_lon = self._get_city_coordinates(city)
            lat_range = 0.08
            lon_range = 0.08
            grid_size = 25
            lats = np.linspace(base_lat - lat_range/2, base_lat + lat_range/2, grid_size)
            lons = np.linspace(base_lon - lon_range/2, base_lon + lon_range/2, grid_size)
        
        # Create realistic emission pattern (higher in center, lower at edges)
        emission_grid = []
        center_lat, center_lon = len(lats)//2, len(lons)//2
        
        for i in range(len(lats)):
            row = []
            for j in range(len(lons)):
                # Distance from center
                dist = np.sqrt((i - center_lat)**2 + (j - center_lon)**2)
                # Higher emissions in center, with some randomness
                base_emission = max(0, 120 - dist * 4)
                noise = np.random.normal(0, 10)
                emission = max(0, base_emission + noise)
                row.append(emission)
            emission_grid.append(row)
        
        return {
            'emission_grid': emission_grid,
            'coordinates': {
                'latitudes': lats.tolist(),
                'longitudes': lons.tolist()
            }
        }
    
    def _get_city_coordinates(self, city: str) -> tuple:
        """Get coordinates for a city - shared between emission and ward generation"""
        city_coords = {
            "kohima": (25.6747, 94.1100),
            "panaji": (15.4909, 73.8278),
            "itanagar": (27.0844, 93.6053),
            "gangtok": (27.3389, 88.6065),
            "shilong": (25.5788, 91.8933),
            "nalgonda": (17.0575, 79.2671),
            "shimla": (31.1048, 77.1734),
            "imphal": (24.8170, 93.9368),
            "rourkela": (22.2604, 84.8536),
            "siliguri": (26.7271, 88.3953),
            "durgapur": (23.5204, 87.3119),
            "dewas": (22.9659, 76.0553),
            "aizawl": (23.7271, 92.7176),
            "haldia": (22.0667, 88.0698),
            "sagar": (23.8388, 78.7378),
            "jabalpur": (23.1815, 79.9864),
            "thoothukkudi": (8.7642, 78.1348),
            "shivamogga": (13.9299, 75.5681),
            "kurnool": (15.8222, 78.0350),
            "jalpaiguri": (26.5170, 88.7196),
            "korba": (22.3475, 82.6966),
            "alwar": (27.5529, 76.6346),
            "silchar": (24.8273, 92.7979),
            "udaipur": (24.5854, 73.7125),
            "erode": (11.3410, 77.7172),
            "muzaffarpur": (26.1220, 85.3906),
            "ujjain": (23.1793, 75.7849),
            "kolhapur": (16.7050, 74.2433),
            "agartala": (23.8315, 91.2868),
            "sangli-miraj-kupwad": (16.8524, 74.5815),
            "gaya": (24.7969, 85.0002),
            "nellore": (14.4426, 79.9865),
            "jalgaon": (21.0077, 75.5626),
            "bhilainagar": (21.1950, 81.3509),
            "jhansi": (25.4484, 78.5685),
            "mangaluru": (12.9141, 74.8560),
            "patiala": (30.3398, 76.3869),
            "amravati": (20.9374, 77.7796),
            "dehradun": (30.3165, 78.0322),
            "guntur": (16.3067, 80.4365),
            "firozabad": (27.1496, 78.3949),
            "tiruppur": (11.1085, 77.3411),
            "chandigarh": (30.7333, 76.7794),
            "cuttack": (20.4625, 85.8828),
            "warangal": (17.9784, 79.5941),
            "mysuru": (12.2958, 76.6394),
            "jammu": (32.7266, 74.8570),
            "srinagar": (34.0837, 74.7973),
            "bhubaneswar": (20.2961, 85.8245),
            "vijaywada": (16.5062, 80.6480),
            "aligarh": (27.8974, 78.0880),
            "jodhpur": (26.2389, 73.0243),
            "hubli dharwad": (15.3647, 75.1240),
            "kochi": (9.9312, 76.2673),
            "solapur": (17.6599, 75.9064),
            "tiruchirappalli": (10.7905, 78.7047),
            "gurgaon": (28.4595, 77.0266),
            "jalandhar": (31.3260, 75.5762),
            "guwahati": (26.1445, 91.7362),
            "amritsar": (31.6340, 74.8723),
            "raipur": (21.2514, 81.6296),
            "bareilly": (28.3670, 79.4304),
            "kota": (25.2138, 75.8648),
            "noida": (28.5355, 77.3910),
            "rajkot": (22.3039, 70.8022),
            "moradabad": (28.8386, 78.7733),
            "aurangabad": (19.8762, 75.3433),
            "ranchi": (23.3441, 85.3096),
            "gwalior": (26.2183, 78.1828),
            "jamshedpur": (22.8046, 86.2029),
            "coimbatore": (11.0168, 76.9558),
            "meerut": (28.9845, 77.7064),
            "dhanbad": (23.7957, 86.4304),
            "allahabad": (25.4358, 81.8463),
            "madurai": (9.9252, 78.1198),
            "nashik": (19.9975, 73.7898),
            "ludhiana": (30.9005, 75.8573),
            "faridabad": (28.4089, 77.3178),
            "vadodara": (22.3072, 73.1812),
            "varanashi": (25.3176, 82.9739),
            "agra": (27.1767, 78.0081),
            "thiruvananthapuram": (8.5241, 76.9366),
            "vishakhapatnam": (17.6868, 83.2185),
            "patna": (25.5941, 85.1376),
            "ghaziabad": (28.6692, 77.4538),
            "bhopal": (23.2599, 77.4126),
            "nagpur": (21.1458, 79.0882),
            "indore": (22.7196, 75.8577),
            "kanpur": (26.4499, 80.3319),
            "jaipur": (26.9124, 75.7873),
            "lucknow": (26.8467, 80.9462),
            "pune": (18.5204, 73.8567),
            "surat": (21.1702, 72.8311),
            "kolkata": (22.5726, 88.3639),
            "hyderabad": (17.3850, 78.4867),
            "chennai": (13.0827, 80.2707),
            "ahmedabad": (23.0225, 72.5714),
            "bengaluru": (12.9716, 77.5946),
            "mumbai": (19.0760, 72.8777),
            "delhi": (28.6139, 77.2090)
        }
        
        return city_coords.get(city, (20.5937, 78.9629))  # Default to center of India
    
    def _create_dummy_roads(self, city: str = None) -> List[RoadFeature]:
        """Create dummy ward data for testing"""
        wards = []
        
        # Use the exact same city coordinates as emission data
        base_lat, base_lon = self._get_city_coordinates(city)
        
        # Create dummy municipal wards aligned with emission grid
        # Use same spatial extent as emission grid (0.08 range)
        ward_patterns = [
            # Central wards (high density, smaller areas)
            {"type": "central", "width": 0.008, "count": 4, "pop_range": (80000, 150000)},
            # Suburban wards (medium density, medium areas) 
            {"type": "suburban", "width": 0.012, "count": 6, "pop_range": (40000, 80000)},
            # Peripheral wards (lower density, larger areas)
            {"type": "peripheral", "width": 0.018, "count": 6, "pop_range": (20000, 50000)}
        ]
        
        ward_id = 0
        ward_codes = [
            "A/01", "A/02", "A/03", "B/01", "B/02", "B/03", "C/01", "C/02", "C/03", "D/01",
            "D/02", "D/03", "E/01", "E/02", "E/03", "F/01", "F/02", "F/03", "G/01", "G/02",
            "H/01", "H/02", "I/01", "I/02", "J/01", "J/02", "K/01", "K/02", "L/01", "L/02"
        ]
        
        # Use same spatial range as emission grid for ward placement
        spatial_range = 0.08 / 2  # 0.04 radius to match emission grid
        
        for pattern in ward_patterns:
            for i in range(pattern["count"]):
                # Create a polygon representing a municipal ward
                # Place within same bounds as emission grid
                center_lat = base_lat + random.uniform(-spatial_range, spatial_range)
                center_lon = base_lon + random.uniform(-spatial_range, spatial_range)
                width = pattern["width"]
                
                # Create a more realistic ward boundary polygon
                polygon_coords = []
                num_points = random.randint(10, 18)  # More complex ward boundaries
                base_radius = width
                
                for j in range(num_points):
                    angle = (2 * math.pi * j) / num_points
                    # Add some irregularity to make it look more like real ward boundaries
                    radius = base_radius * random.uniform(0.6, 1.4)
                    lat_offset = radius * math.cos(angle)
                    lon_offset = radius * math.sin(angle)
                    polygon_coords.append([
                        center_lon + lon_offset,
                        center_lat + lat_offset
                    ])
                # Close the polygon
                polygon_coords.append(polygon_coords[0])
                
                # Generate realistic ward demographics
                area_sqm = random.uniform(2000000, 8000000) * (width / 0.015)  # Area in sq meters
                area_hectares = area_sqm / 10000
                pop_min, pop_max = pattern["pop_range"]
                population_2011 = random.randint(pop_min, pop_max)
                population_2001 = int(population_2011 * random.uniform(0.75, 0.90))  # Historical growth
                density = population_2011 / area_hectares  # per hectare
                
                ward_code = ward_codes[ward_id % len(ward_codes)]
                ward_name = f"Ward {ward_code}"
                
                ward = RoadFeature(
                    road_id=ward_id,
                    name=ward_name,
                    geometry={
                        "type": "Polygon",
                        "coordinates": [polygon_coords]
                    },
                    properties={
                        "Id": ward_id,
                        "Wards": ward_code,
                        "Area": area_sqm,
                        "Pop_2011": population_2011,
                        "Pop_2001": population_2001,
                        "Area_in_HA": area_hectares,
                        "Density": round(density, 2),
                        "road_id": ward_id,
                        "name": ward_name,
                        "ward_type": pattern["type"],
                        "ward_category": "Municipal Ward"
                    },
                    emission_level=random.uniform(80, 250)  # Higher emissions in denser areas
                )
                wards.append(ward)
                ward_id += 1
        
        return wards
    
    # Old _calculate_emission_stats removed in favor of _calculate_baseline_stats
    
    def _calculate_bounds(self, coordinates: Dict[str, List[float]], roads: List[RoadFeature]) -> Dict[str, float]:
        """Calculate map bounding box"""
        lats = coordinates['latitudes']
        lons = coordinates['longitudes']
        
        return {
            'north': max(lats),
            'south': min(lats),
            'east': max(lons),
            'west': min(lons)
        }
    
    def apply_congestion_pricing(self, city: str, selected_roads: List[int], pricing_intensity: float) -> PolicyResponse:
        """Apply congestion pricing policy and calculate projected emissions"""
        
        # Load baseline data
        city_data = self.load_city_data(city)
        static_row = self._get_static_city_row(city)

        # Coverage and intensity
        road_coverage = len(selected_roads) / max(len(city_data.roads), 1)
        intensity_factor = pricing_intensity / 100.0

        # Elasticities influenced by city characteristics
        road_length_km = float(static_row.get('road_length_km', 2000) or 2000)
        rho_i = float(static_row.get('rho_i', 150) or 150)
        population = float(static_row.get('population_2020', 1e6) or 1e6)
        vkt_pt = float(static_row.get('vkt_public_transport', 5e7) or 5e7)
        pt_per_cap = vkt_pt / max(population, 1.0)

        # Normalize modifiers based on real-world congestion pricing effectiveness studies
        # Cities with extensive road networks have lower per-road impact
        road_scale = max(0.7, min(1.3, 1.0 - (road_length_km / 15000.0)))
        # Higher density cities show greater congestion pricing effectiveness
        density_scale = max(0.9, min(1.6, 0.9 + rho_i / 250.0))
        # Better public transport increases elasticity (people have alternatives)
        pt_scale = max(1.0, min(1.8, 1.0 + pt_per_cap / 1500.0))

        # Base max reductions by pollutant based on real-world congestion pricing studies
        # London: 30-40% CO2 reduction, Stockholm: 20-25%, Milan: 35%, Singapore: 15-20%
        # NOx and PM2.5 reductions are typically higher due to reduced congestion and engine efficiency
        base_max = {
            'co2': 0.35,    # Up to 35% CO2 reduction (based on London/Milan studies)
            'nox': 0.42,    # Up to 42% NOx reduction (higher due to traffic flow improvements)
            'pm25': 0.38    # Up to 38% PM2.5 reduction (from reduced congestion and idling)
        }

        elasticity = road_scale * density_scale * pt_scale
        # Allow higher elasticity based on research from successful congestion pricing cities
        elasticity = max(0.8, min(2.2, elasticity))

        co2_reduction = min(base_max['co2'], base_max['co2'] * intensity_factor * road_coverage * elasticity)
        nox_reduction = min(base_max['nox'], base_max['nox'] * intensity_factor * road_coverage * elasticity)
        pm25_reduction = min(base_max['pm25'], base_max['pm25'] * intensity_factor * road_coverage * elasticity)

        # Apply reduction to each pollutant; total scales by average reduction (not sum of pollutants)
        baseline = city_data.baseline_stats
        projected_stats = EmissionStats(
            co2=baseline.co2 * (1 - co2_reduction),
            nox=baseline.nox * (1 - nox_reduction),
            pm25=baseline.pm25 * (1 - pm25_reduction),
            total=baseline.total * (1 - (co2_reduction + nox_reduction + pm25_reduction) / 3.0)
        )

        # Percentage reductions (safe divide)
        reduction_percentage = {
            'co2': (baseline.co2 - projected_stats.co2) / max(baseline.co2, 1e-9) * 100,
            'nox': (baseline.nox - projected_stats.nox) / max(baseline.nox, 1e-9) * 100,
            'pm25': (baseline.pm25 - projected_stats.pm25) / max(baseline.pm25, 1e-9) * 100,
            'total': (baseline.total - projected_stats.total) / max(baseline.total, 1e-9) * 100
        }

        # Updated cost savings based on current carbon pricing and health impact studies
        # Social cost of carbon: $75-100/ton (EPA 2023), using conservative $85
        # PM2.5 health costs: $50,000-75,000/ton (WHO studies), using $60,000
        co2_cost_per_ton = 85.0
        pm25_health_per_ton = 60000.0

        co2_savings = (baseline.co2 - projected_stats.co2) * co2_cost_per_ton
        health_savings = (baseline.pm25 - projected_stats.pm25) * pm25_health_per_ton
        estimated_cost_savings = float(co2_savings + health_savings)
        
        return PolicyResponse(
            city=city,
            baseline_stats=baseline,
            projected_stats=projected_stats,
            reduction_percentage=reduction_percentage,
            affected_roads=selected_roads,
            pricing_intensity=pricing_intensity,
            estimated_cost_savings=estimated_cost_savings
        )
    
    def get_emission_stats(self, city: str) -> EmissionStats:
        """Get emission statistics for a city"""
        city_data = self.load_city_data(city)
        return city_data.baseline_stats
