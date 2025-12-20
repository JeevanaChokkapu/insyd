# Quick Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Build tested successfully (`npm run build`)
- [x] Environment variables configured
- [x] CORS settings updated
- [x] All dependencies installed

## 🚀 Deployment Steps

### 1. Deploy Backend First

**Railway (Recommended):**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Settings → Add environment variable:
   - `NODE_ENV` = `production`
5. Settings → Deploy → Start Command: `node server/index.js`
6. Copy your Railway URL (e.g., `https://your-app.railway.app`)

**Render:**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Build: `npm install`
   - Start: `node server/index.js`
5. Copy your Render URL

### 2. Update Backend CORS

Edit `server/index.js` line 16-21, add your frontend URL:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app"  // Add this after frontend deploys
];
```

Commit and push changes, then redeploy backend.

### 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Add New Project → Import GitHub repo
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (from step 1)
4. Click Deploy
5. Copy your Vercel URL

### 4. Final Backend Update

Update backend CORS with your actual Vercel URL, redeploy backend.

## 📝 Environment Variables

### Backend (Railway/Render)
```
NODE_ENV=production
PORT=3001 (or platform default)
FRONTEND_URL=https://your-frontend.vercel.app (optional)
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## ✅ Testing

1. Visit your Vercel URL
2. Try creating a SKU
3. Check browser console for errors
4. Verify data persists (refresh page)

## 🐛 Troubleshooting

**CORS Errors:**
- Ensure backend CORS includes frontend URL
- Check `NEXT_PUBLIC_API_URL` is set correctly

**API Not Found:**
- Verify backend is running (check backend URL in browser)
- Check environment variables in Vercel

**Build Fails:**
- Check Node.js version (18+)
- Verify all files are committed to GitHub

## 📦 Files Created for Deployment

- `vercel.json` - Vercel configuration
- `railway.json` - Railway configuration  
- `render.yaml` - Render configuration
- `.gitignore` - Git ignore rules
- `DEPLOYMENT.md` - Detailed deployment guide

## 🎉 You're Done!

Your app should now be live. Both frontend and backend will auto-deploy on git push.

