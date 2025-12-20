# How to Find Your Deployment URL

## 🚂 Railway Deployment URL

### After Successful Deployment:

1. **Go to your Railway dashboard**: https://railway.app
2. **Click on your project** (insyd-backend or your project name)
3. **Click on your service** (the backend service)
4. **Look for "Settings" tab** → Click it
5. **Scroll down to "Domains" section**
6. **You'll see your URL** like: `https://your-app-name.up.railway.app`
   - OR click **"Generate Domain"** if no domain is shown
7. **Copy this URL** - this is your backend API URL!

### Alternative Method:
- Click on your service
- Look at the top right corner - there's usually a **"Open"** or **"Visit"** button
- Click it to see your deployed URL
- The URL bar will show: `https://your-app.up.railway.app`

### To Test:
Visit: `https://your-app.up.railway.app/api/health`
You should see: `{"status":"ok","message":"Server is running"}`

---

## 🌐 Render Deployment URL

### After Successful Deployment:

1. **Go to your Render dashboard**: https://render.com
2. **Click on your service** (insyd-backend or your service name)
3. **Look at the top of the page** - you'll see:
   - **Service URL**: `https://your-service-name.onrender.com`
4. **Copy this URL** - this is your backend API URL!

### Alternative Method:
- In your service dashboard
- Look for **"Settings"** tab
- Scroll to **"Service Details"**
- Find **"Service URL"** or **"Public URL"**

### To Test:
Visit: `https://your-service-name.onrender.com/api/health`
You should see: `{"status":"ok","message":"Server is running"}`

---

## 📝 What to Do With This URL

### For Frontend Deployment (Vercel):

1. **Copy your backend URL** (from Railway or Render)
2. **Go to Vercel** → Your project → Settings → Environment Variables
3. **Add new variable:**
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.railway.app` (or `.onrender.com`)
4. **Save** and **Redeploy**

### Example:
```
NEXT_PUBLIC_API_URL=https://insyd-backend.up.railway.app
```

OR

```
NEXT_PUBLIC_API_URL=https://insyd-backend.onrender.com
```

---

## 🔍 Quick Checklist

- [ ] Backend deployed successfully (Railway or Render)
- [ ] Found deployment URL
- [ ] Tested URL: `https://your-url/api/health` works
- [ ] Copied URL for frontend deployment
- [ ] Added `NEXT_PUBLIC_API_URL` in Vercel with backend URL
- [ ] Frontend deployed and working

---

## 🐛 Troubleshooting

### URL Not Working?
- Check if deployment is still building (wait a few minutes)
- Check deployment logs for errors
- Verify the service is running (green status)

### CORS Errors?
- Update `server/index.js` CORS settings with your frontend URL
- Redeploy backend after updating CORS

### Can't Find URL?
- Check your email for deployment notifications
- Look in the service logs for the URL
- Check the "Events" tab in Railway/Render dashboard

