#!/bin/bash

# AXG Website Deployment Script
# This script builds the frontend and prepares files for cPanel deployment

echo "🚀 Starting AXG Website Deployment Process..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
BUILD_DIR="frontend/build"
DEPLOYMENT_DIR="deployment/dist"
CPANEL_READY_DIR="deployment/cpanel-ready"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    print_error "Frontend or Backend directory not found. Please run this script from the project root."
    exit 1
fi

# Clean previous build
print_status "Cleaning previous build files..."
rm -rf "$BUILD_DIR"
rm -rf "$DEPLOYMENT_DIR"
rm -rf "$CPANEL_READY_DIR"
mkdir -p "$DEPLOYMENT_DIR"
mkdir -p "$CPANEL_READY_DIR"

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install
    cd ..
fi

# Build frontend
print_status "Building frontend for production..."
cd "$FRONTEND_DIR"
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Copy build files to deployment directory
print_status "Preparing deployment files..."
cp -r "$BUILD_DIR"/* "$DEPLOYMENT_DIR/"

# Create cPanel-ready package
print_status "Creating cPanel-ready package..."
cp -r "$BUILD_DIR"/* "$CPANEL_READY_DIR/"

# Copy backend files for hosting
print_status "Preparing backend files..."
mkdir -p "$CPANEL_READY_DIR/api"
cp -r "$BACKEND_DIR"/* "$CPANEL_READY_DIR/api/"

# Remove development files from backend copy
rm -f "$CPANEL_READY_DIR/api/.env"
rm -rf "$CPANEL_READY_DIR/api/node_modules"

# Create production environment file template
cat > "$CPANEL_READY_DIR/api/.env.production" << EOL
# Production Environment Variables
# Copy this to .env and fill in your production values

# Database
MONGODB_URI=your_production_mongodb_connection_string

# JWT Configuration  
JWT_SECRET=your_production_jwt_secret_key_here
JWT_EXPIRE=30d

# Server Configuration
NODE_ENV=production
PORT=8070

# File Upload (adjust path for your server)
UPLOAD_PATH=./uploads

# CORS (your domain)
ALLOWED_ORIGINS=https://yourdomain.com

# Email Configuration (if used)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOL

# Create deployment instructions
cat > "$CPANEL_READY_DIR/DEPLOYMENT_INSTRUCTIONS.md" << EOL
# AXG Website Deployment Instructions

## 📋 Prerequisites
- cPanel hosting account with Node.js support
- MongoDB database (local or cloud)
- Domain name pointed to your hosting

## 🚀 Frontend Deployment (Static Files)

1. **Upload Frontend Files**
   - Upload all files from this directory (except 'api' folder) to your cPanel \`public_html\` folder
   - Maintain the folder structure exactly as provided

2. **File Permissions**
   - Ensure all files have proper read permissions (644 for files, 755 for directories)

## 🔧 Backend Deployment (API)

### Option A: Node.js App in cPanel (Recommended)
1. **Create Node.js App in cPanel**
   - Go to "Node.js Apps" in cPanel
   - Create new application
   - Set Node.js version to 16+ 
   - Set Application Root: \`/public_html/api\`
   - Set Application URL: \`yourdomain.com/api\`

2. **Upload Backend Files**
   - Upload contents of 'api' folder to the Node.js application root
   - Copy \`.env.production\` to \`.env\` and fill in your values

3. **Install Dependencies**
   - In cPanel Node.js Apps, click "Run NPM Install"
   - Or via terminal: \`cd /path/to/api && npm install\`

4. **Start Application**
   - Set startup file to \`server.js\`
   - Click "Restart" in cPanel Node.js Apps

### Option B: Separate Backend Hosting
1. Deploy backend to services like Heroku, DigitalOcean, or AWS
2. Update API endpoints in frontend build
3. Ensure CORS settings allow your domain

## 🔗 Configuration

### Frontend API Configuration
The frontend is pre-configured to use relative API paths (\`/api\`).
If hosting backend separately, update the API base URL.

### Database Setup
1. **MongoDB Atlas (Recommended)**
   - Create free cluster at mongodb.com
   - Get connection string
   - Add to .env file

2. **Local MongoDB**
   - Install MongoDB on your server
   - Create database and user
   - Update connection string

### Environment Variables
Fill in your production values in \`.env\`:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/axg
JWT_SECRET=your-super-secret-jwt-key-here
\`\`\`

## ✅ Post-Deployment Checklist

1. **Test Frontend**
   - [ ] Website loads at your domain
   - [ ] All pages navigate correctly
   - [ ] Images and assets load properly

2. **Test Backend API**
   - [ ] API endpoints respond at yourdomain.com/api/health
   - [ ] Database connections work
   - [ ] Authentication functions properly

3. **Test Full Integration**
   - [ ] User registration/login works
   - [ ] Product listings display
   - [ ] File uploads function (if applicable)

## 🔧 Troubleshooting

### Common Issues
1. **404 Errors on Refresh**
   - Add \`.htaccess\` file to public_html with React Router rules

2. **API Connection Errors**
   - Check Node.js app is running in cPanel
   - Verify .env configuration
   - Check CORS settings

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

### Support Files
- Check browser console for frontend errors
- Check Node.js app logs in cPanel for backend errors
- Verify all environment variables are set correctly

## 📞 Need Help?
If you encounter issues, check the main README.md for troubleshooting or create an issue on GitHub.
EOL

# Create .htaccess for React Router (SPA support)
cat > "$CPANEL_READY_DIR/.htaccess" << EOL
# React Router Support
Options -MultiViews
RewriteEngine On

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
</IfModule>
EOL

# Create package info
cat > "$CPANEL_READY_DIR/package-info.json" << EOL
{
  "name": "axg-camera-store",
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "deploymentType": "cpanel-ready",
  "frontend": {
    "framework": "React",
    "buildTool": "Create React App",
    "targetPath": "public_html/"
  },
  "backend": {
    "framework": "Node.js/Express",
    "targetPath": "public_html/api/",
    "requirements": ["Node.js 16+", "MongoDB"]
  }
}
EOL

# Create ZIP file for easy upload
print_status "Creating deployment ZIP file..."
cd "$CPANEL_READY_DIR"
zip -r "../axg-website-$(date +%Y%m%d-%H%M%S).zip" . > /dev/null 2>&1
cd ../..

# Generate deployment report
DEPLOYMENT_SIZE=$(du -sh "$CPANEL_READY_DIR" | cut -f1)
FRONTEND_FILES=$(find "$CPANEL_READY_DIR" -name "*.html" -o -name "*.js" -o -name "*.css" | wc -l)
BACKEND_FILES=$(find "$CPANEL_READY_DIR/api" -name "*.js" | wc -l)

print_success "Deployment package created successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "================================================"
echo "📁 Package Size: $DEPLOYMENT_SIZE"
echo "🖥️  Frontend Files: $FRONTEND_FILES files"
echo "⚙️  Backend Files: $BACKEND_FILES files"
echo "📦 Location: $CPANEL_READY_DIR"
echo "📋 ZIP Package: deployment/axg-website-*.zip"
echo ""
echo "📋 Next Steps:"
echo "1. Extract ZIP file contents"
echo "2. Upload to your cPanel hosting"
echo "3. Follow DEPLOYMENT_INSTRUCTIONS.md"
echo "4. Configure environment variables"
echo "5. Test your website"
echo ""
print_success "Deployment preparation complete! 🎉"
