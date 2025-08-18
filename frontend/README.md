# City Emissions Simulator - Frontend

Next.js frontend for the City Emissions Simulator dashboard with interactive map and policy controls.

## Features

- 🗺️ Interactive map with Leaflet and OpenStreetMap
- 🎯 Road selection for congestion pricing policies
- 📊 Real-time emissions visualization and statistics
- 📈 Before/after comparison charts with Chart.js
- 🌙 Dark mode toggle
- 📱 Responsive design with Tailwind CSS
- ✨ Smooth animations with Framer Motion

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── Header.tsx           # Header with theme toggle
│   ├── CitySelector.tsx     # City dropdown selector
│   ├── EmissionMap.tsx      # Interactive map with Leaflet
│   ├── PolicyControls.tsx   # Pricing intensity slider and controls
│   ├── EmissionCards.tsx    # Emission statistics cards
│   ├── EmissionChart.tsx    # Before/after comparison chart
│   ├── LoadingSpinner.tsx   # Loading component
│   └── theme-provider.tsx   # Theme provider wrapper
├── lib/
│   ├── api.ts              # API service for backend communication
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## Key Features

### Interactive Map
- Uses Leaflet.js for map rendering
- OpenStreetMap tiles for road visualization
- Emission heatmap overlay
- Click-to-select road functionality
- Real-time road highlighting

### Policy Simulation
- Drag slider to adjust congestion pricing intensity (0-100%)
- Visual feedback for policy impact
- Immediate calculation of emission reductions
- Cost-benefit analysis display

### Data Visualization
- Animated emission statistics cards
- Before/after comparison charts
- Percentage reduction indicators
- Cost savings projections

### User Experience
- Professional dark/light theme
- Smooth animations and transitions
- Responsive design for all screen sizes
- Loading states and error handling
- Intuitive controls and feedback

## API Integration

The frontend connects to the FastAPI backend with these endpoints:

- `GET /cities` - Fetch available cities
- `GET /city/{city}` - Get city emission data and road network
- `POST /apply_policy` - Apply congestion pricing policy

## Styling

Built with Tailwind CSS featuring:
- Custom color palette for emissions dashboard
- Dark mode support
- Responsive grid layouts
- Animation utilities
- Glass morphism effects

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **next-themes** - Dark mode support

## Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Update environment variables in your deployment platform

## Map Integration

The application uses OpenStreetMap for base map tiles and supports:
- Emission data overlay visualization
- Road network display from GeoJSON
- Interactive road selection
- Custom styling for selected roads
- Popup information for roads

## Performance

- Optimized bundle size with Next.js
- Lazy loading of map components
- Efficient re-rendering with React hooks
- Responsive image loading
- Client-side caching of API responses
