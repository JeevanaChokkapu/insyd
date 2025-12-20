# Deployment Guide

This guide will help you deploy the Insyd Inventory Management System to production.

## Architecture

The application consists of two parts:
1. **Frontend**: Next.js application (deploy to Vercel)
2. **Backend**: Express.js API server (deploy to Railway/Render/Fly.io)

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- Node.js 18+ installed locally

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Set the following:
   - **Start Command**: `node server/index.js`
   - **Root Directory**: `/` (root)
6. Add environment variable:
   - `PORT` = `3001` (or leave default)
   - `NODE_ENV` = `production`
7. Click "Deploy"
8. Once deployed, copy your Railway URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `insyd-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Root Directory**: `/`
5. Add environment variables:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
6. Click "Create Web Service"
7. Copy your Render URL (e.g., `https://insyd-backend.onrender.com`)

### Update Backend CORS

After deploying backend, update `server/index.js` CORS settings:

```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app"  // Add your Vercel URL
  ]
}));
```

Or for production, allow all origins (less secure but simpler):

```javascript
app.use(cors({
  origin: "*"  // Allow all origins in production
}));
```

## Step 2: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Add environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.railway.app`)
6. Click "Deploy"
7. Wait for deployment to complete
8. Your app will be live at `https://your-app.vercel.app`

## Step 3: Update Backend CORS (Again)

After frontend is deployed, update backend CORS to include your Vercel URL:

```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"  // Your actual Vercel URL
  ]
}));
```

Redeploy backend after this change.

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app`)

### Backend (Railway/Render)
- `PORT` = `3001` (or platform default)
- `NODE_ENV` = `production`

## Testing Deployment

1. Visit your Vercel frontend URL
2. Try creating a SKU
3. Check browser console for any CORS errors
4. Verify data is being saved to backend database

## Troubleshooting

### CORS Errors
- Ensure backend CORS includes your frontend URL
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is accessible (try opening backend URL in browser)

### API Not Found
- Check `NEXT_PUBLIC_API_URL` environment variable in Vercel
- Verify backend is running and accessible
- Check backend logs for errors

### Database Issues
- SQLite database is created automatically on first run
- Ensure backend has write permissions
- Database persists between deployments on Railway/Render

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## Quick Deploy Commands

### Local Testing
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Production Build Test
```bash
# Build frontend
npm run build

# Start production frontend
npm start
```

## Database Backup

To backup your database:
1. Download `server/inventory.db` from your backend hosting
2. Keep backups before major updates

## Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:
- Push to `main` branch = automatic deployment
- Pull requests = preview deployments (Vercel)

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Railway dashboards
2. Verify environment variables are set correctly
3. Test backend API directly (e.g., `https://your-backend.railway.app/api/health`)
4. Check browser console for frontend errors

