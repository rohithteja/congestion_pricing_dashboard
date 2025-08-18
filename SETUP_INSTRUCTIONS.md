# 🚦 City Emissions Simulator - Complete Setup Instructions

## 📋 What You're Getting

A complete fullstack application with:

### 🔧 **Backend (FastAPI)**
- **City Data Management**: Handles 100 Indian cities with NetCDF emission data
- **Policy Simulation**: Applies congestion pricing to selected roads
- **Real-time Calculations**: Computes emission reductions and cost-benefit analysis
- **RESTful API**: Clean endpoints for frontend integration

### 🎨 **Frontend (Next.js)**
- **Interactive Map**: Leaflet.js with OpenStreetMap integration
- **Road Selection**: Click-to-select roads for congestion pricing
- **Live Updates**: Real-time emission calculations and visualizations
- **Professional UI**: Dark/light themes with smooth animations

## 🚀 Quick Start (Recommended)

### Option 1: Use the Startup Script
```bash
# Clone and navigate to project
cd congestion_pricing_dashboard

# Run the startup script (handles everything automatically)
./start.sh
```

This script will:
- ✅ Check port availability
- ✅ Set up Python virtual environment
- ✅ Install all dependencies
- ✅ Start both backend and frontend
- ✅ Open your browser automatically

### Option 2: Manual Setup

#### Step 1: Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

## 🌐 Access the Application

Once running, access:
- **🎯 Dashboard**: http://localhost:3000
- **🔗 API**: http://localhost:8000
- **📚 API Docs**: http://localhost:8000/docs

## 📊 Using the Dashboard

### 1. **Select a City**
Choose from 100 Indian cities in the dropdown menu.

### 2. **Explore the Map**
- View emission heatmap overlay
- See road network from OpenStreetMap
- Hover over roads for information

### 3. **Select Roads for Congestion Pricing**
- Click on roads to select them (they turn red)
- Selected roads counter updates in real-time
- Use Ctrl+Click for multiple selections

### 4. **Adjust Policy Parameters**
- Use the slider to set pricing intensity (0-100%)
- See immediate feedback on policy strength
- View estimated impact indicators

### 5. **Apply the Policy**
- Click "Apply Congestion Pricing" button
- Wait for real-time calculations
- View before/after comparison

### 6. **Analyze Results**
- **Emission Cards**: See CO₂, NOx, PM2.5 reductions
- **Charts**: Before/after comparison visualization
- **Cost Savings**: Estimated economic benefits
- **Percentage Reductions**: Clear impact metrics

## 📁 Data Structure

Place your city data in this structure:
```
data/
├── mumbai/
│   ├── emission.nc     # NetCDF file with 500m emission data
│   └── map.geojson     # Road network GeoJSON
├── delhi/
│   ├── emission.nc
│   └── map.geojson
└── ... (other cities)
```

### 🗂️ Supported Cities
The application supports 100 cities including:

**Major Metro Cities**: Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Aurangabad, Dhanbad, Amritsar, Allahabad, Ranchi, Coimbatore, Jabalpur, Gwalior, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Gurgaon, Chandigarh

**Additional Cities**: All tier-2 and tier-3 cities from the provided list

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### Missing Dependencies
```bash
# Backend issues
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend issues
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Data Loading Issues
- Ensure NetCDF files are valid and readable
- Check GeoJSON files are properly formatted
- Verify data directory structure matches expected format

## 🐳 Docker Deployment (Optional)

For production deployment:
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 📝 Development Notes

### Backend Features
- **Data Processing**: xarray for NetCDF, geopandas for GeoJSON
- **Policy Simulation**: Configurable reduction algorithms
- **Error Handling**: Graceful fallbacks for missing data
- **Documentation**: Auto-generated with FastAPI

### Frontend Features
- **Modern Stack**: Next.js 14 with App Router
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices
- **Performance**: Optimized bundles and lazy loading

## 🎯 Next Steps

1. **Add Your Data**: Place emission.nc and map.geojson files in data/{city}/ directories
2. **Customize Policies**: Modify reduction algorithms in data_service.py
3. **Extend Cities**: Add more cities to the CITIES list in main.py
4. **Deploy**: Use Docker or cloud platforms for production

## 🆘 Support

If you encounter issues:
1. Check the console logs in browser developer tools
2. Review backend logs in terminal
3. Ensure all dependencies are installed
4. Verify data file formats and structure

## 📈 Performance Tips

- Use smaller datasets for testing
- Enable browser caching for better performance
- Consider Redis for caching API responses in production
- Optimize NetCDF files for faster loading

---

**🚦 "Pick a city, apply a policy, see emissions change live."**

Ready to simulate congestion pricing policies and reduce urban emissions! 🌱
