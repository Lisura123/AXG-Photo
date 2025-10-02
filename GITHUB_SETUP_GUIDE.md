# 🚀 GitHub Setup Guide for AXG Camera Store

This guide will help you upload your AXG website to GitHub, enable GitHub Pages hosting, and set up an easy workflow for future updates.

## 📋 Table of Contents

1. [Create GitHub Repository](#1-create-github-repository)
2. [Upload Your Website](#2-upload-your-website)
3. [GitHub Pages Setup](#3-github-pages-setup)
4. [Daily Update Workflow](#4-daily-update-workflow)
5. [Backup & Maintenance](#5-backup--maintenance)

---

## 1. Create GitHub Repository

### Step 1: Create Repository on GitHub

1. **Go to GitHub.com** and sign in
2. **Click "New" repository** (green button)
3. **Repository settings**:

   - **Repository name**: `axg-camera-store`
   - **Description**: `AXG Camera Equipment Store - Professional E-commerce Website`
   - **Visibility**: `Public` (required for GitHub Pages free hosting)
   - **Initialize**: ❌ Don't check any boxes (we already have files)

4. **Click "Create repository"**

### Step 2: Connect Your Local Project

```bash
# Navigate to your project
cd "/Users/lisurasigera/Desktop/AXG 2"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOURUSERNAME/axg-camera-store.git

# Verify the remote was added
git remote -v
```

---

## 2. Upload Your Website

### Step 1: Prepare Files for GitHub

```bash
# Add the new file we created
git add READY_TO_DEPLOY.md

# Commit the addition
git commit -m "Add deployment ready guide"

# Push to GitHub for the first time
git push -u origin main
```

### Step 2: Verify Upload

1. **Go to your GitHub repository** (`https://github.com/YOURUSERNAME/axg-camera-store`)
2. **Check that all files are there**:
   - ✅ frontend/ folder with React app
   - ✅ backend/ folder with Node.js API
   - ✅ deployment/ folder with scripts
   - ✅ Documentation files (README.md, etc.)

---

## 3. GitHub Pages Setup

GitHub Pages works best with static websites. Since your AXG store has both frontend and backend, we'll set up multiple hosting options:

### Option A: Frontend-Only GitHub Pages (Recommended for Demo)

#### Step 1: Create GitHub Pages Branch

```bash
# Create a new branch for GitHub Pages
git checkout -b gh-pages

# Build the frontend for production
cd frontend
npm run build

# Copy build files to root for GitHub Pages
cp -r build/* ../
cd ../

# Add GitHub Pages files
git add .
git commit -m "Add GitHub Pages build"
git push -u origin gh-pages
```

#### Step 2: Enable GitHub Pages

1. **Go to repository Settings**
2. **Scroll to "Pages" section**
3. **Source**: Deploy from branch
4. **Branch**: `gh-pages` / `/ (root)`
5. **Click Save**

**Your website will be available at**: `https://YOURUSERNAME.github.io/axg-camera-store`

### Option B: Full-Stack Deployment (For Production)

For a complete working website with backend, you'll still need separate hosting for the Node.js backend (like cPanel, Heroku, or Vercel). GitHub Pages only hosts static files.

#### Frontend + Backend Setup:

1. **GitHub Pages**: Frontend (static React build)
2. **Separate Hosting**: Backend API (cPanel, Heroku, Railway, etc.)
3. **Database**: MongoDB Atlas (cloud database)

---

## 4. Daily Update Workflow

### Quick Update Process (Recommended)

```bash
# Use the automated script for everything
./update.sh

# This will:
# 1. Commit your changes to main branch
# 2. Build frontend for GitHub Pages
# 3. Update gh-pages branch
# 4. Push everything to GitHub
```

### Manual Update Process

```bash
# 1. Make your changes (edit files, add features, etc.)

# 2. Test locally
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2

# 3. Commit to main branch
git add .
git commit -m "Describe your changes here"
git push origin main

# 4. Update GitHub Pages
git checkout gh-pages
cd frontend && npm run build && cd ..
cp -r frontend/build/* .
git add .
git commit -m "Update GitHub Pages"
git push origin gh-pages
git checkout main
```

### Enhanced Update Script

Let me create an improved update script that handles GitHub Pages:

```bash
# This will be in your update.sh file
#!/bin/bash

echo "🚀 AXG Website Update Workflow"
echo "Choose an option:"
echo "1. Update main branch only"
echo "2. Update GitHub Pages only"
echo "3. Full update (main + GitHub Pages)"
echo "4. Deploy to cPanel"

read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo "📝 Updating main branch..."
    read -p "Commit message: " message
    git add .
    git commit -m "$message"
    git push origin main
    ;;
  2)
    echo "🌐 Updating GitHub Pages..."
    git checkout gh-pages
    cd frontend && npm run build && cd ..
    cp -r frontend/build/* .
    git add .
    git commit -m "Update GitHub Pages - $(date)"
    git push origin gh-pages
    git checkout main
    ;;
  3)
    echo "🔄 Full update..."
    read -p "Commit message: " message

    # Update main branch
    git add .
    git commit -m "$message"
    git push origin main

    # Update GitHub Pages
    git checkout gh-pages
    cd frontend && npm run build && cd ..
    cp -r frontend/build/* .
    git add .
    git commit -m "Update GitHub Pages - $(date)"
    git push origin gh-pages
    git checkout main
    ;;
  4)
    echo "📦 Creating cPanel deployment..."
    ./deployment/deploy.sh
    ;;
esac

echo "✅ Update complete!"
```

---

## 5. Backup & Maintenance

### Automated Backups

Your code is automatically backed up to GitHub every time you push changes.

### Regular Maintenance Tasks

#### Weekly

- ✅ Test website functionality on GitHub Pages
- ✅ Check repository for any issues
- ✅ Review and update documentation

#### Monthly

- ✅ Update dependencies (`npm update`)
- ✅ Review security alerts from GitHub
- ✅ Check website performance
- ✅ Update content and product information

### GitHub Repository Benefits

#### Version Control

- 📚 Complete history of all changes
- 🔄 Easy rollback to previous versions
- 🌿 Branch management for new features
- 👥 Collaboration support

#### GitHub Features

- 🛡️ Security alerts for vulnerabilities
- 📊 Code scanning and analysis
- 📝 Issues tracking
- 🔗 Integration with other services

---

## 🌐 Hosting Options Summary

| Option               | Frontend        | Backend    | Database         | Cost                |
| -------------------- | --------------- | ---------- | ---------------- | ------------------- |
| **GitHub Pages**     | ✅ Free         | ❌ No      | ❌ No            | Free                |
| **GitHub + cPanel**  | ✅ GitHub Pages | ✅ cPanel  | ✅ MongoDB Atlas | ~$5-15/month        |
| **Full cPanel**      | ✅ cPanel       | ✅ cPanel  | ✅ MongoDB Atlas | ~$5-15/month        |
| **Vercel + Railway** | ✅ Vercel       | ✅ Railway | ✅ MongoDB Atlas | Free tier available |

### Recommended Setup:

- **Demo/Portfolio**: GitHub Pages (frontend only)
- **Production Store**: cPanel hosting (full-stack) + GitHub for code management

---

## 🔗 Your Website URLs

After setup, you'll have:

- **GitHub Repository**: `https://github.com/YOURUSERNAME/axg-camera-store`
- **GitHub Pages Demo**: `https://YOURUSERNAME.github.io/axg-camera-store`
- **Production Site** (if using cPanel): `https://yourdomain.com`

---

## 🆘 Troubleshooting

### Common Issues

**GitHub Pages not updating**

```bash
# Force rebuild GitHub Pages
git checkout gh-pages
rm -rf *
cd frontend && npm run build && cd ..
cp -r frontend/build/* .
git add .
git commit -m "Force rebuild"
git push origin gh-pages
git checkout main
```

**Images not loading on GitHub Pages**

- Ensure image paths are relative (not absolute)
- Check that images are in the `frontend/public` or `frontend/src/assets` folder

**API calls failing on GitHub Pages**

- GitHub Pages only hosts static files
- API backend needs separate hosting (cPanel, Heroku, etc.)
- Update API endpoints in frontend code for production

---

## ✅ Quick Setup Checklist

- [ ] Create GitHub repository
- [ ] Connect local project to GitHub
- [ ] Push main branch to GitHub
- [ ] Create gh-pages branch for GitHub Pages
- [ ] Build and deploy frontend to GitHub Pages
- [ ] Test GitHub Pages website
- [ ] Set up update workflow
- [ ] Document production API endpoints (if using separate backend hosting)

---

## 🎉 Success!

Your AXG Camera Store is now on GitHub with:

✅ **Version Control** - All changes tracked and backed up  
✅ **GitHub Pages** - Free hosting for frontend demo  
✅ **Easy Updates** - Simple workflow for maintenance  
✅ **Professional Setup** - Industry-standard development practices

**Next Steps**: Follow this guide step-by-step, and you'll have a professional GitHub presence for your camera store! 🚀📷
