# 🚦 Congestion Pricing Dashboard

> **Interactive web application for simulating emissions reduction through congestion pricing policies**

A full-stack application that allows users to select cities, apply congestion pricing policies to specific roads, and visualize real-time emissions reduction. Built with FastAPI backend and Next.js frontend.

## ✨ Features

### 🎯 **Policy Simulation**
- Select from 100 Indian cities with emission data
- Interactive road selection for congestion pricing
- Real-time emissions calculation and visualization
- Dynamic pricing intensity control (0-100%)

### 🗺️ **Interactive Mapping**
- OpenStreetMap integration with Leaflet.js
- Emission heatmap overlay visualization
- Click-to-select road functionality
- Visual highlighting of selected roads

### 📊 **Analytics Dashboard**
- Before/after emissions comparison charts
- CO₂, NOx, PM2.5 breakdown with statistics
- Cost-benefit analysis with savings projections
- Percentage reduction indicators

### 🎨 **Modern UI/UX**
- Dark/light theme toggle
- Responsive design for all devices
- Professional dashboard aesthetics
- Smooth animations

## 🏗️ Architecture

```
congestion_pricing_dashboard/
├── backend/                    # FastAPI Backend
│   ├── main.py                # Application entry point
│   ├── models.py              # Pydantic data models
│   └── services/              # Business logic
│       └── simple_data_service.py
├── frontend/                   # Next.js Frontend
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # API client & utilities
│   └── types/                 # TypeScript definitions
└── data/                      # City Data (JSON format)
    └── {city}/
        └── data.json          # Emission and map data
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

**Backend available at:**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp ../env.example .env.local

# Start development server
npm run dev
```

**Frontend available at:** http://localhost:3000

### 3. Using Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build
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
- **pandas** - Data processing
- **uvicorn** - ASGI server

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive maps
- **Chart.js** - Data visualization

## 📡 API Endpoints

### `GET /cities`
Returns list of available cities.

### `GET /city/{city}`
Returns complete city data including:
- Emission grid data
- Road network GeoJSON
- Baseline emission statistics

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

### Environment Variables
Copy `env.example` to `.env.local` (frontend) or `.env` (backend):

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
PORT=8000
```

## � Data Format

The application uses simplified JSON data format:
```json
{
  "emission_data": {
    "lat": [...],
    "lon": [...], 
    "co2": [...],
    "nox": [...],
    "pm25": [...]
  },
  "roads": {
    "type": "FeatureCollection",
    "features": [...]
  },
  "bounds": [[lat_min, lon_min], [lat_max, lon_max]]
}
```

## 🚀 Production Deployment

### Option 1: Traditional Server
```bash
# Backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend
npm run build
npm run start
```

### Option 2: Docker
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms
- Frontend: Vercel, Netlify, or any static hosting
- Backend: Railway, Render, AWS, GCP, or any container hosting
- Set `NEXT_PUBLIC_API_URL` to your backend URL

## � Supported Cities

The application supports 100 Indian cities including:

**Major Cities**: Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, and 80+ more cities.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**🚦 "Pick a city, apply a policy, see emissions change live."**