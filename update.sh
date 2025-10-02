# AXG Website Update Script
# This script helps with the local development to deployment workflow

#!/bin/bash

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

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Initialize with: git init"
    exit 1
fi

# Show current status
print_status "Checking git status..."
git status --porcelain

echo ""
echo "🔄 AXG Website Update Workflow"
echo "================================"
echo "1. Commit & Push to GitHub"
echo "2. Build & Deploy to cPanel"
echo "3. Both (Recommended)"
echo "4. Exit"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        print_status "Starting Git workflow..."
        
        # Check for uncommitted changes
        if [ -z "$(git status --porcelain)" ]; then
            print_warning "No changes to commit."
        else
            # Add all changes
            git add .
            
            # Get commit message
            read -p "Enter commit message: " commit_msg
            
            if [ -z "$commit_msg" ]; then
                commit_msg="Update AXG website - $(date +%Y-%m-%d)"
            fi
            
            # Commit changes
            git commit -m "$commit_msg"
            
            # Push to GitHub
            print_status "Pushing to GitHub..."
            git push origin main
            
            if [ $? -eq 0 ]; then
                print_success "Changes pushed to GitHub successfully!"
            else
                print_error "Failed to push to GitHub. Check your connection and credentials."
            fi
        fi
        ;;
        
    2)
        print_status "Starting deployment process..."
        ./deployment/deploy.sh
        ;;
        
    3)
        print_status "Starting complete workflow (Git + Deployment)..."
        
        # Git workflow
        if [ ! -z "$(git status --porcelain)" ]; then
            git add .
            
            read -p "Enter commit message: " commit_msg
            
            if [ -z "$commit_msg" ]; then
                commit_msg="Update and deploy AXG website - $(date +%Y-%m-%d)"
            fi
            
            git commit -m "$commit_msg"
            
            print_status "Pushing to GitHub..."
            git push origin main
            
            if [ $? -eq 0 ]; then
                print_success "Changes pushed to GitHub successfully!"
                
                # Deploy
                print_status "Starting deployment..."
                ./deployment/deploy.sh
                
            else
                print_error "Failed to push to GitHub. Skipping deployment."
            fi
        else
            print_warning "No changes to commit. Proceeding with deployment only..."
            ./deployment/deploy.sh
        fi
        ;;
        
    4)
        print_status "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid option selected."
        exit 1
        ;;
esac

print_success "Workflow completed! 🎉"
