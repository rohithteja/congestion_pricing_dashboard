from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EmissionStats(BaseModel):
    """Emission statistics for a city"""
    co2: float = Field(..., description="CO2 emissions in kg")
    nox: float = Field(..., description="NOx emissions in kg")
    pm25: float = Field(..., description="PM2.5 emissions in kg")
    total: float = Field(..., description="Total emissions in kg")

class RoadFeature(BaseModel):
    """GeoJSON feature representing a road"""
    type: str = Field(default="Feature")
    geometry: Dict[str, Any] = Field(..., description="Road geometry")
    properties: Dict[str, Any] = Field(..., description="Road properties")

class CityEmissionData(BaseModel):
    """Complete city emission data"""
    city: str = Field(..., description="City name")
    emission_grid: List[List[float]] = Field(..., description="Emission grid data")
    coordinates: Dict[str, List[float]] = Field(..., description="Latitude and longitude arrays")
    roads: List[RoadFeature] = Field(..., description="Road network GeoJSON features")
    baseline_stats: EmissionStats = Field(..., description="Baseline emission statistics")
    bounds: Dict[str, float] = Field(..., description="Map bounding box")

class PolicyRequest(BaseModel):
    """Request to apply congestion pricing policy"""
    city: str = Field(..., description="Target city")
    selected_roads: List[int] = Field(..., description="List of selected road feature indices")
    pricing_intensity: float = Field(..., ge=0, le=100, description="Pricing intensity percentage (0-100)")

class PolicyResponse(BaseModel):
    """Response after applying congestion pricing policy"""
    city: str = Field(..., description="City name")
    baseline_stats: EmissionStats = Field(..., description="Baseline emission statistics")
    projected_stats: EmissionStats = Field(..., description="Projected emission statistics after policy")
    reduction_percentage: Dict[str, float] = Field(..., description="Percentage reduction by pollutant")
    affected_roads: List[int] = Field(..., description="List of affected road indices")
    pricing_intensity: float = Field(..., description="Applied pricing intensity")
    estimated_cost_savings: float = Field(..., description="Estimated cost savings in USD")

class EmissionPoint(BaseModel):
    """Single emission data point"""
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")
    co2: float = Field(..., description="CO2 emission value")
    nox: float = Field(..., description="NOx emission value")
    pm25: float = Field(..., description="PM2.5 emission value")
