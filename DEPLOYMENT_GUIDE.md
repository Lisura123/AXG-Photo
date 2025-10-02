# 🚀 Complete AXG Website Setup & Deployment Guide

This guide provides a complete workflow for deploying your AXG Camera Store website to cPanel hosting and setting up GitHub integration for easy updates and maintenance.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [GitHub Repository Setup](#github-repository-setup)
3. [cPanel Deployment](#cpanel-deployment)
4. [Update Workflow](#update-workflow)
5. [Maintenance & Backups](#maintenance--backups)
6. [Troubleshooting](#troubleshooting)

---

## 1. Initial Setup

### Prerequisites

- ✅ cPanel hosting account with Node.js support
- ✅ Domain name pointed to your hosting
- ✅ MongoDB database (Atlas recommended)
- ✅ Git installed locally
- ✅ GitHub account

### Local Development Environment

```bash
# 1. Install project dependencies
npm run install:all

# 2. Configure environment
cp .env.example backend/.env
# Edit backend/.env with your local settings

# 3. Start development servers
npm run dev:backend    # Terminal 1 (Port 8070)
npm run dev:frontend   # Terminal 2 (Port 3000)
```

---

## 2. GitHub Repository Setup

### Create GitHub Repository

1. **Create new repository** on GitHub:

   - Repository name: `axg-camera-store`
   - Description: `AXG Camera Equipment Store - React/Node.js E-commerce`
   - Make it Private (recommended for production sites)

2. **Initialize local Git repository**:

```bash
# Initialize Git (if not already done)
git init

# Add GitHub remote
git remote add origin https://github.com/YOURUSERNAME/axg-camera-store.git

# Initial commit and push
git add .
git commit -m "Initial AXG website setup"
git push -u origin main
```

### GitHub Secrets (Optional - for automated deployment)

In your GitHub repository settings, add these secrets:

- `FTP_HOST` - Your cPanel FTP hostname
- `FTP_USERNAME` - Your cPanel FTP username
- `FTP_PASSWORD` - Your cPanel FTP password

---

## 3. cPanel Deployment

### Step 1: Build Deployment Package

```bash
# Run the deployment script
./deployment/deploy.sh
```

This creates:

- ✅ `deployment/cpanel-ready/` - Ready-to-upload files
- ✅ `deployment/axg-website-YYYYMMDD-HHMMSS.zip` - Compressed package
- ✅ Complete deployment instructions

### Step 2: Upload to cPanel

#### Option A: File Manager Upload

1. **Login to cPanel** → File Manager
2. **Navigate to public_html** folder
3. **Upload the ZIP file** (`axg-website-*.zip`)
4. **Extract** the ZIP file contents
5. **Delete** the ZIP file after extraction

#### Option B: FTP Upload

```bash
# Using FTP client (FileZilla, etc.)
# Upload contents of deployment/cpanel-ready/ to public_html/
```

### Step 3: Backend Configuration

#### Create Node.js Application

1. **cPanel → Node.js Apps** → Create App
2. **Settings**:
   - Node.js Version: `16.x` or higher
   - Application Root: `/public_html/api`
   - Application URL: `yourdomain.com/api`
   - Startup File: `server.js`

#### Configure Environment

1. **Copy environment file**:

```bash
# In cPanel File Manager or FTP
cp /public_html/api/.env.production /public_html/api/.env
```

2. **Edit `.env` file** with your production values:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/axg
JWT_SECRET=your-secure-jwt-secret-here
NODE_ENV=production
PORT=8070
ALLOWED_ORIGINS=https://yourdomain.com
```

#### Install Dependencies & Start

1. **In cPanel Node.js Apps**:
   - Click "Run NPM Install"
   - Click "Restart" to start the application

### Step 4: Database Setup

#### MongoDB Atlas (Recommended)

1. **Create account** at [mongodb.com](https://mongodb.com)
2. **Create cluster** (free tier available)
3. **Create database user**
4. **Get connection string**
5. **Add to .env file**
6. **Whitelist your server IP** in Atlas

---

## 4. Update Workflow

### Quick Updates (Recommended Method)

```bash
# Use the automated update script
./update.sh

# Options:
# 1. Commit & Push to GitHub only
# 2. Build & Deploy to cPanel only
# 3. Both (Full workflow)
```

### Manual Update Process

```bash
# 1. Make your changes locally
# (Edit files, add features, fix bugs)

# 2. Test locally
npm run dev:frontend
npm run dev:backend

# 3. Commit to GitHub
git add .
git commit -m "Describe your changes"
git push origin main

# 4. Deploy to production
./deployment/deploy.sh

# 5. Upload new files to cPanel
# (Upload contents of deployment/cpanel-ready/)
```

### Individual Component Updates

#### Frontend Only Updates

```bash
# Build frontend
npm run build:frontend

# Upload build files to cPanel public_html/
# (Contents of frontend/build/ folder)
```

#### Backend Only Updates

```bash
# Upload changed backend files to public_html/api/
# Restart Node.js app in cPanel
```

---

## 5. Maintenance & Backups

### Regular Maintenance Tasks

#### Weekly

- ✅ Check website functionality
- ✅ Review server logs for errors
- ✅ Monitor database performance
- ✅ Update dependencies if needed

#### Monthly

- ✅ Database backup
- ✅ Full website backup
- ✅ Security updates
- ✅ Performance optimization

### Backup Strategy

#### Automated Backups

```bash
# Database backup (run monthly)
mongodump --uri="your-mongodb-connection-string" --out=./backups/$(date +%Y%m%d)

# Website files backup
tar -czf website-backup-$(date +%Y%m%d).tar.gz public_html/
```

#### Manual Backups

1. **cPanel Backup** → Create full backup
2. **Download to local storage**
3. **GitHub serves as code backup**

### Performance Optimization

#### Frontend Optimization

- ✅ Image compression (done automatically)
- ✅ Gzip compression (enabled in .htaccess)
- ✅ Browser caching (configured)
- ✅ Code splitting (built into React)

#### Backend Optimization

- ✅ Database indexing
- ✅ API response caching
- ✅ File upload optimization
- ✅ Error monitoring

---

## 6. Troubleshooting

### Common Issues & Solutions

#### Frontend Issues

**Issue**: 404 errors on page refresh

```bash
# Solution: Ensure .htaccess is uploaded to public_html/
# File should contain React Router rewrite rules
```

**Issue**: Images not loading

```bash
# Solution: Check file paths and permissions
# Ensure images are in public_html/static/media/
```

#### Backend Issues

**Issue**: API not responding

```bash
# Check Node.js app status in cPanel
# Restart the application
# Check .env configuration
```

**Issue**: Database connection errors

```bash
# Verify MongoDB connection string
# Check IP whitelist in MongoDB Atlas
# Ensure database user has correct permissions
```

#### Deployment Issues

**Issue**: Build fails

```bash
# Check Node.js version compatibility
# Clear node_modules and reinstall
cd frontend && rm -rf node_modules && npm install
```

**Issue**: Upload timeouts

```bash
# Use smaller ZIP files
# Upload folders separately
# Check hosting provider limits
```

### Getting Help

#### Check Logs

1. **Browser Console** (F12) for frontend errors
2. **cPanel Node.js Logs** for backend errors
3. **cPanel Error Logs** for server issues

#### Support Resources

- 📧 Create GitHub issue for code-related problems
- 📞 Contact hosting provider for server issues
- 📖 Check documentation in `/docs` folder

---

## 📞 Quick Reference Commands

```bash
# Full deployment workflow
./update.sh

# Build only
./deployment/deploy.sh

# Install dependencies
npm run install:all

# Start development
npm run dev:frontend & npm run dev:backend

# Git workflow
git add . && git commit -m "Update" && git push origin main

# Build frontend
npm run build:frontend
```

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] All pages navigate correctly
- [ ] API endpoints respond (test /api/health)
- [ ] User registration/login works
- [ ] Product listings display
- [ ] Images load properly
- [ ] Contact forms function
- [ ] Mobile responsiveness
- [ ] SSL certificate active
- [ ] Database connections stable

---

## 🎉 Success!

Your AXG Camera Store website is now deployed and ready for business!

**Live Website**: `https://yourdomain.com`
**API Endpoint**: `https://yourdomain.com/api`
**Admin Panel**: `https://yourdomain.com/admin`

Remember to regularly update your website using the simple workflow:
`./update.sh` → Select option 3 → Enter commit message → Done! 🚀
