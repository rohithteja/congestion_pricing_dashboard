from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path
from typing import List, Dict, Any
import json
import pandas as pd

from models import CityEmissionData, PolicyRequest, PolicyResponse, EmissionStats
from services.simple_data_service import SimpleDataService

# Initialize FastAPI app
app = FastAPI(
    title="City Emissions Simulator API",
    description="API for simulating emissions reduction through congestion pricing policies",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "https://congestion-pricing-dashboard.vercel.app",
        "https://congestion-pricing-dashboard-*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data service
data_service = SimpleDataService()

# City coordinates mapping (lat, lng)
CITY_COORDINATES = {
    'kohima': [25.6747, 94.1100],
    'panaji': [15.4909, 73.8278],
    'itanagar': [27.0844, 93.6053],
    'gangtok': [27.3389, 88.6065],
    'shilong': [25.5788, 91.8933],
    'nalgonda': [17.0575, 79.2671],
    'shimla': [31.1048, 77.1734],
    'imphal': [24.8170, 93.9368],
    'rourkela': [22.2604, 84.8536],
    'siliguri': [26.7271, 88.3953],
    'durgapur': [23.5204, 87.3119],
    'dewas': [22.9659, 76.0553],
    'aizawl': [23.7271, 92.7176],
    'haldia': [22.0667, 88.0698],
    'sagar': [23.8388, 78.7378],
    'jabalpur': [23.1815, 79.9864],
    'thoothukkudi': [8.7642, 78.1348],
    'shivamogga': [13.9299, 75.5681],
    'kurnool': [15.8222, 78.0350],
    'jalpaiguri': [26.5170, 88.7196],
    'korba': [22.3475, 82.6966],
    'alwar': [27.5529, 76.6346],
    'silchar': [24.8273, 92.7979],
    'udaipur': [24.5854, 73.7125],
    'erode': [11.3410, 77.7172],
    'muzaffarpur': [26.1220, 85.3906],
    'ujjain': [23.1793, 75.7849],
    'kolhapur': [16.7050, 74.2433],
    'agartala': [23.8315, 91.2868],
    'sangli-miraj-kupwad': [16.8524, 74.5815],
    'gaya': [24.7969, 85.0002],
    'nellore': [14.4426, 79.9865],
    'jalgaon': [21.0077, 75.5626],
    'bhilainagar': [21.1950, 81.3509],
    'jhansi': [25.4484, 78.5685],
    'mangaluru': [12.9141, 74.8560],
    'patiala': [30.3398, 76.3869],
    'amravati': [20.9374, 77.7796],
    'dehradun': [30.3165, 78.0322],
    'guntur': [16.3067, 80.4365],
    'firozabad': [27.1496, 78.3949],
    'tiruppur': [11.1085, 77.3411],
    'chandigarh': [30.7333, 76.7794],
    'cuttack': [20.4625, 85.8828],
    'warangal': [17.9784, 79.5941],
    'mysuru': [12.2958, 76.6394],
    'jammu': [32.7266, 74.8570],
    'srinagar': [34.0837, 74.7973],
    'bhubaneswar': [20.2961, 85.8245],
    'vijaywada': [16.5062, 80.6480],
    'aligarh': [27.8974, 78.0880],
    'jodhpur': [26.2389, 73.0243],
    'hubli dharwad': [15.3647, 75.1240],
    'kochi': [9.9312, 76.2673],
    'solapur': [17.6599, 75.9064],
    'tiruchirappalli': [10.7905, 78.7047],
    'gurgaon': [28.4595, 77.0266],
    'jalandhar': [31.3260, 75.5762],
    'guwahati': [26.1445, 91.7362],
    'amritsar': [31.6340, 74.8723],
    'raipur': [21.2514, 81.6296],
    'bareilly': [28.3670, 79.4304],
    'kota': [25.2138, 75.8648],
    'noida': [28.5355, 77.3910],
    'rajkot': [22.3039, 70.8022],
    'moradabad': [28.8386, 78.7733],
    'aurangabad': [19.8762, 75.3433],
    'ranchi': [23.3441, 85.3096],
    'gwalior': [26.2183, 78.1828],
    'jamshedpur': [22.8046, 86.2029],
    'coimbatore': [11.0168, 76.9558],
    'meerut': [28.9845, 77.7064],
    'dhanbad': [23.7957, 86.4304],
    'allahabad': [25.4358, 81.8463],
    'madurai': [9.9252, 78.1198],
    'nashik': [19.9975, 73.7898],
    'ludhiana': [30.9005, 75.8573],
    'faridabad': [28.4089, 77.3178],
    'vadodara': [22.3072, 73.1812],
    'varanashi': [25.3176, 82.9739],
    'agra': [27.1767, 78.0081],
    'thiruvananthapuram': [8.5241, 76.9366],
    'vishakhapatnam': [17.6868, 83.2185],
    'patna': [25.5941, 85.1376],
    'ghaziabad': [28.6692, 77.4538],
    'bhopal': [23.2599, 77.4126],
    'nagpur': [21.1458, 79.0882],
    'indore': [22.7196, 75.8577],
    'kanpur': [26.4499, 80.3319],
    'jaipur': [26.9124, 75.7873],
    'lucknow': [26.8467, 80.9462],
    'pune': [18.5204, 73.8567],
    'surat': [21.1702, 72.8311],
    'kolkata': [22.5726, 88.3639],
    'hyderabad': [17.3850, 78.4867],
    'chennai': [13.0827, 80.2707],
    'ahmedabad': [23.0225, 72.5714],
    'bengaluru': [12.9716, 77.5946],
    'mumbai': [19.0760, 72.8777],
    'delhi': [28.6139, 77.2090]
}

# City list
CITIES = [
    'kohima', 'panaji', 'itanagar', 'gangtok', 'shilong', 'nalgonda', 'shimla', 'imphal', 'rourkela', 'siliguri',
    'durgapur', 'dewas', 'aizawl', 'haldia', 'sagar', 'jabalpur', 'thoothukkudi', 'shivamogga', 'kurnool', 
    'jalpaiguri', 'korba', 'alwar', 'silchar', 'udaipur', 'erode', 'muzaffarpur', 'ujjain', 'kolhapur', 
    'agartala', 'sangli-miraj-kupwad', 'gaya', 'nellore', 'jalgaon', 'bhilainagar', 'jhansi', 'mangaluru', 
    'patiala', 'amravati', 'dehradun', 'guntur', 'firozabad', 'tiruppur', 'chandigarh', 'cuttack', 'warangal', 
    'mysuru', 'jammu', 'srinagar', 'bhubaneswar', 'vijaywada', 'aligarh', 'jodhpur', 'hubli dharwad', 'kochi', 
    'solapur', 'tiruchirappalli', 'gurgaon', 'jalandhar', 'guwahati', 'amritsar', 'raipur', 'bareilly', 'kota', 
    'noida', 'rajkot', 'moradabad', 'aurangabad', 'ranchi', 'gwalior', 'jamshedpur', 'coimbatore', 'meerut', 
    'dhanbad', 'allahabad', 'madurai', 'nashik', 'ludhiana', 'faridabad', 'vadodara', 'varanashi', 'agra', 
    'thiruvananthapuram', 'vishakhapatnam', 'patna', 'ghaziabad', 'bhopal', 'nagpur', 'indore', 'kanpur', 
    'jaipur', 'lucknow', 'pune', 'surat', 'kolkata', 'hyderabad', 'chennai', 'ahmedabad', 'bengaluru', 'mumbai', 'delhi'
]

@app.get("/")
async def root():
    return {"message": "City Emissions Simulator API", "version": "1.0.0", "cities_count": len(CITIES)}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/cities", response_model=List[str])
async def get_cities():
    """Get list of all available cities"""
    return CITIES

@app.get("/cities/population")
async def get_cities_with_population():
    """Get cities with their population data for the India map"""
    try:
        # Load the static data CSV from data folder - robust path resolution
        current_dir = Path(__file__).parent
        csv_path = None
        
        # Try different possible locations for the CSV file
        possible_paths = [
            current_dir.parent / "data" / "others" / "df_static.csv",  # ../data/others/
            current_dir / "data" / "others" / "df_static.csv",         # ./data/others/
            Path("data/others/df_static.csv"),                        # relative to cwd
            Path("/tmp/data/others/df_static.csv"),                   # vercel tmp
        ]
        
        for path in possible_paths:
            if path.exists():
                csv_path = path
                break
        
        if csv_path is None:
            raise FileNotFoundError("df_static.csv not found in any expected location")
            
        df = pd.read_csv(csv_path)
        
        # Create a list of cities with their data
        cities_data = []
        for _, row in df.iterrows():
            city_name = row['city'].lower()
            if city_name in CITIES:
                coordinates = CITY_COORDINATES.get(city_name)
                if coordinates:  # Only include cities we have coordinates for
                    cities_data.append({
                        "name": city_name,
                        "display_name": row['city'].title(),
                        "population": int(row['population_2020']),
                        "state": row['state'],
                        "coordinates": coordinates,
                        "lat": coordinates[0],
                        "lng": coordinates[1]
                    })
        
        return cities_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading population data: {str(e)}")

@app.get("/city/{city}", response_model=CityEmissionData)
async def get_city_data(city: str):
    """Get baseline emissions data for a specific city"""
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found")
    
    try:
        city_data = data_service.load_city_data(city)
        return city_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data not found for city '{city}'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading city data: {str(e)}")

@app.post("/apply_policy", response_model=PolicyResponse)
async def apply_congestion_pricing(policy_request: PolicyRequest):
    """Apply congestion pricing policy to selected roads and calculate new emissions"""
    if policy_request.city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{policy_request.city}' not found")
    
    try:
        result = data_service.apply_congestion_pricing(
            city=policy_request.city,
            selected_roads=policy_request.selected_roads,
            pricing_intensity=policy_request.pricing_intensity
        )
        return result
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data not found for city '{policy_request.city}'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying policy: {str(e)}")

@app.get("/city/{city}/stats", response_model=EmissionStats)
async def get_city_stats(city: str):
    """Get emission statistics for a city"""
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found")
    
    try:
        stats = data_service.get_emission_stats(city)
        return stats
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data not found for city '{city}'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting city stats: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
