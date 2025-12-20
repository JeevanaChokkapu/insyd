# Quick Fix: SKU Creation Error on Render

## 🔍 The Problem

When creating a SKU, you're getting an error. This is **99% likely** because the `NEXT_PUBLIC_API_URL` environment variable is **NOT SET** in your Render frontend service.

---

## ✅ Fix Steps (Do This Now!)

### Step 1: Get Your Backend URL

Your backend URL is: `https://insyd-backend.onrender.com`

(No trailing slash!)

---

### Step 2: Set Environment Variable in Render

1. Go to **Render Dashboard** → Your **Frontend Service** (`insyd-frontend`)
2. Click **"Environment"** tab (left sidebar)
3. Click **"Add Environment Variable"**
4. Set:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://insyd-backend.onrender.com`
   - **NO trailing slash** (`/`)
5. Click **"Save Changes"**
6. **Redeploy** the frontend service (or it will auto-redeploy)

---

### Step 3: Verify It's Set

After redeploy, check:

1. Open your **frontend URL** in browser
2. Press **F12** → **Console** tab
3. You should see: `API_BASE_URL: https://insyd-backend.onrender.com`
4. If you see `/api` or `localhost:3001`, the env var is NOT set correctly!

---

### Step 4: Test Creating SKU

1. Try creating a SKU
2. Check **Console** tab - you should see:
   - `Creating SKU at: https://insyd-backend.onrender.com/api/skus`
3. Check **Network** tab - the request should go to the backend URL

---

## 🐛 Still Not Working?

### Check Browser Console

Open browser console (F12) and look for:

**Error: "Failed to fetch" or "Network Error"**
- Backend is down or URL is wrong
- Test backend: `https://insyd-backend.onrender.com/api/health`

**Error: "CORS policy"**
- Backend CORS issue (should be fixed, but check backend logs)

**Error: "404 Not Found"**
- API endpoint wrong
- Check Network tab - what URL is being called?

**Error: "500 Internal Server Error"**
- Backend error
- Check backend logs in Render

---

### Check Render Logs

1. **Frontend Logs:**
   - Go to frontend service → **"Logs"** tab
   - Look for errors during build or runtime
   - Check if `NEXT_PUBLIC_API_URL` is being used

2. **Backend Logs:**
   - Go to backend service → **"Logs"** tab
   - Try creating SKU
   - Look for errors or CORS issues

---

## 📝 Common Mistakes

❌ **Wrong**: `NEXT_PUBLIC_API_URL = https://insyd-backend.onrender.com/` (trailing slash)
✅ **Correct**: `NEXT_PUBLIC_API_URL = https://insyd-backend.onrender.com`

❌ **Wrong**: `NEXT_PUBLIC_API_URL = https://insyd-backend.onrender.com/api` (includes /api)
✅ **Correct**: `NEXT_PUBLIC_API_URL = https://insyd-backend.onrender.com`

❌ **Wrong**: Variable name is `API_URL` instead of `NEXT_PUBLIC_API_URL`
✅ **Correct**: Must be `NEXT_PUBLIC_API_URL` (Next.js requires `NEXT_PUBLIC_` prefix)

---

## 🔧 Test Backend Directly

Test if backend works:

```bash
curl -X POST https://insyd-backend.onrender.com/api/skus \
  -H "Content-Type: application/json" \
  -d '{"name":"Test SKU","sku_code":"TEST-001","unit":"pcs","current_stock":10,"min_stock_level":5,"max_stock_level":100,"unit_price":100,"cost_price":80}'
```

Should return: `{"id":"...","message":"SKU created successfully"}`

If this fails, backend has an issue!

---

## ✅ After Fix

Once `NEXT_PUBLIC_API_URL` is set correctly:

1. Frontend will use: `https://insyd-backend.onrender.com/api/skus`
2. Backend CORS allows all origins (already fixed)
3. SKU creation should work!

---

## 🚀 Quick Checklist

- [ ] `NEXT_PUBLIC_API_URL` is set in Render frontend environment variables
- [ ] Value is `https://insyd-backend.onrender.com` (no trailing slash, no /api)
- [ ] Frontend service has been redeployed after setting env var
- [ ] Browser console shows correct API_BASE_URL
- [ ] Backend is accessible at `https://insyd-backend.onrender.com/api/health`
- [ ] Network tab shows request going to correct URL

---

**Most likely issue**: Environment variable not set! Set it and redeploy! 🎯

