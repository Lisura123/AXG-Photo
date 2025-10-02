const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware Configuration
// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001", // Alternative frontend port
    "https://your-deployed-frontend-url.com", // Add your production URL here
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Static file serving for uploads
app.use("/uploads", express.static("uploads"));

// Health Check Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AXG Backend API is running successfully! 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      test: "/test",
      health: "/health",
      api: "/api",
    },
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend connected successfully",
    data: {
      server: "Express.js",
      database: "MongoDB Atlas",
      port: process.env.PORT || 8070,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

// Health Check Route
app.get("/health", (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    database: "connected",
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  try {
    res.status(200).json({
      success: true,
      health: healthCheck,
    });
  } catch (error) {
    healthCheck.message = error.message;
    res.status(503).json({
      success: false,
      health: healthCheck,
    });
  }
});

// API Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Auth Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /",
      "GET /test",
      "GET /health",
      "GET /api/products",
      "GET /api/categories",
      "POST /auth/register",
      "POST /auth/login",
      "POST /auth/logout",
      "GET /auth/profile",
      "POST /auth/create-admin",
    ],
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("🚨 Global Error Handler:", error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors (for future authentication)
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Server Configuration
const PORT = process.env.PORT || 8070;

const server = app.listen(PORT, () => {
  console.log("🚀 =======================================");
  console.log(`🚀 AXG Backend Server Started Successfully!`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`🚀 Local URL: http://localhost:${PORT}`);
  console.log(`🚀 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🚀 Health check: http://localhost:${PORT}/health`);
  console.log("🚀 =======================================");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received");
  console.log("👋 Shutting down gracefully");
  server.close(() => {
    console.log("👋 Process terminated");
  });
});

module.exports = app;
