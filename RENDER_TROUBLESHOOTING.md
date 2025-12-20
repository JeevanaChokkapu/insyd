# Render Deployment Troubleshooting - SKU Creation Error

## 🔍 Common Issues and Fixes

### Issue: "Error creating SKU" after deployment

This is usually caused by:
1. **CORS errors** - Backend not allowing frontend requests
2. **Wrong API URL** - Frontend not connecting to backend
3. **Backend not accessible** - Backend service down or wrong URL

---

## ✅ Fix 1: Update CORS Settings

### Update Backend CORS (server/index.js)

The backend has been updated to allow all origins. If you still have issues:

1. **Edit `server/index.js`** locally
2. **Update CORS** to include your frontend URL:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://insyd-frontend.onrender.com"  // Add your Render frontend URL
];

app.use(cors({
  origin: allowedOrigins,  // Or use "*" for all origins
  credentials: true
}));
```

3. **Commit and push:**
```bash
git add server/index.js
git commit -m "Update CORS for Render frontend"
git push origin main
```

4. **Redeploy backend** in Render

---

## ✅ Fix 2: Check Environment Variables

### Frontend Service (Render)

Make sure `NEXT_PUBLIC_API_URL` is set correctly:

1. Go to **insyd-frontend** service in Render
2. Click **"Environment"** tab
3. Check `NEXT_PUBLIC_API_URL`:
   - Should be: `https://insyd-backend.onrender.com` (your backend URL)
   - **NO trailing slash** (`/`)
4. **Save** and **Redeploy**

### Backend Service (Render)

Check these environment variables:
- `NODE_ENV` = `production`
- `PORT` = (auto-set by Render, don't change)

---

## ✅ Fix 3: Test Backend Directly

### Test Backend API:

1. Open your backend URL in browser:
   ```
   https://insyd-backend.onrender.com/api/health
   ```
2. Should see: `{"status":"ok","message":"Server is running"}`
3. If you see an error, backend is not running correctly

### Test SKU Creation API:

Use curl or Postman:
```bash
curl -X POST https://insyd-backend.onrender.com/api/skus \
  -H "Content-Type: application/json" \
  -d '{"name":"Test SKU","sku_code":"TEST-001","unit":"pcs","current_stock":10,"min_stock_level":5,"max_stock_level":100,"unit_price":100,"cost_price":80}'
```

Should return: `{"id":"...","message":"SKU created successfully"}`

---

## ✅ Fix 4: Check Browser Console

1. Open your frontend URL
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Try creating a SKU
5. Look for errors:
   - **CORS error** → Backend CORS issue
   - **Network error** → Backend URL wrong or backend down
   - **404 error** → API endpoint wrong

---

## ✅ Fix 5: Verify API URL Configuration

### Check what URL frontend is using:

1. Open browser console
2. Type: `console.log(window.location.hostname)`
3. Check Network tab when creating SKU
4. See what URL is being called

Should be: `https://insyd-backend.onrender.com/api/skus`

If it's `/api/skus` or `localhost:3001`, environment variable is not set!

---

## 🔧 Quick Fix Checklist

- [ ] Backend is running (test `/api/health`)
- [ ] `NEXT_PUBLIC_API_URL` is set in frontend environment variables
- [ ] Backend CORS allows frontend URL (or allows all origins)
- [ ] Both services are deployed and running
- [ ] No trailing slash in `NEXT_PUBLIC_API_URL`
- [ ] Browser console shows correct API URL being called

---

## 🐛 Still Not Working?

### Check Render Logs:

1. **Backend Logs:**
   - Go to backend service → **"Logs"** tab
   - Look for errors when creating SKU
   - Check for CORS errors

2. **Frontend Logs:**
   - Go to frontend service → **"Logs"** tab
   - Look for build errors or runtime errors

### Common Error Messages:

**"Network Error" or "Failed to fetch"**
- Backend URL is wrong or backend is down
- Check `NEXT_PUBLIC_API_URL` environment variable

**"CORS policy" error**
- Backend CORS not allowing frontend
- Update CORS in `server/index.js`

**"404 Not Found"**
- API endpoint wrong
- Check backend is running and URL is correct

**"500 Internal Server Error"**
- Backend error
- Check backend logs in Render

---

## 📝 Updated Code

The code has been updated with:
- Better error handling (shows actual error messages)
- CORS allowing all origins (for easier deployment)
- Improved API URL configuration

**Commit and push these changes:**
```bash
git add server/index.js app/config.ts app/inventory/new/page.tsx
git commit -m "Fix CORS and improve error handling for Render deployment"
git push origin main
```

Then redeploy both services in Render.

