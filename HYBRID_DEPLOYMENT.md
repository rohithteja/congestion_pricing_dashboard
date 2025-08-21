# Hybrid Deployment Guide: Vercel + Render

This is the **cheapest reliable setup** for your congestion pricing dashboard:
- **Frontend (Next.js)**: Vercel (100% free, fast, GitHub integration)
- **Backend (FastAPI)**: Render.com (free tier, reliable)

## 🎯 Step 1: Deploy Backend to Render.com

### Option A: Using Blueprint (Recommended)
1. Go to: https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect repository: `rohithteja/congestion_pricing_dashboard`
4. Select file: `render-backend.yaml`
5. Deploy → Wait for completion
6. **Copy the backend URL** (e.g., `https://congestion-pricing-backend.onrender.com`)

### Option B: Manual Setup
1. Go to: https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect repository: `rohithteja/congestion_pricing_dashboard`
4. Configure:
   - **Name**: `congestion-pricing-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. **Environment Variables**:
   ```
   ENVIRONMENT=production
   DATA_DIR=./data
   ```
6. Deploy

## 🚀 Step 2: Deploy Frontend to Vercel

1. Go to: https://vercel.com
2. **Import Git Repository**
3. Select: `rohithteja/congestion_pricing_dashboard`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Environment Variables** (Important!):
   ```
   NEXT_PUBLIC_API_URL=https://congestion-pricing-backend.onrender.com
   NODE_ENV=production
   ```
   *(Replace with your actual Render backend URL from Step 1)*

6. **Deploy**

## ✅ Step 3: Test Your Deployment

### Backend Test:
Visit: `https://your-backend.onrender.com/health`
Should return: `{"status": "healthy"}`

### Frontend Test:
Visit: `https://your-frontend.vercel.app`
Should load the dashboard with city data

### API Integration Test:
1. Open browser dev tools
2. Navigate to cities page
3. Check Network tab - should see successful API calls to Render backend

## 🔧 Configuration Files

- **Frontend**: `vercel.json` (auto-detects Next.js)
- **Backend**: `render-backend.yaml` (single service)
- **Environment**: `.env.vercel` and `.env.render` (examples)

## 💰 Cost Breakdown

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| Vercel | Hobby | $0/month | 100GB bandwidth, custom domains, auto-deploy |
| Render | Free | $0/month | 512MB RAM, auto-sleep, 750 hours/month |
| **Total** | | **$0/month** | Full-stack web application |

## 🌟 Benefits of This Setup

✅ **100% Free** - No credit card required  
✅ **Fast Frontend** - Vercel's edge network  
✅ **Reliable Backend** - Render's infrastructure  
✅ **Auto-deploy** - Git push triggers deployment  
✅ **Custom Domains** - Professional URLs  
✅ **HTTPS** - SSL certificates included  
✅ **Monitoring** - Logs and analytics  

## 🔄 Local Development

```bash
# Terminal 1: Start backend
cd backend && python main.py

# Terminal 2: Start frontend  
cd frontend && npm run dev
```

Local URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## 📱 Expected Production URLs

- **Frontend**: `https://congestion-pricing-dashboard.vercel.app`
- **Backend**: `https://congestion-pricing-backend.onrender.com`
- **API Docs**: `https://congestion-pricing-backend.onrender.com/docs`

This setup gives you a professional, scalable web application at zero cost! 🚀
