# Render Deployment - Quick Setup Guide

## 🚀 Deploy Both Services on Render

### Backend Service Setup:

1. **New Web Service** → Connect GitHub repo
2. **Settings:**
   ```
   Name: insyd-backend
   Build Command: npm install
   Start Command: node server/index.js
   ```
3. **Environment Variables:**
   ```
   NODE_ENV=production
   ```
4. **Deploy** → Copy backend URL

### Frontend Service Setup:

1. **New Web Service** → Connect SAME GitHub repo
2. **Settings:**
   ```
   Name: insyd-frontend
   Build Command: npm install --include=dev && npm run build
   Start Command: npm start
   ```
3. **Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://insyd-backend.onrender.com
   ```
   (Replace with your actual backend URL)

4. **Deploy** → Done! 🎉

---

## 📋 Commands Summary

**Backend:**
- Build: `npm install`
- Start: `node server/index.js`

**Frontend:**
- Build: `npm install && npm run build`
- Start: `npm start`

---

## ⚠️ Important Notes

1. Create **TWO separate services** (not one)
2. Use **SAME GitHub repository** for both
3. Update `NEXT_PUBLIC_API_URL` with your backend URL
4. Update backend CORS after frontend deploys
5. Free tier services sleep after 15 min inactivity

---

## 🔗 After Deployment

- Frontend: `https://insyd-frontend.onrender.com`
- Backend: `https://insyd-backend.onrender.com`

Test backend: `https://insyd-backend.onrender.com/api/health`

