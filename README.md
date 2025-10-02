# AXG Camera Equipment Store

A modern React-based e-commerce platform for camera equipment and accessories.

## 🎯 Project Overview

**AXG** is a professional camera equipment store offering:

- Camera batteries and chargers
- Lens filters (58mm, 67mm, 77mm)
- Card readers and storage solutions
- Camera backpacks and accessories

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive UI components
- **Lucide React** - Modern icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication system
- **Multer** - File upload handling

## 📁 Project Structure

```
AXG/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API service functions
│   │   └── assets/         # Images and static files
│   ├── public/             # Public assets
│   └── build/              # Production build files
├── backend/                # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── uploads/            # File upload directory
├── deployment/             # Deployment scripts and configs
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/axg-camera-store.git
cd axg-camera-store
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Environment Setup**

```bash
# Backend - Create .env file
cd ../backend
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

5. **Start Development Servers**

```bash
# Terminal 1 - Backend (Port 8070)
cd backend
npm run dev

# Terminal 2 - Frontend (Port 3000)
cd frontend
npm start
```

## 🌐 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# The build/ folder contains production-ready files for deployment
```

### cPanel Deployment

1. Upload `frontend/build/` contents to your cPanel public_html folder
2. Deploy backend to your hosting provider's Node.js environment
3. Update API endpoints in production build

## 📋 Available Scripts

### Frontend

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
PORT=8070
```

### API Endpoints

- Base URL (Development): `http://localhost:8070/api`
- Base URL (Production): `https://yourdomain.com/api`

## 📱 Features

### User Features

- Product browsing and filtering
- User authentication and profiles
- Wishlist functionality
- Product reviews and ratings
- Responsive design for all devices

### Admin Features

- Product management (CRUD)
- User management
- Order tracking
- Analytics dashboard
- File upload for product images

## 🔄 Development Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit changes: `git commit -m "Add new feature"`
4. Push to GitHub: `git push origin feature/new-feature`
5. Create Pull Request
6. Merge to main branch
7. Deploy to production

## 🚀 Deployment Workflow

### Automated Deployment (Recommended)

```bash
# Use deployment script
npm run deploy

# Or manual steps:
npm run build:frontend
npm run deploy:cpanel
```

### Manual Deployment

1. Build frontend: `cd frontend && npm run build`
2. Upload build files to cPanel public_html
3. Deploy backend to hosting provider
4. Update environment variables

## 📊 Performance Optimization

- Code splitting with React.lazy()
- Image optimization and lazy loading
- API response caching
- MongoDB query optimization
- Gzip compression for static assets

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting for API endpoints

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Check API_BASE_URL in frontend
2. **Database connection**: Verify MongoDB connection string
3. **Build errors**: Clear node_modules and reinstall
4. **Upload issues**: Check file permissions on server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- Email: support@axg.com
- Website: https://yourdomain.com
- GitHub Issues: Create an issue in this repository

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Inventory management system
