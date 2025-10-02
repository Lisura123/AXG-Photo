# AXG Backend API

Backend API for AXG Photography Equipment Store built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Mongoose** - MongoDB object modeling for Node.js
- **CORS** - Cross-Origin Resource Sharing enabled
- **Security** - Helmet.js for security headers
- **Error Handling** - Comprehensive error handling middleware
- **Environment Configuration** - Secure environment variables
- **Health Checks** - Built-in health monitoring endpoints

## 📦 Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env` file

4. Start the development server:

   ```bash
   npm run dev
   ```

   Or start in production mode:

   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Health & Testing

- `GET /` - Welcome message and API info
- `GET /test` - Test endpoint to verify backend connection
- `GET /health` - Health check with system information

### Future API Routes (Ready for Implementation)

- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🗄️ Database Models

### Product Model

- Complete product schema with specifications
- Categories: batteries, chargers, card-readers, lens-filters, camera-backpacks
- Sub-categories support (e.g., 58mm, 67mm, 77mm for lens filters)
- Inventory management
- Ratings and reviews
- Image management

### Category Model

- Hierarchical category structure
- SEO-friendly slugs
- Product count virtuals

### User Model (Ready for Authentication)

- User registration and authentication
- Role-based access (customer, admin, moderator)
- Profile management
- Address and preferences

## 🔧 Configuration

### MongoDB Connection

- **URL**: `mongodb+srv://AXG:Pllv2003@clusteraxg.cog7kx.mongodb.net/`
- **Database**: `axg_store`
- **Port**: `8070`

### Environment Variables

```env
MONGODB_URI=mongodb+srv://AXG:Pllv2003@clusteraxg.cog7kx.mongodb.net/?retryWrites=true&w=majority&appName=Clusteraxg
PORT=8070
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for frontend integration
- **Data Validation** - Mongoose schema validation
- **Error Handling** - Comprehensive error responses
- **Input Sanitization** - Body parser limits

## 📊 Monitoring & Logging

- **Morgan** - HTTP request logging
- **Health Endpoints** - System health monitoring
- **Error Tracking** - Detailed error logging
- **Performance Metrics** - Memory and CPU usage

## 🚀 Development Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

## 🔮 Future Enhancements

- [ ] JWT Authentication & Authorization
- [ ] Product CRUD operations
- [ ] Category management
- [ ] User management
- [ ] Order processing
- [ ] Payment integration
- [ ] Image upload handling
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization

## 📝 API Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the AXG development team.

---

**Built with ❤️ for AXG Photography Equipment Store**
