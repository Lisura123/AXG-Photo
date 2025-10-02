import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  getUserWishlist,
  toggleWishlistItem,
} from "../services/wishlistService";
import { useAuth } from "./AuthContext";

// Initial state
const initialState = {
  cart: [],
  wishlist: [],
  wishlistLoading: false,
  user: null,
  isAuthenticated: false,
  categories: [],
  error: null,
};

// Action types
export const ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_QUANTITY: "UPDATE_CART_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SET_WISHLIST: "SET_WISHLIST",
  ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
  REMOVE_FROM_WISHLIST: "REMOVE_FROM_WISHLIST",
  CLEAR_WISHLIST: "CLEAR_WISHLIST",
  SET_WISHLIST_LOADING: "SET_WISHLIST_LOADING",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  SET_CATEGORIES: "SET_CATEGORIES",
  ADD_CATEGORY: "ADD_CATEGORY",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case ACTIONS.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case ACTIONS.SET_WISHLIST:
      return {
        ...state,
        wishlist: action.payload,
        wishlistLoading: false,
      };

    case ACTIONS.ADD_TO_WISHLIST: {
      // Check if product already exists in wishlist
      const existingWishlistItem = state.wishlist.find(
        (item) =>
          (item._id || item.id) === (action.payload._id || action.payload.id)
      );

      if (existingWishlistItem) {
        return state; // Don't add duplicates
      }

      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    }

    case ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => (item._id || item.id) !== action.payload
        ),
      };

    case ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        wishlist: [],
      };

    case ACTIONS.SET_WISHLIST_LOADING:
      return {
        ...state,
        wishlistLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        wishlist: [],
      };

    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load user wishlist when authenticated
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated || !localStorage.getItem("authToken")) {
      dispatch({ type: ACTIONS.CLEAR_WISHLIST });
      return;
    }

    try {
      dispatch({ type: ACTIONS.SET_WISHLIST_LOADING, payload: true });
      const wishlistItems = await getUserWishlist();
      dispatch({ type: ACTIONS.SET_WISHLIST, payload: wishlistItems });
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    } catch (error) {
      console.error("Error loading wishlist:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: ACTIONS.SET_WISHLIST, payload: [] });
    }
  }, [isAuthenticated]);

  // Load wishlist when user authentication status changes
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Cart actions
  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({
      type: ACTIONS.UPDATE_CART_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  // Enhanced wishlist actions with backend integration
  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Please log in to manage your wishlist",
      });
      return false;
    }

    try {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      const result = await toggleWishlistItem(productId);

      if (result.data.action === "added") {
        // Refresh wishlist to get the full product data
        await loadWishlist();
      } else {
        dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
      }

      return result.data.isInWishlist;
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return false;
    }
  };

  // Legacy wishlist actions (for compatibility)
  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Please log in to add items to your wishlist",
      });
      return;
    }

    await handleToggleWishlist(product._id || product.id);
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Please log in to manage your wishlist",
      });
      return;
    }

    await handleToggleWishlist(productId);
  };

  const clearWishlist = () => {
    dispatch({ type: ACTIONS.CLEAR_WISHLIST });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return state.wishlist.some(
      (item) => item._id === productId || item.id === productId
    );
  };

  // User actions
  const setUser = (user) => {
    dispatch({ type: ACTIONS.SET_USER, payload: user });
  };

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
  };

  // Category actions
  const setCategories = (categories) => {
    dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
  };

  const addCategory = (category) => {
    dispatch({ type: ACTIONS.ADD_CATEGORY, payload: category });
  };

  // Error actions
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  // Computed values
  const cartItemsCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistItemsCount = state.wishlist.length;
  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    // State
    cart: state.cart,
    wishlist: state.wishlist,
    wishlistLoading: state.wishlistLoading,
    user: user,
    isAuthenticated: isAuthenticated,
    categories: state.categories,
    error: state.error,

    // Actions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlistItem: handleToggleWishlist,
    isInWishlist,
    loadWishlist,
    setUser,
    logout,
    setCategories,
    addCategory,
    clearError,

    // Computed values
    cartItemsCount,
    wishlistItemsCount,
    cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}

export default AppContext;
