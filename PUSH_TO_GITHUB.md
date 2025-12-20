# Push Code to GitHub - Step by Step Guide

## Option 1: If you already have a GitHub repository

### Step 1: Add and commit all changes
```bash
git add -A
git commit -m "Add UI improvements, toast notifications, and deployment config"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

If you get an error about upstream, use:
```bash
git push -u origin main
```

---

## Option 2: Create a new GitHub repository

### Step 1: Create repository on GitHub
1. Go to https://github.com/new
2. Repository name: `insyd-inventory` (or any name you like)
3. Description: "Inventory Management System"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Add remote and push
```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push your code
git push -u origin main
```

---

## Quick Commands (Copy & Paste)

```bash
# 1. Stage all changes
git add -A

# 2. Commit with message
git commit -m "Add UI improvements, toast notifications, and deployment config"

# 3. Check remote (if exists)
git remote -v

# 4a. If remote exists, push:
git push origin main

# 4b. If no remote, add it first (replace with your GitHub URL):
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

## What will be pushed:
✅ All your code changes
✅ Toast notification component
✅ Updated UI with modals
✅ Deployment configuration files
✅ Environment variable setup

## What will NOT be pushed (thanks to .gitignore):
❌ node_modules/
❌ .next/ (build files)
❌ .env files (secrets)
❌ server/inventory.db (database)

---

## After pushing to GitHub:

1. **Deploy Backend:**
   - Go to Railway.app or Render.com
   - Connect your GitHub repository
   - Deploy

2. **Deploy Frontend:**
   - Go to Vercel.com
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_API_URL`
   - Deploy

Your code will auto-deploy on every push! 🚀

