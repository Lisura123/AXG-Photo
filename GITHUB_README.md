# 📷 AXG Photo - Camera Equipment Store

> Professional e-commerce platform for camera equipment and accessories built with React and Node.js

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://Lisura123.github.io/AXG-Photo)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blue)](https://Lisura123.github.io/AXG-Photo)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Overview

**AXG Photo** is a modern, full-stack e-commerce website specializing in professional camera equipment and accessories. Built with cutting-edge web technologies, it provides a seamless shopping experience for photographers and camera enthusiasts.

### 🌟 Live Demo

**Website**: [https://Lisura123.github.io/AXG-Photo](https://Lisura123.github.io/AXG-Photo)

## ✨ Features

### 🛒 E-commerce Functionality

- **Product Catalog**: Browse camera batteries, chargers, lens filters, and accessories
- **Smart Filtering**: Dynamic category filtering with parent-child relationships
- **Search**: Find products quickly with intelligent search
- **User Accounts**: Secure registration and login system
- **Wishlist**: Save favorite products for later
- **Reviews**: Rate and review products
- **Mobile Responsive**: Optimized for all devices

### 🎨 Frontend Features

- **React 18**: Modern component-based architecture
- **Bootstrap 5**: Professional, responsive design
- **Dynamic Routing**: Smooth navigation with React Router
- **Context Management**: Efficient state management
- **Lazy Loading**: Optimized image loading for better performance
- **Professional UI**: Clean, modern interface design

### ⚙️ Backend Features

- **Node.js/Express**: Robust API server
- **MongoDB**: Scalable NoSQL database
- **JWT Authentication**: Secure user sessions
- **File Uploads**: Product image management
- **RESTful APIs**: Well-structured API endpoints
- **Error Handling**: Comprehensive error management

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18
- **Styling**: Bootstrap 5, Custom CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Security**: CORS, Helmet, Rate Limiting

### DevOps & Deployment

- **Version Control**: Git & GitHub
- **Hosting**: GitHub Pages (Frontend), cPanel (Full-stack)
- **CI/CD**: GitHub Actions
- **Build Tools**: Create React App
- **Package Manager**: npm

## 📦 Product Categories

### Camera Power Solutions

- **Canon Batteries**: LP-E6, LP-E17 series
- **Sony Batteries**: NP-FW50, NP-FZ100 series
- **Universal Chargers**: Multi-brand compatibility

### Lens Accessories

- **58mm Filters**: UV, Polarizing, ND filters
- **67mm Filters**: Professional grade options
- **77mm Filters**: Wide-angle lens compatible

### Storage & Accessories

- **Card Readers**: High-speed USB 3.0
- **Camera Backpacks**: Weather-resistant protection
- **Memory Cards**: SD, CF, XQD options

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB database
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Lisura123/AXG-Photo.git
cd AXG-Photo

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example backend/.env
# Edit backend/.env with your database credentials

# Start development servers
npm run dev:backend    # Port 8070
npm run dev:frontend   # Port 3000
```

### Deployment

```bash
# Build for production
npm run build:frontend

# Deploy to cPanel
./deployment/deploy.sh

# Or deploy to GitHub Pages
./update.sh  # Choose option 3 or 4
```

## 📖 Documentation

- **[Setup Guide](GITHUB_SETUP_GUIDE.md)** - Complete GitHub and hosting setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Quick Start](LISURA_GITHUB_SETUP.md)** - 2-minute setup for this repository
- **[API Documentation](backend/README.md)** - Backend API reference

## 🔧 Development Workflow

### Daily Updates

```bash
# Make your changes
# Then run:
./update.sh

# Choose from:
# 1. Update main branch only
# 3. Update GitHub Pages only
# 4. Full GitHub workflow (recommended)
# 5. Deploy to cPanel
```

### Project Structure

```
AXG-Photo/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route components
│   │   ├── context/    # State management
│   │   ├── services/   # API services
│   │   └── assets/     # Images and static files
├── backend/            # Node.js API server
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Custom middleware
│   └── config/         # Configuration files
├── deployment/         # Deployment scripts
└── docs/              # Documentation
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:slug` - Get products by category

### Wishlist

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Reviews

- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Add product review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lisura123**

- GitHub: [@Lisura123](https://github.com/Lisura123)
- Repository: [AXG-Photo](https://github.com/Lisura123/AXG-Photo)

## 🙏 Acknowledgments

- React community for excellent documentation
- Bootstrap team for responsive design framework
- MongoDB for flexible database solutions
- GitHub for hosting and CI/CD platform

---

⭐ **Star this repository if you found it helpful!**

📧 **Questions?** Open an issue or check the documentation files.

🚀 **Ready to deploy?** Follow the [Quick Start Guide](LISURA_GITHUB_SETUP.md)!
