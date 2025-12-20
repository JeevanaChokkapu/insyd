# Deploy Both Frontend and Backend on Render

## 🎯 Overview

You'll need to create **TWO separate services** on Render:
1. **Backend Service** - Express API server
2. **Frontend Service** - Next.js application

---

## 📦 Step 1: Deploy Backend Service

### Create Backend Service:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `JeevanaChokkapu/insyd`
4. Configure the service:

**Basic Settings:**
- **Name**: `insyd-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`

**Build & Deploy:**
- **Root Directory**: Leave empty (or `/`)
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `3001` (or leave default - Render will set automatically)

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy your backend URL** (e.g., `https://insyd-backend.onrender.com`)

---

## 🎨 Step 2: Deploy Frontend Service

### Create Frontend Service:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect the **SAME** GitHub repository: `JeevanaChokkapu/insyd`
4. Configure the service:

**Basic Settings:**
- **Name**: `insyd-frontend`
- **Environment**: `Node`
- **Region**: Same as backend
- **Branch**: `main`

**Build & Deploy:**
- **Root Directory**: Leave empty (or `/`)
- **Build Command**: `npm install --include=dev && npm run build`
- **Start Command**: `npm start`

**Environment Variables:**
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_API_URL` = `https://insyd-backend.onrender.com` (use your actual backend URL from Step 1)
- `PORT` = `3000` (or leave default)

5. Click **"Create Web Service"**
6. Wait for deployment (10-15 minutes - Next.js builds take longer)

---

## 📋 Summary of Commands

### Backend Service:
```
Build Command: npm install
Start Command: node server/index.js
```

### Frontend Service:
```
Build Command: npm install && npm run build
Start Command: npm start
```

---

## 🔧 Step 3: Update Backend CORS

After frontend is deployed, update backend CORS to allow your frontend URL:

1. Edit `server/index.js` locally
2. Update line 16-21:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://insyd-frontend.onrender.com"  // Add your frontend URL here
];
```

3. Commit and push:
```bash
git add server/index.js
git commit -m "Update CORS for Render frontend"
git push origin main
```

4. Render will auto-redeploy backend

---

## 🌐 Step 4: Access Your Application

- **Frontend**: `https://insyd-frontend.onrender.com`
- **Backend API**: `https://insyd-backend.onrender.com`

---

## ✅ Testing

1. Visit your frontend URL
2. Try creating a SKU
3. Check browser console for errors
4. Test backend directly: `https://insyd-backend.onrender.com/api/health`

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Verify Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`

### CORS Errors:
- Update backend CORS with frontend URL
- Redeploy backend after CORS update
- Check `NEXT_PUBLIC_API_URL` is set correctly

### Frontend Shows Blank Page:
- Check build logs for errors
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check browser console for errors

### Backend Not Starting:
- Check logs in Render dashboard
- Verify `node server/index.js` command works locally
- Check PORT environment variable

---

## 💰 Free Tier Notes

- Render free tier services **sleep after 15 minutes** of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading for always-on service

---

## 🔄 Auto-Deploy

Both services will auto-deploy when you push to GitHub `main` branch!

---

## 📝 Quick Reference

| Service | Build Command | Start Command | Port |
|---------|--------------|---------------|------|
| Backend | `npm install` | `node server/index.js` | 3001 |
| Frontend | `npm install && npm run build` | `npm start` | 3000 |

