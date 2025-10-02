/**
 * Image utility functions for handling product images
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8070";

/**
 * Get the full URL for a product image
 * @param {string} imagePath - The image path from the backend (e.g., "/uploads/products/image.jpg")
 * @param {string} fallback - Fallback image path if imagePath is empty
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath, fallback = "/placeholder-image.jpg") => {
  if (!imagePath) {
    return fallback;
  }

  // If imagePath already includes the full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If imagePath starts with "/uploads", append to API_BASE
  if (imagePath.startsWith("/uploads")) {
    return `${API_BASE}${imagePath}`;
  }

  // If imagePath is relative, construct full path
  return `${API_BASE}/uploads/products/${imagePath}`;
};

/**
 * Get optimized image style for product cards
 * @param {number} height - Desired height in pixels
 * @param {string} objectFit - CSS object-fit property ("contain" | "cover" | "fill" | "scale-down")
 * @returns {object} - CSS style object
 */
export const getImageStyle = (height = 200, objectFit = "contain") => ({
  height: `${height}px`,
  objectFit,
  objectPosition: "center",
  backgroundColor: "#f8f9fa",
  padding: objectFit === "contain" ? "10px" : "0",
  transition: "transform 0.3s ease",
  borderRadius: "8px",
  width: "100%",
});

/**
 * Handle image load errors by setting a fallback
 * @param {Event} event - The error event
 * @param {string} fallback - Fallback image URL
 */
export const handleImageError = (
  event,
  fallback = "/placeholder-image.jpg"
) => {
  event.target.src = fallback;
  event.target.onerror = null; // Prevent infinite loop
};

/**
 * Create a placeholder image URL with text
 * @param {string} text - Text to display on placeholder
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} bgColor - Background color (hex)
 * @param {string} textColor - Text color (hex)
 * @returns {string} - Data URL for placeholder image
 */
export const createPlaceholderUrl = (
  text = "No Image",
  width = 300,
  height = 200,
  bgColor = "f8f9fa",
  textColor = "6c757d"
) => {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(
    text
  )}`;
};

export default {
  getImageUrl,
  getImageStyle,
  handleImageError,
  createPlaceholderUrl,
};
