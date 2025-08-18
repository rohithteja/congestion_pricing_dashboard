from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path
from typing import List, Dict, Any
import json

from models import CityEmissionData, PolicyRequest, PolicyResponse, EmissionStats
from services.data_service import DataService

# Initialize FastAPI app
app = FastAPI(
    title="City Emissions Simulator API",
    description="API for simulating emissions reduction through congestion pricing policies",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data service
data_service = DataService()

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
