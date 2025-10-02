const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const Category = require("./models/Category");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany({});

    // Create main categories
    const categories = [
      {
        name: "Batteries",
        slug: "batteries",
        description: "Camera batteries and power accessories",
        sortOrder: 1,
      },
      {
        name: "Chargers",
        slug: "chargers",
        description: "Battery chargers and charging accessories",
        sortOrder: 2,
      },
      {
        name: "Card Readers",
        slug: "card-readers",
        description: "Memory card readers and storage accessories",
        sortOrder: 3,
      },
      {
        name: "Lens Filters",
        slug: "lens-filters",
        description: "Camera lens filters and protection",
        sortOrder: 4,
      },
      {
        name: "Camera Backpacks",
        slug: "camera-backpacks",
        description: "Camera bags and carrying solutions",
        sortOrder: 5,
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log("Categories seeded successfully:", createdCategories.length);

    // Create subcategories for Lens Filters
    const lensFiltersCategory = createdCategories.find(
      (cat) => cat.slug === "lens-filters"
    );

    const subCategories = [
      {
        name: "58mm Filters",
        slug: "58mm-filters",
        description: "58mm diameter lens filters",
        parentCategory: lensFiltersCategory._id,
        sortOrder: 1,
      },
      {
        name: "67mm Filters",
        slug: "67mm-filters",
        description: "67mm diameter lens filters",
        parentCategory: lensFiltersCategory._id,
        sortOrder: 2,
      },
      {
        name: "77mm Filters",
        slug: "77mm-filters",
        description: "77mm diameter lens filters",
        parentCategory: lensFiltersCategory._id,
        sortOrder: 3,
      },
    ];

    const createdSubCategories = await Category.insertMany(subCategories);
    console.log(
      "Subcategories seeded successfully:",
      createdSubCategories.length
    );

    // Update parent category to reference subcategories
    await Category.findByIdAndUpdate(lensFiltersCategory._id, {
      subCategories: createdSubCategories.map((sub) => sub._id),
    });

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedCategories();
