#!/bin/bash

# GitHub Setup Script for AXG Camera Store
# This script helps you quickly set up your GitHub repository and GitHub Pages

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo "🚀 GitHub Setup for AXG Camera Store"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please run 'git init' first."
    exit 1
fi

echo "📋 Steps to complete:"
echo "1. Create GitHub repository"
echo "2. Connect local repository to GitHub"
echo "3. Push code to GitHub"
echo "4. Set up GitHub Pages"
echo ""

# Step 1: Get GitHub repository details
print_status "Step 1: GitHub Repository Setup"
echo "First, create a repository on GitHub:"
echo "  1. Go to https://github.com"
echo "  2. Click 'New repository'"
echo "  3. Repository name: AXG-Photo"
echo "  4. Description: Professional camera equipment store - React/Node.js e-commerce platform"
echo "  5. Make it PUBLIC (required for free GitHub Pages)"
echo "  6. Don't initialize with README, .gitignore, or license"
echo "  7. Click 'Create repository'"
echo ""

read -p "Have you created the GitHub repository? (y/N): " created_repo

if [[ ! "$created_repo" =~ ^[Yy]$ ]]; then
    print_warning "Please create the GitHub repository first, then run this script again."
    exit 0
fi

# Step 2: Set GitHub details
github_username="Lisura123"
repo_name="AXG-Photo"
github_url="https://github.com/$github_username/$repo_name.git"

print_status "Step 2: Connecting to GitHub repository"
echo "Repository URL: $github_url"

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    print_warning "Remote 'origin' already exists. Updating..."
    git remote set-url origin "$github_url"
else
    git remote add origin "$github_url"
fi

print_success "Repository connected!"

# Step 3: Push to GitHub
print_status "Step 3: Pushing code to GitHub"

# Check for uncommitted changes
if [ ! -z "$(git status --porcelain)" ]; then
    print_status "Found uncommitted changes. Committing..."
    git add .
    git commit -m "Prepare for GitHub setup - $(date +%Y-%m-%d)"
fi

# Push to main branch
print_status "Pushing to main branch..."
if git push -u origin main; then
    print_success "Code pushed to GitHub main branch!"
else
    print_error "Failed to push to GitHub. Please check your credentials and try again."
    echo "You may need to:"
    echo "  1. Set up GitHub authentication (personal access token)"
    echo "  2. Check your repository URL"
    echo "  3. Ensure you have push permissions"
    exit 1
fi

# Step 4: Set up GitHub Pages
print_status "Step 4: Setting up GitHub Pages"

read -p "Do you want to set up GitHub Pages for free hosting? (Y/n): " setup_pages

if [[ "$setup_pages" =~ ^[Nn]$ ]]; then
    print_warning "Skipping GitHub Pages setup."
else
    # Create gh-pages branch
    print_status "Creating gh-pages branch for GitHub Pages..."
    
    if git show-ref --verify --quiet refs/heads/gh-pages; then
        print_warning "gh-pages branch already exists."
        git checkout gh-pages
    else
        git checkout -b gh-pages
    fi
    
    # Build frontend
    print_status "Building frontend for GitHub Pages..."
    cd frontend
    
    if npm run build; then
        cd ..
        print_success "Frontend built successfully!"
        
        # Copy build files to root
        print_status "Copying build files to root directory..."
        cp -r frontend/build/* .
        
        # Create .nojekyll file (prevents Jekyll processing)
        touch .nojekyll
        
        # Commit and push
        git add .
        git commit -m "Initial GitHub Pages setup - $(date +%Y-%m-%d)"
        
        if git push -u origin gh-pages; then
            print_success "GitHub Pages branch created and pushed!"
            
            # Switch back to main
            git checkout main
            
            echo ""
            echo "🌐 GitHub Pages Setup Complete!"
            echo "================================="
            echo "Your website will be available at:"
            echo "https://$github_username.github.io/$repo_name"
            echo ""
            echo "⚠️  IMPORTANT: Enable GitHub Pages in repository settings:"
            echo "  1. Go to: https://github.com/$github_username/$repo_name/settings/pages"
            echo "  2. Source: Deploy from branch"
            echo "  3. Branch: gh-pages / / (root)"
            echo "  4. Click Save"
            echo ""
            echo "It may take 5-10 minutes for your site to be available."
            
        else
            print_error "Failed to push gh-pages branch."
        fi
    else
        print_error "Frontend build failed. Please check for errors and try again."
        cd ..
        git checkout main
    fi
fi

echo ""
echo "✅ GitHub Setup Complete!"
echo "========================"
echo ""
echo "📁 Repository: https://github.com/$github_username/$repo_name"

if [[ ! "$setup_pages" =~ ^[Nn]$ ]]; then
    echo "🌐 Website: https://$github_username.github.io/$repo_name (after enabling in settings)"
fi

echo ""
echo "🔄 Future Updates:"
echo "Use './update.sh' for easy updates:"
echo "  Option 1: Update main branch"
echo "  Option 3: Update GitHub Pages"
echo "  Option 4: Update both (recommended)"
echo ""
echo "📖 For detailed instructions, see: GITHUB_SETUP_GUIDE.md"

print_success "Setup completed successfully! 🎉"
