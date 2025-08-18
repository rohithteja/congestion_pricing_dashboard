# City Emissions Simulator - Backend

FastAPI backend for the City Emissions Simulator dashboard.

## Features

- Load emission data from NetCDF files (500m resolution)
- Process road network data from GeoJSON files
- Apply congestion pricing policies to selected roads
- Calculate emission reductions and cost-benefit analysis
- RESTful API with automatic documentation

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Ensure data structure:
```
data/
├── mumbai/
│   ├── emission.nc
│   └── map.geojson
├── delhi/
│   ├── emission.nc
│   └── map.geojson
└── ... (other cities)
```

### Running the Server

Start the development server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### GET /cities
Returns list of available cities.

### GET /city/{city}
Returns baseline emission data and road network for a specific city.

### POST /apply_policy
Applies congestion pricing policy to selected roads and returns projected emissions.

**Request Body:**
```json
{
  "city": "mumbai",
  "selected_roads": [0, 1, 5, 10],
  "pricing_intensity": 75.0
}
```

### GET /city/{city}/stats
Returns emission statistics for a specific city.

## Data Processing

The backend uses:
- **xarray** for processing NetCDF emission data
- **geopandas** for handling GeoJSON road networks
- **numpy** for numerical calculations
- **shapely** for geometric operations

## City Data Format

### Emission Data (emission.nc)
NetCDF file containing:
- Latitude/longitude coordinates
- Emission values (CO2, NOx, PM2.5)
- 500m spatial resolution

### Road Network (map.geojson)
GeoJSON file containing:
- Road geometries (LineString features)
- Road properties (name, type, etc.)
- Compatible with OpenStreetMap data

## Policy Simulation

The congestion pricing simulation:
1. Calculates affected area based on selected roads
2. Applies reduction factors based on pricing intensity
3. Estimates emission reductions for CO2, NOx, and PM2.5
4. Calculates cost-benefit analysis
5. Returns before/after statistics

## Environment Variables

Create a `.env` file (optional):
```
DATA_DIR=../data
API_HOST=0.0.0.0
API_PORT=8000
```
