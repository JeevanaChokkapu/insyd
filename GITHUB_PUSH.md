# Push to GitHub - Authentication Required

## ✅ Commit Successful!
Your changes have been committed locally. Now you need to push to GitHub.

## 🔐 Authentication Options

### Option 1: GitHub CLI (Easiest)
```bash
# Install GitHub CLI if you don't have it
brew install gh

# Login to GitHub
gh auth login

# Then push
git push origin main
```

### Option 2: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "insyd-deployment"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

Then push using the token:
```bash
git push https://YOUR_TOKEN@github.com/JeevanaChokkapu/insyd.git main
```

Or update remote URL:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/JeevanaChokkapu/insyd.git
git push origin main
```

### Option 3: SSH Key (Best for long-term)
1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add to GitHub:
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

3. Go to GitHub.com → Settings → SSH and GPG keys → New SSH key
4. Paste your public key
5. Update remote to use SSH:
```bash
git remote set-url origin git@github.com:JeevanaChokkapu/insyd.git
git push origin main
```

### Option 4: Use GitHub Desktop App
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Open your repository
4. Click "Push origin"

## 🚀 After Pushing

Once your code is on GitHub, you can deploy:

1. **Backend (Railway/Render):**
   - Connect your GitHub repo
   - Deploy automatically

2. **Frontend (Vercel):**
   - Import from GitHub
   - Add `NEXT_PUBLIC_API_URL` environment variable
   - Deploy

## 📝 Quick Command (if using Personal Access Token)
Replace `YOUR_TOKEN` with your actual token:
```bash
git push https://YOUR_TOKEN@github.com/JeevanaChokkapu/insyd.git main
```

