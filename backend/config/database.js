const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("🔗 Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🔌 Mongoose disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("🔒 MongoDB connection closed through app termination");
        process.exit(0);
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    // Log specific MongoDB connection errors
    if (error.name === "MongooseServerSelectionError") {
      console.error(
        "🔍 Server Selection Error - Check your MongoDB URI and network connection"
      );
    } else if (error.name === "MongoParseError") {
      console.error(
        "🔍 MongoDB URI Parse Error - Check your connection string format"
      );
    } else if (error.name === "MongoNetworkError") {
      console.error(
        "🔍 Network Error - Check your internet connection and MongoDB Atlas settings"
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
