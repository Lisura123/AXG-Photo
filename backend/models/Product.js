const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    features: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Feature description cannot exceed 200 characters"],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategory: {
      type: String,
      // For lens filters: 58mm, 67mm, 77mm
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
    },
    model: {
      type: String,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, "Product SKU is required"],
    },
    image: {
      type: String,
      default: "",
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Out of Stock"],
        message: "{VALUE} is not a valid status",
      },
      default: "Active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    averageRating: {
      type: Number,
      min: [0, "Average rating cannot be less than 0"],
      max: [5, "Average rating cannot be more than 5"],
      default: 0,
    },
    totalReviews: {
      type: Number,
      min: [0, "Total reviews cannot be negative"],
      default: 0,
    },
    reviewsCount: {
      type: Number,
      min: [0, "Reviews count cannot be negative"],
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: {
        type: String,
        enum: ["mm", "cm", "in"],
        default: "mm",
      },
    },
    compatibility: [String], // Compatible camera models
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if product is new (created within last 30 days)
productSchema.virtual("isNew").get(function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.createdAt > thirtyDaysAgo;
});

// Virtual for checking if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.stockQuantity > 0 && this.status === "Active";
});

// Pre-save middleware to auto-update status based on stock
productSchema.pre("save", function (next) {
  if (this.stockQuantity === 0 && this.status === "Active") {
    this.status = "Out of Stock";
  } else if (this.stockQuantity > 0 && this.status === "Out of Stock") {
    this.status = "Active";
  }
  next();
});

// Indexes for better query performance
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, status: 1 });

module.exports = mongoose.model("Product", productSchema);
