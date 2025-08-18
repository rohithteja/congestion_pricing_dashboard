# Vercel Deployment Instructions

## Prerequisites
1. GitHub repository with the code
2. Vercel account connected to GitHub

## Deployment Steps

### 1. Push to GitHub
Make sure all changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Vercel Setup
1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave empty for root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/.next`

### 3. Environment Variables
Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Set to your Vercel app URL + `/api` (e.g., `https://your-app-name.vercel.app/api`)
- `PYTHONPATH`: Set to `backend`

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## File Structure for Vercel
```
/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── data/             # City data files
├── vercel.json       # Vercel configuration
├── package.json      # Root package.json
└── build.sh          # Build script
```

## Notes
- The backend will be deployed as Vercel Functions
- The frontend will be deployed as a static Next.js site
- Data files in `/data` directory will be accessible to the backend
- CORS is configured for Vercel domains

## Troubleshooting
- If build fails, check the build logs in Vercel dashboard
- Ensure all dependencies are listed in requirements.txt and package.json
- Check that environment variables are set correctly
