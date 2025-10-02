const API_BASE = "http://localhost:8070/api";

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : null;
};

// Helper function for API requests
const makeRequest = async (url, options = {}) => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("Authentication required. Please log in.");
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// Get user's wishlist
export const getUserWishlist = async () => {
  try {
    const data = await makeRequest(`${API_BASE}/wishlist`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const data = await makeRequest(`${API_BASE}/wishlist/add/${productId}`, {
      method: "POST",
    });
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const data = await makeRequest(`${API_BASE}/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

// Toggle product in wishlist (add if not present, remove if present)
export const toggleWishlistItem = async (productId) => {
  try {
    const data = await makeRequest(`${API_BASE}/wishlist/toggle/${productId}`, {
      method: "POST",
    });
    return data;
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    throw error;
  }
};

// Check if product is in wishlist (from current wishlist array)
export const isInWishlist = (productId, wishlistItems) => {
  if (!Array.isArray(wishlistItems)) return false;
  return wishlistItems.some(
    (item) =>
      item._id === productId || item.id === productId || item === productId
  );
};
