# Deployment Guide

This guide covers deploying the Insyd Inventory Management System to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway or Render account (for backend)

## Frontend Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Click "Deploy"

3. **Update API Configuration**
   - After deployment, update `next.config.js` to point to your backend URL
   - Or use environment variables for API URL

## Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Project**
   - Root Directory: Leave empty (or set to `/server` if needed)
   - Start Command: `node server/index.js`
   - Build Command: Not needed for Node.js

4. **Set Environment Variables**
   - PORT: 3001 (or leave default)
   - Add any other required variables

5. **Deploy**
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - Name: `insyd-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Root Directory: Leave empty

4. **Set Environment Variables**
   - PORT: 3001

5. **Deploy**
   - Click "Create Web Service"
   - Render will deploy automatically

## Update Frontend API URL

After backend is deployed, update the frontend to use the production API:

1. **Option 1: Update next.config.js**
   ```javascript
   async rewrites() {
     return [
       {
         source: '/api/:path*',
         destination: 'https://your-backend-url.com/api/:path*',
       },
     ];
   }
   ```

2. **Option 2: Use Environment Variables**
   - In Vercel, go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - Update API calls to use `process.env.NEXT_PUBLIC_API_URL`

## Database Considerations

- SQLite database file is stored locally in `server/inventory.db`
- For production, consider migrating to PostgreSQL or MongoDB
- Railway and Render both offer managed database services

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend can connect to backend
- [ ] CORS is properly configured
- [ ] Database is initialized
- [ ] Environment variables are set
- [ ] SSL/HTTPS is enabled (automatic on Vercel/Railway/Render)

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured to allow your frontend domain
- Check that API URLs are correct

### Database Issues
- Ensure database file has write permissions
- Consider using a managed database service for production

### Build Errors
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Review build logs for specific errors

## Alternative: Single Server Deployment

You can also deploy both frontend and backend together:

1. Build Next.js app: `npm run build`
2. Serve static files with Express
3. Deploy single Node.js app

This approach requires modifying the server to serve static files from `.next` directory.

