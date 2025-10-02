const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Import models for future use
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Review = require("../models/Review");

// Test endpoint to debug user stats without authentication
router.get("/test-users", async (req, res) => {
  try {
    console.log("Testing user model...");

    const totalUsers = await User.countDocuments();
    console.log("Total users found:", totalUsers);

    const activeUsers = await User.countDocuments({ isActive: true });
    console.log("Active users found:", activeUsers);

    const inactiveUsers = await User.countDocuments({ isActive: false });
    console.log("Inactive users found:", inactiveUsers);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    console.log("Recent registrations found:", recentRegistrations);

    res.status(200).json({
      success: true,
      message: "Test endpoint working",
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Test endpoint error",
      error: error.message,
    });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/products");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// GET /api/products - Get all products
router.get("/products", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subCategory,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      featured,
      isNew,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== "all") {
      // Special handling for lens-filters - get all subcategories
      if (category === "lens-filters" || category === "Lens Filters") {
        // Find the parent lens-filters category
        const parentCategory = await Category.findOne({
          $or: [{ slug: "lens-filters" }, { name: "Lens Filters" }],
        });

        if (parentCategory) {
          // Find all subcategories of lens-filters
          const lensFilterSubCategories = await Category.find({
            parentCategory: parentCategory._id,
            isActive: true,
          });

          // Get all category IDs (parent + subcategories)
          const categoryIds = [
            parentCategory._id,
            ...lensFilterSubCategories.map((cat) => cat._id),
          ];
          filter.category = { $in: categoryIds };
        } else {
          // Fallback to direct match
          filter.category = category;
        }
      } else {
        // For other categories, try to find by slug or name
        const categoryDoc = await Category.findOne({
          $or: [{ slug: category }, { name: category }],
        });

        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // If no category found, try direct match (for backward compatibility)
          filter.category = category;
        }
      }
    }

    if (subCategory && subCategory !== "all") {
      filter.subCategory = subCategory;
    }

    if (search) {
      // Enhanced search with better matching and category names
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { features: { $elemMatch: searchRegex } },
        // Also search in category names
        { "category.name": searchRegex },
        { "category.slug": searchRegex },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      error: error.message,
    });
  }
});

// GET /api/products/featured - Get featured products
router.get("/products/featured", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
      status: "Active",
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Featured products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving featured products",
      error: error.message,
    });
  }
});

// GET /api/products/new-arrivals - Get new arrivals
router.get("/products/new-arrivals", async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // First, try to get products created within last 30 days
    let products = await Product.find({
      isActive: true,
      status: "Active",
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // If no recent products, get the latest products by creation date or updatedAt
    if (products.length === 0) {
      products = await Product.find({
        isActive: true,
        status: "Active",
      })
        .populate("category", "name slug")
        .sort({ createdAt: -1, updatedAt: -1 })
        .limit(parseInt(limit));
    }

    res.status(200).json({
      success: true,
      message: "New arrivals retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving new arrivals",
      error: error.message,
    });
  }
});

// GET /api/products/search/autocomplete - Get search suggestions with enhanced relevance and fuzzy search
router.get("/products/search/autocomplete", async (req, res) => {
  try {
    const { q = "", limit = 10, category = "" } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        message: "Search suggestions retrieved successfully",
        data: { products: [], categories: [], total: 0 },
      });
    }

    // Normalize search query for better matching
    const normalizedQuery = q.toLowerCase().trim();

    // Create fuzzy search patterns for common typos
    const createFuzzyPatterns = (query) => {
      const patterns = [query];

      // Common photography brand typos
      const typoMap = {
        cannon: "canon",
        soney: "sony",
        nikon: "nikon",
        tameron: "tamron",
        sigm: "sigma",
        lens: "lens",
        lense: "lens",
        baterry: "battery",
        battry: "battery",
        charger: "charger",
        chargr: "charger",
        filter: "filter",
        filtr: "filter",
      };

      // Add corrected versions
      Object.keys(typoMap).forEach((typo) => {
        if (query.includes(typo)) {
          patterns.push(query.replace(typo, typoMap[typo]));
        }
      });

      return [...new Set(patterns)]; // Remove duplicates
    };

    const fuzzyPatterns = createFuzzyPatterns(normalizedQuery);

    // Build advanced search conditions with relevance scoring
    const buildSearchConditions = () => {
      const conditions = [];

      fuzzyPatterns.forEach((pattern) => {
        // Exact matches (highest priority)
        conditions.push({
          $or: [
            { name: { $regex: `^${pattern}`, $options: "i" } }, // Starts with
            { brand: { $regex: `^${pattern}`, $options: "i" } },
            { model: { $regex: `^${pattern}`, $options: "i" } },
          ],
        });

        // Word matches (medium priority)
        conditions.push({
          $or: [
            { name: { $regex: `\\b${pattern}`, $options: "i" } },
            { brand: { $regex: `\\b${pattern}`, $options: "i" } },
            { description: { $regex: `\\b${pattern}`, $options: "i" } },
          ],
        });

        // Contains matches (lower priority)
        conditions.push({
          $or: [
            { name: { $regex: pattern, $options: "i" } },
            { brand: { $regex: pattern, $options: "i" } },
            { description: { $regex: pattern, $options: "i" } },
            { model: { $regex: pattern, $options: "i" } },
          ],
        });
      });

      return conditions;
    };

    // Base query conditions
    let baseQuery = {
      isActive: true,
      status: "Active",
      $or: buildSearchConditions(),
    };

    // Apply category filter if provided
    if (category && category.trim()) {
      const categoryDoc = await Category.findOne({
        slug: category.trim(),
        isActive: true,
      });
      if (categoryDoc) {
        baseQuery.category = categoryDoc._id;
      }
    }

    // Get product suggestions with advanced sorting for relevance
    const products = await Product.aggregate([
      {
        $match: baseQuery,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          // Calculate relevance score
          relevanceScore: {
            $add: [
              // Exact name match bonus
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$name",
                      regex: new RegExp(`^${normalizedQuery}`, "i"),
                    },
                  },
                  100,
                  0,
                ],
              },
              // Name starts with query bonus
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$name",
                      regex: new RegExp(`^${normalizedQuery}`, "i"),
                    },
                  },
                  50,
                  0,
                ],
              },
              // Brand match bonus
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$brand",
                      regex: new RegExp(normalizedQuery, "i"),
                    },
                  },
                  30,
                  0,
                ],
              },
              // Featured product bonus
              { $cond: ["$isFeatured", 20, 0] },
              // Stock availability bonus
              { $cond: [{ $gt: ["$stockQuantity", 0] }, 10, 0] },
              // Rating bonus (0-10 points based on rating)
              { $multiply: ["$averageRating", 2] },
              // Recent activity bonus (newer products get slight boost)
              {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      { $subtract: [new Date(), 86400000 * 30] },
                    ],
                  },
                  5,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          brand: 1,
          model: 1,
          image: 1,
          averageRating: 1,
          reviewsCount: 1,
          stockQuantity: 1,
          isFeatured: 1,
          createdAt: 1,
          relevanceScore: 1,
          category: "$categoryInfo.name",
          categorySlug: "$categoryInfo.slug",
        },
      },
      {
        $sort: {
          relevanceScore: -1,
          averageRating: -1,
          reviewsCount: -1,
          name: 1,
        },
      },
      {
        $limit: parseInt(limit) || 8,
      },
    ]);

    // Format product suggestions
    const suggestions = products.map((product) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      category: product.category || "Uncategorized",
      categorySlug: product.categorySlug,
      image: product.image || null,
      rating: product.averageRating || 0,
      reviewsCount: product.reviewsCount || 0,
      inStock: product.stockQuantity > 0,
      isFeatured: product.isFeatured,
      type: "product",
      relevanceScore: product.relevanceScore,
      searchQuery: q,
    }));

    // Get category suggestions (if not filtering by category)
    let categorySuggestions = [];
    if (!category) {
      const searchRegex = { $regex: normalizedQuery, $options: "i" };
      const categories = await Category.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { slug: searchRegex },
          { description: searchRegex },
        ],
      })
        .select("name slug description")
        .sort({ name: 1 })
        .limit(3);

      categorySuggestions = categories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        type: "category",
        searchQuery: q,
      }));
    }

    res.status(200).json({
      success: true,
      message: "Search suggestions retrieved successfully",
      data: {
        products: suggestions,
        categories: categorySuggestions,
        total: suggestions.length + categorySuggestions.length,
        query: q,
        appliedFilters: {
          category: category || null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving search suggestions",
      error: error.message,
    });
  }
});

// GET /api/products/search/popular - Get popular/trending products for search suggestions
router.get("/products/search/popular", async (req, res) => {
  try {
    const { limit = 5, category = "" } = req.query;

    let baseQuery = {
      isActive: true,
      status: "Active",
    };

    // Apply category filter if provided
    if (category && category.trim()) {
      const categoryDoc = await Category.findOne({
        slug: category.trim(),
        isActive: true,
      });
      if (categoryDoc) {
        baseQuery.category = categoryDoc._id;
      }
    }

    // Get popular products based on multiple factors
    const popularProducts = await Product.aggregate([
      { $match: baseQuery },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          // Calculate popularity score
          popularityScore: {
            $add: [
              // Rating contribution (0-25 points)
              { $multiply: ["$averageRating", 5] },
              // Review count contribution (capped at 25 points)
              { $min: [{ $divide: ["$reviewsCount", 4] }, 25] },
              // Featured product bonus
              { $cond: ["$isFeatured", 20, 0] },
              // Stock availability bonus
              { $cond: [{ $gt: ["$stockQuantity", 0] }, 10, 0] },
              // Recent product bonus
              {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      { $subtract: [new Date(), 86400000 * 30] },
                    ],
                  },
                  15,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          brand: 1,
          image: 1,
          averageRating: 1,
          reviewsCount: 1,
          isFeatured: 1,
          popularityScore: 1,
          category: "$categoryInfo.name",
          categorySlug: "$categoryInfo.slug",
        },
      },
      {
        $sort: {
          popularityScore: -1,
          averageRating: -1,
          reviewsCount: -1,
        },
      },
      {
        $limit: parseInt(limit) || 5,
      },
    ]);

    const formattedProducts = popularProducts.map((product) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category || "Uncategorized",
      categorySlug: product.categorySlug,
      image: product.image || null,
      rating: product.averageRating || 0,
      reviewsCount: product.reviewsCount || 0,
      isFeatured: product.isFeatured,
      type: "popular-product",
    }));

    res.status(200).json({
      success: true,
      message: "Popular products retrieved successfully",
      data: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving popular products",
      error: error.message,
    });
  }
});

// GET /api/products/:id - Get single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("category", "name slug description");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

// GET /api/categories - Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("subCategories")
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      meta: {
        total: categories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving categories",
      error: error.message,
    });
  }
});

// GET /api/categories/:id - Get single category
router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("subCategories");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving category",
      error: error.message,
    });
  }
});

// POST /api/categories - Create new category (Admin only)
router.post("/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `A category with this ${field} '${value}' already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
});

// PUT /api/categories/:id - Update category (Admin only)
router.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
});

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete("/categories/:id", async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({
      category: req.params.id,
      isActive: true,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing products",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: { id: category._id },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
});

// POST /api/products - Create new product (Admin only - will add auth later)
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const productData = { ...req.body };

    // Handle features array if sent as string
    if (typeof productData.features === "string") {
      try {
        productData.features = JSON.parse(productData.features);
      } catch (e) {
        productData.features = productData.features
          .split(",")
          .map((f) => f.trim());
      }
    }

    // Handle image upload
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();

    // Populate category before sending response
    await product.populate("category", "name slug");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Clean up uploaded file if product creation failed
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../uploads/products",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
});

// PUT /api/products/:id - Update product (Admin only - will add auth later)
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const productData = { ...req.body };

    // Handle features array if sent as string
    if (typeof productData.features === "string") {
      try {
        productData.features = JSON.parse(productData.features);
      } catch (e) {
        productData.features = productData.features
          .split(",")
          .map((f) => f.trim());
      }
    }

    // Handle image upload
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;

      // Get old product to remove old image
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct && oldProduct.image) {
        const oldImagePath = path.join(__dirname, "..", oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Clean up uploaded file if update failed
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../uploads/products",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
});

// DELETE /api/products/:id - Delete product (Admin only - will add auth later)
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // Soft delete
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { id: product._id },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
});

// ==========================================
// USER MANAGEMENT ROUTES (Admin Only)
// ==========================================

const { protect, adminOnly } = require("../middleware/auth");

// GET /api/users - Get all users (Admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build search query
    let query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    if (status && status !== "all") {
      query.isActive = status === "active";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const users = await User.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password");

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// GET /api/users/:id - Get user by ID (Admin only)
router.get("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// POST /api/users - Create new user (Admin only)
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      isActive = true,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Validate role
    const validRoles = ["customer", "admin", "moderator"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be one of: customer, admin, moderator",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || "customer",
      phone,
      isActive,
    });

    // Remove password from response
    const userResponse = await User.findById(user._id).select("-password");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

// PUT /api/users/:id - Update user (Admin only)
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, role, phone, isActive } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === req.params.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    // Check email uniqueness if email is being changed
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    // Validate role
    const validRoles = ["customer", "admin", "moderator"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be one of: customer, admin, moderator",
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email: email ? email.toLowerCase() : user.email,
        role,
        phone,
        isActive,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

// PATCH /api/users/:id/toggle-status - Toggle user active status (Admin only)
router.patch(
  "/users/:id/toggle-status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent admin from deactivating themselves
      if (req.user._id.toString() === req.params.id && user.isActive) {
        return res.status(400).json({
          success: false,
          message: "You cannot deactivate your own account",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: !user.isActive, updatedAt: new Date() },
        { new: true }
      ).select("-password");

      res.status(200).json({
        success: true,
        message: `User ${
          updatedUser.isActive ? "activated" : "deactivated"
        } successfully`,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({
        success: false,
        message: "Error toggling user status",
        error: error.message,
      });
    }
  }
);

// GET /api/users/stats - Get user statistics (Admin only)
router.get("/users/stats", async (req, res) => {
  try {
    console.log("Stats endpoint called");
    console.log("Headers:", req.headers);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    console.log("Stats calculated successfully:", {
      totalUsers,
      activeUsers,
      inactiveUsers,
      recentRegistrations,
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByRole,
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message,
    });
  }
});

// GET /api/products/stats - Get product statistics
router.get("/products/stats", async (req, res) => {
  try {
    console.log("Product stats endpoint called");

    // Basic product counts
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "active" });
    const inactiveProducts = await Product.countDocuments({
      status: "inactive",
    });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });

    // New products (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newProducts = await Product.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Products by category
    const productsByCategory = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.name",
          count: { $sum: 1 },
          categoryId: { $first: "$category" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Low stock products (assuming we have a stock field)
    const lowStockProducts = await Product.countDocuments({
      $or: [{ stock: { $lt: 10 } }, { stock: { $exists: false } }],
    });

    console.log("Product stats calculated successfully:", {
      totalProducts,
      activeProducts,
      featuredProducts,
      newProducts,
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        featuredProducts,
        newProducts,
        productsByCategory,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product statistics",
      error: error.message,
    });
  }
});

// GET /api/dashboard/overview - Get comprehensive dashboard data
router.get("/dashboard/overview", async (req, res) => {
  try {
    console.log("Dashboard overview endpoint called");

    // Get all stats in parallel for better performance
    const [userStats, productStats, reviewStats] = await Promise.all([
      // User stats
      (async () => {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentRegistrations = await User.countDocuments({
          createdAt: { $gte: thirtyDaysAgo },
        });
        return { totalUsers, activeUsers, recentRegistrations };
      })(),

      // Product stats
      (async () => {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({
          status: "active",
        });
        const featuredProducts = await Product.countDocuments({
          isFeatured: true,
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newProducts = await Product.countDocuments({
          createdAt: { $gte: thirtyDaysAgo },
        });
        return { totalProducts, activeProducts, featuredProducts, newProducts };
      })(),

      // Review stats
      (async () => {
        const totalReviews = await Review.countDocuments();
        const approvedReviews = await Review.countDocuments({
          isApproved: true,
        });
        const pendingReviews = await Review.countDocuments({
          isApproved: false,
        });
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentReviews = await Review.countDocuments({
          createdAt: { $gte: weekAgo },
        });
        return { totalReviews, approvedReviews, pendingReviews, recentReviews };
      })(),
    ]);

    const dashboardData = {
      users: userStats,
      products: productStats,
      reviews: reviewStats,
      lastUpdated: new Date(),
    };

    console.log("Dashboard overview calculated successfully");

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
});

// ==========================================
// REVIEW MANAGEMENT ROUTES
// ==========================================

// GET /api/reviews - Get all reviews (Admin) or reviews for a product
router.get("/reviews", async (req, res) => {
  try {
    const {
      productId,
      userId,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      rating,
      isApproved = true,
    } = req.query;

    // Build query
    let query = {};

    if (productId) {
      query.product = productId;
    }

    if (userId) {
      query.user = userId;
    }

    if (rating) {
      query.rating = rating;
    }

    // For public access, only show approved reviews
    if (req.query.public !== "false") {
      query.isApproved = true;
    } else if (isApproved !== undefined) {
      query.isApproved = isApproved === "true";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const reviews = await Review.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
});

// GET /api/reviews/:id - Get single review
router.get("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review",
      error: error.message,
    });
  }
});

// POST /api/reviews - Create new review (Authenticated users only)
router.post("/reviews", protect, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: product,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment: comment || "",
    });

    await review.populate([
      { path: "user", select: "firstName lastName email" },
      { path: "product", select: "name category price" },
    ]);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
});

// PUT /api/reviews/:id - Update review (User can update own, Admin can update any)
router.put("/reviews/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    const { rating, comment, isApproved, adminNotes } = req.body;

    // Users can only update rating and comment
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    // Only admins can update approval status and admin notes
    if (req.user.role === "admin") {
      if (isApproved !== undefined) updateData.isApproved = isApproved;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
});

// DELETE /api/reviews/:id - Delete review (User can delete own, Admin can delete any)
router.delete("/reviews/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
});

// GET /api/reviews/stats - Get review statistics (Admin only)
router.get("/reviews/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });

    const ratingDistribution = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentReviews = await Review.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        ratingDistribution,
        recentReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review statistics",
      error: error.message,
    });
  }
});

// PATCH /api/reviews/:id/approve - Approve/Reject review (Admin only)
router.patch("/reviews/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const { isApproved, adminNotes } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved, adminNotes },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? "approved" : "rejected"} successfully`,
      data: review,
    });
  } catch (error) {
    console.error("Error updating review approval:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review approval",
      error: error.message,
    });
  }
});

// GET /api/users/:userId/reviews - Get user's reviews
router.get("/users/:userId/reviews", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Profile Update Route
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Change Password Route
router.post("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ==========================================
// WISHLIST MANAGEMENT ROUTES
// ==========================================

// GET /api/wishlist - Get user's wishlist
router.get("/wishlist", protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// POST /api/wishlist/add/:productId - Add product to wishlist
router.post("/wishlist/add/:productId", protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get user and check if product is already in wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: {
        productId,
        wishlistCount: user.wishlist.length,
      },
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove product from wishlist
router.delete("/wishlist/remove/:productId", protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: {
        productId,
        wishlistCount: user.wishlist.length,
      },
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// POST /api/wishlist/toggle/:productId - Toggle product in wishlist
router.post("/wishlist/toggle/:productId", protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let action;
    if (user.wishlist.includes(productId)) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
      action = "removed";
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      action = "added";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Product ${action} ${
        action === "added" ? "to" : "from"
      } wishlist`,
      data: {
        productId,
        action,
        isInWishlist: action === "added",
        wishlistCount: user.wishlist.length,
      },
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
