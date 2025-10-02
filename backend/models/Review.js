const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve for now, can be changed to false for moderation
    },
    isHelpful: {
      type: Number,
      default: 0, // Number of users who found this review helpful
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product

// Virtual for user full name
reviewSchema.virtual("userFullName").get(function () {
  if (this.user && this.user.firstName && this.user.lastName) {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  return "Anonymous User";
});

// Populate user and product data automatically
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email",
  }).populate({
    path: "product",
    select: "name category price",
  });
  next();
});

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, isApproved: true },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const Product = mongoose.model("Product");
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    const Product = mongoose.model("Product");
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

// Calculate average rating after save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

// Calculate average rating after remove
reviewSchema.post(/^findOneAndDelete/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.product);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
