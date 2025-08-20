from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data service
data_service = SimpleDataService()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "City Emissions Simulator API", "version": "1.0.0"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": pd.Timestamp.now().isoformat()}

# Get list of available cities
@app.get("/cities")
async def get_cities():
    """Get list of all available cities"""
    try:
        cities = data_service.get_available_cities()
        return cities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cities: {str(e)}")

# Get cities ranked by population
@app.get("/cities/population")
async def get_cities_by_population():
    """Get cities ranked by population (highest first)"""
    try:
        cities = data_service.get_cities_by_population()
        return cities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cities by population: {str(e)}")

# Get city data
@app.get("/city/{city_name}")
async def get_city_data(city_name: str):
    """Get emission data for a specific city"""
    try:
        city_data = data_service.load_city_data(city_name)
        
        # Convert to response format
        response_data = {
            "city": city_data.city,
            "roads": city_data.roads,
            "emission_grid": city_data.emission_grid,
            "bounds": city_data.bounds,
            "baseline_stats": {
                "co2": city_data.baseline_stats.co2,
                "nox": city_data.baseline_stats.nox,
                "pm25": city_data.baseline_stats.pm25
            },
            "metadata": city_data.metadata,
            "static_info": city_data.static_info
        }
        
        return response_data
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading city data: {str(e)}")

# Get city emission statistics
@app.get("/city/{city_name}/stats", response_model=EmissionStats)
async def get_city_stats(city_name: str):
    """Get baseline emission statistics for a city"""
    try:
        city_data = data_service.load_city_data(city_name)
        return city_data.baseline_stats
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")

# Apply congestion pricing policy
@app.post("/apply_policy", response_model=PolicyResponse)
async def apply_congestion_pricing(policy_request: PolicyRequest):
    """Apply congestion pricing policy and return emission reductions"""
    try:
        # Load city data
        city_data = data_service.load_city_data(policy_request.city)
        
        # Apply policy
        result = data_service.apply_congestion_pricing(
            city_data, 
            policy_request.selected_roads, 
            policy_request.pricing_intensity
        )
        
        return result
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"City '{policy_request.city}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying policy: {str(e)}")

# Get emission reduction potential for a city
@app.get("/city/{city_name}/potential")
async def get_reduction_potential(city_name: str):
    """Get maximum emission reduction potential for a city"""
    try:
        city_data = data_service.load_city_data(city_name)
        
        # Calculate maximum potential (all roads, 100% intensity)
        all_roads = list(range(len(city_data.roads)))
        max_result = data_service.apply_congestion_pricing(city_data, all_roads, 100.0)
        
        return {
            "city": city_name,
            "max_reduction_potential": {
                "co2_reduction": max_result.emission_reduction.co2,
                "nox_reduction": max_result.emission_reduction.nox,
                "pm25_reduction": max_result.emission_reduction.pm25,
                "total_roads": len(all_roads)
            }
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating potential: {str(e)}")

# Compare cities
@app.get("/compare")
async def compare_cities(cities: str):
    """Compare emission statistics across multiple cities"""
    try:
        city_list = [city.strip() for city in cities.split(',')]
        
        comparisons = []
        for city_name in city_list:
            try:
                city_data = data_service.load_city_data(city_name)
                comparisons.append({
                    "city": city_name,
                    "stats": {
                        "co2": city_data.baseline_stats.co2,
                        "nox": city_data.baseline_stats.nox,
                        "pm25": city_data.baseline_stats.pm25
                    },
                    "road_count": len(city_data.roads),
                    "static_info": city_data.static_info
                })
            except FileNotFoundError:
                comparisons.append({
                    "city": city_name,
                    "error": "City not found"
                })
        
        return {"comparisons": comparisons}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing cities: {str(e)}")

# Test endpoint for development
@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    try:
        cities = data_service.get_available_cities()
        return {
            "status": "API is working",
            "available_cities": len(cities),
            "sample_cities": cities[:5] if cities else []
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Vercel serverless function handler
from fastapi import Request
from starlette.responses import Response

async def handler(request: Request) -> Response:
    return await app(request.scope, request.receive, request._send)

# Export for Vercel
def handler_func(request, context):
    import asyncio
    from starlette.applications import Starlette
    from starlette.routing import Mount
    from starlette.requests import Request as StarletteRequest
    
    # Create a Starlette request from Vercel request
    scope = {
        'type': 'http',
        'method': request.method,
        'path': request.path,
        'query_string': request.query_string.encode() if hasattr(request, 'query_string') else b'',
        'headers': [(k.encode(), v.encode()) for k, v in request.headers.items()],
    }
    
    async def receive():
        return {
            'type': 'http.request',
            'body': request.body if hasattr(request, 'body') else b'',
        }
    
    response_data = {}
    
    async def send(message):
        if message['type'] == 'http.response.start':
            response_data['status'] = message['status']
            response_data['headers'] = message.get('headers', [])
        elif message['type'] == 'http.response.body':
            response_data['body'] = message.get('body', b'')
    
    # Run the FastAPI app
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(app(scope, receive, send))
    
    return {
        'statusCode': response_data.get('status', 200),
        'headers': dict(response_data.get('headers', [])),
        'body': response_data.get('body', b'').decode()
    }
