#!/bin/bash

# Test Backend Connectivity Script

echo "🔍 Testing Backend API Endpoints..."
echo ""

# Test health endpoint
echo "1️⃣  Testing Health Endpoint:"
curl -s "https://congestion-pricing-dashboard-837682813014.europe-west1.run.app/health" | python3 -m json.tool
echo ""

# Test cities endpoint
echo "2️⃣  Testing Cities Endpoint:"
curl -s "https://congestion-pricing-dashboard-837682813014.europe-west1.run.app/cities/population" | head -c 200
echo "..."
echo ""

# Test CORS headers
echo "3️⃣  Testing CORS Headers:"
curl -I -H "Origin: https://congestion-pricing-dashboard.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     "https://congestion-pricing-dashboard-837682813014.europe-west1.run.app/cities/population"
echo ""

echo "✅ Backend testing complete!"
echo ""
echo "🚀 Next steps:"
echo "1. If CORS headers are missing, redeploy your backend with the updated main.py"
echo "2. If backend is working, check your Vercel environment variables"
echo "3. Redeploy your Vercel frontend after updating env vars"
