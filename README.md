# 🚦 City Emissions Simulator

> **Interactive dashboard for simulating emissions reduction through congestion pricing policies**

An advanced fullstack application that allows users to select cities, apply congestion pricing policies to specific roads, and visualize real-time emissions reduction. Built with FastAPI backend and Next.js frontend.

![Dashboard Preview](https://via.placeholder.com/800x400/22c55e/ffffff?text=City+Emissions+Simulator)

## ✨ Features

### 🎯 **"What if...?" Policy Simulation**
- Select from 100 Indian cities with 500m emission data
- Interactive road selection for congestion pricing
- Real-time emissions calculation and visualization
- Dynamic pricing intensity control (0-100%)

### 🗺️ **Interactive Mapping**
- OpenStreetMap integration with Leaflet.js
- Emission heatmap overlay visualization
- Click-to-select road functionality
- Visual highlighting of selected roads

### 📊 **Advanced Analytics**
- Before/after emissions comparison charts
- CO₂, NOx, PM2.5 breakdown with statistics
- Cost-benefit analysis with savings projections
- Percentage reduction indicators

### 🎨 **Professional UI/UX**
- Modern dark/light theme toggle
- Smooth animations with Framer Motion
- Responsive design for all devices
- Professional emissions dashboard aesthetics

## 🏗️ Architecture

```
congestion_pricing_dashboard/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Application entry point
│   ├── models.py           # Pydantic data models
│   ├── services/           # Business logic
│   │   └── data_service.py # NetCDF & GeoJSON processing
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js Frontend
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/              # API client & utilities
│   ├── types/            # TypeScript definitions
│   └── package.json      # Node.js dependencies
└── data/                  # City Data
    └── {city}/
        ├── emission.nc    # NetCDF emission data (500m resolution)
        └── map.geojson    # Road network GeoJSON
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will be available at:**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

**Frontend will be available at:** http://localhost:3000

### 3. Data Structure

Ensure your data follows this structure:
```
data/
├── mumbai/
│   ├── emission.nc    # NetCDF with emission data
│   └── map.geojson    # Road network GeoJSON
├── delhi/
│   ├── emission.nc
│   └── map.geojson
└── ... (other cities)
```

## 🎮 How to Use

1. **Select a City**: Choose from the dropdown of 100 available cities
2. **Explore the Map**: View emission heatmap and road network
3. **Select Roads**: Click on roads to select them for congestion pricing
4. **Adjust Pricing**: Use the slider to set pricing intensity (0-100%)
5. **Apply Policy**: Click "Apply Congestion Pricing" to see results
6. **Analyze Impact**: View before/after charts and emission reductions

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **xarray** - NetCDF data processing
- **geopandas** - GeoJSON handling
- **numpy/pandas** - Data analysis
- **uvicorn** - ASGI server

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive maps
- **Chart.js** - Data visualization
- **Framer Motion** - Smooth animations

## 📡 API Endpoints

### `GET /cities`
Returns list of available cities.

### `GET /city/{city}`
Returns complete city data including:
- Emission grid data (500m resolution)
- Road network GeoJSON
- Baseline emission statistics
- Map bounds

### `POST /apply_policy`
Applies congestion pricing policy:
```json
{
  "city": "mumbai",
  "selected_roads": [0, 1, 5, 10],
  "pricing_intensity": 75.0
}
```

Returns projected emissions and cost-benefit analysis.

### `GET /city/{city}/stats`
Returns emission statistics for a specific city.

## 🔧 Configuration

### Backend Configuration
```python
# backend/.env (optional)
DATA_DIR=../data
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend Configuration
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📈 Data Processing

The application processes:

### NetCDF Emission Data
- 500m spatial resolution
- CO₂, NOx, PM2.5 measurements
- Temporal data support
- Automatic variable detection

### GeoJSON Road Networks
- OpenStreetMap compatible
- Road properties and metadata
- Geometric road representations
- Interactive selection support

## 🎨 UI Components

### Interactive Map
- Emission heatmap visualization
- Road network overlay
- Click-to-select functionality
- Real-time highlighting

### Policy Controls
- Pricing intensity slider (0-100%)
- Selected roads counter
- Apply policy button
- Real-time feedback

### Analytics Dashboard
- Animated emission cards
- Before/after comparison charts
- Cost savings projections
- Percentage reduction indicators

## 🌙 Theming

Supports both light and dark modes with:
- Custom color palette
- Smooth theme transitions
- Persistent theme selection
- Professional dashboard aesthetics

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm run start

# Or deploy to Vercel/Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📊 City Data

The application supports 100 Indian cities:

**Metro Cities**: Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Aurangabad, Dhanbad, Amritsar, Allahabad, Ranchi, Howrah, Coimbatore, Jabalpur, Gwalior, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Gurgaon, Chandigarh, Solapur, Hubli-Dharwad, Bareilly, Moradabad, Mysore, Guwahati, Aligarh, Tiruchirappalli, Tiruppur, Salem, Thiruvananthapuram, Kochi, Dehradun, Jammu, Mangalore, Erode, Belgaum, Ambattur, Amravati, Udaipur, Jamshedpur, Ulhasnagar, Nellore, Ajmer, Sangli, Jalgaon, Akola, Latur, Dhule, Ichalkaranji

**Additional Cities**: Patiala, Panaji, Kohima, Gangtok, Shimla, Aizawl, Shillong, Itanagar, Imphal, and more...

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- CHETNA-Road dataset for emission data
- OpenStreetMap contributors for road network data
- Leaflet.js community for mapping capabilities
- Chart.js team for visualization components

---

**🚦 "Pick a city, apply a policy, see emissions change live."**