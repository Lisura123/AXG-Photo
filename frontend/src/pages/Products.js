import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  InputGroup,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Heart, Eye, Star, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Add custom styles for product cards
  React.useEffect(() => {
    const styleId = "products-custom-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* Enhanced Professional Page Styling with No Margins/Padding */
        .products-hero-section {
          background: #ffffff;
          border-bottom: 1px solid rgba(64, 64, 64, 0.1);
          padding: 2rem 0;
          margin: 0;
          animation: fadeInDown 0.8s ease-out;
        }
        .products-title {
          color: #1d1d1b;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
          position: relative;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .products-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #404040, #1d1d1b);
          border-radius: 2px;
          animation: scaleIn 0.5s ease-out 0.8s both;
        }
        .products-subtitle {
          color: #404040;
          font-size: 1.2rem;
          font-weight: 400;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }
        
        /* Animation Keyframes */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateX(-50%) scaleX(0);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scaleX(1);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Section Animation Classes */
        .products-section-animate {
          animation: fadeInDown 0.8s ease-out;
        }
        
        /* Enhanced Search and Filter Section */
        .filters-section {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(64, 64, 64, 0.08);
          padding: 2rem;
          margin: 0 0 2rem 0;
          border: 1px solid rgba(64, 64, 64, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInFromLeft 0.6s ease-out 0.3s both;
        }
        .filters-section:hover {
          box-shadow: 0 8px 32px rgba(64, 64, 64, 0.12);
          transform: translateY(-2px);
        }
        .search-input {
          border: 2px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 12px !important;
          font-size: 1rem !important;
          padding: 0.75rem 1rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .search-input:focus {
          border-color: #404040 !important;
          box-shadow: 0 0 0 0.2rem rgba(64, 64, 64, 0.15) !important;
          transform: translateY(-1px) !important;
        }
        .search-icon {
          background: #ffffff !important;
          border: 2px solid rgba(64, 64, 64, 0.1) !important;
          border-right: none !important;
          border-radius: 12px 0 0 12px !important;
          color: #404040 !important;
        }
        
        /* Enhanced Form Controls */
        .professional-select {
          border: 2px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 12px !important;
          font-size: 1rem !important;
          padding: 0.75rem 1rem !important;
          color: #1d1d1b !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .professional-select:focus {
          border-color: #404040 !important;
          box-shadow: 0 0 0 0.2rem rgba(64, 64, 64, 0.15) !important;
          transform: translateY(-1px) !important;
        }
        
        /* Enhanced View Toggle Buttons */
        .view-toggle-btn {
          border: 2px solid #404040 !important;
          border-radius: 10px !important;
          padding: 0.75rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .view-toggle-btn.active {
          background: linear-gradient(135deg, #1d1d1b 0%, #404040 100%) !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(29, 29, 27, 0.2) !important;
        }
        .view-toggle-btn:not(.active) {
          background: #ffffff !important;
          color: #404040 !important;
        }
        .view-toggle-btn:not(.active):hover {
          background: rgba(64, 64, 64, 0.05) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 16px rgba(64, 64, 64, 0.15) !important;
        }
        
        /* Category Section Headers */
        .category-header {
          color: #1d1d1b !important;
          font-weight: 700 !important;
          font-size: 1.8rem !important;
          margin-bottom: 1.5rem !important;
          letter-spacing: -0.01em !important;
          position: relative !important;
          padding-bottom: 0.75rem !important;
          animation: slideInFromLeft 0.6s ease-out 0.2s both;
        }
        .category-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #404040, #1d1d1b);
          border-radius: 2px;
        }
        .category-divider {
          height: 2px;
          background: linear-gradient(90deg, #404040, transparent);
          border: none;
          margin: 2rem 0;
        }
        
        /* Enhanced Pagination */
        .custom-pagination {
          margin-top: 3rem !important;
          justify-content: center !important;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }
        .custom-pagination .page-link {
          color: #404040 !important;
          border: 2px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 10px !important;
          margin: 0 4px !important;
          padding: 0.75rem 1rem !important;
          font-weight: 600 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .custom-pagination .page-link:hover {
          color: #ffffff !important;
          background: linear-gradient(135deg, #404040 0%, #1d1d1b 100%) !important;
          border-color: #404040 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(64, 64, 64, 0.2) !important;
        }
        .custom-pagination .page-item.active .page-link {
          background: linear-gradient(135deg, #1d1d1b 0%, #404040 100%) !important;
          border-color: #1d1d1b !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(29, 29, 27, 0.2) !important;
        }
        
        /* Keep existing product card styles unchanged - Add animations */
        .product-card:hover .quick-actions {
          opacity: 1 !important;
        }
        .product-card .quick-actions {
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        /* Product Card Animation */
        .product-card-animate {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Enhanced No Results Message */
        .no-results-message {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(64, 64, 64, 0.08);
          padding: 3rem;
          text-align: center;
          color: #404040;
          font-size: 1.1rem;
          margin: 3rem 0;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get data and actions from AppContext
  const {
    categories,
    setCategories,
    isInWishlist,
    toggleWishlistItem,
    isAuthenticated,
    clearError,
  } = useApp();

  // eslint-disable-next-line no-unused-vars
  const [viewMode, setViewMode] = useState("grid");
  // eslint-disable-next-line no-unused-vars
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8070/api";

  const productsPerPage = 12;

  // Smooth scroll to top when page changes
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Enhanced page navigation with smooth scrolling
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(scrollToTop, 100); // Small delay for state update
  };

  // Get categories that match Navbar structure
  const getMainCategories = () => {
    return categories.filter((cat) =>
      [
        "batteries",
        "chargers",
        "card-readers",
        "lens-filters",
        "camera-backpacks",
      ].includes(cat.slug)
    );
  };

  // Get subcategories for Lens Filters
  const getLensFilterSubcategories = () => {
    return categories
      .filter((cat) => cat.slug.includes("mm-filters"))
      .sort((a, b) => parseInt(a.slug) - parseInt(b.slug));
  };

  // Get all lens filter products (from all subcategories)
  const getAllLensFilterProducts = (products) => {
    const lensFilterSubcategories = getLensFilterSubcategories();
    const lensFilterSubIds = lensFilterSubcategories.map((cat) => cat._id);

    return products.filter((product) =>
      lensFilterSubIds.includes(product.category?._id)
    );
  };

  // Category display options with icons matching Navbar structure
  const getCategoryOptions = () => {
    const options = [{ value: "all", label: "All Categories", icon: "🔍" }];

    // Add main categories matching Navbar structure
    getMainCategories().forEach((category) => {
      const icon = getCategoryIcon(category.slug);
      options.push({
        value: category.slug,
        label: category.name,
        icon: icon,
      });
    });

    // Add lens filter subcategories
    const lensFilterSubs = getLensFilterSubcategories();
    if (lensFilterSubs.length > 0) {
      lensFilterSubs.forEach((filterCategory) => {
        const icon = getCategoryIcon(filterCategory.slug);
        options.push({
          value: filterCategory.slug,
          label: filterCategory.name,
          icon: icon,
        });
      });
    }

    // Add other categories not in main structure
    const otherCategories = categories.filter(
      (cat) =>
        ![
          "batteries",
          "chargers",
          "card-readers",
          "lens-filters",
          "camera-backpacks",
        ].includes(cat.slug) && !cat.slug.includes("mm-filters")
    );

    otherCategories.forEach((category) => {
      const icon = getCategoryIcon(category.slug);
      options.push({
        value: category._id,
        label: category.name,
        icon: icon,
      });
    });

    return options;
  };

  // Helper function to get category icons
  const getCategoryIcon = (slug) => {
    const iconMap = {
      batteries: "🔋",
      chargers: "⚡",
      "card-readers": "💳",
      "lens-filters": "🔍",
      "camera-backpacks": "🎒",
      "58mm-filters": "🔍",
      "67mm-filters": "🔍",
      "77mm-filters": "🔍",
    };
    return iconMap[slug] || "📦";
  };

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "status", label: "Status" },
  ];

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory && filterCategory !== "all")
        params.append("category", filterCategory);
      params.append("sortBy", sortBy);
      params.append("limit", "50");

      const response = await fetch(`${API_BASE}/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setAlertMessage("Error fetching products");
        setAlertType("danger");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertMessage("Error fetching products");
      setAlertType("danger");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, sortBy, API_BASE]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [API_BASE, setCategories]);

  useEffect(() => {
    fetchProducts();
    // Only fetch categories if they haven't been loaded yet
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchProducts, fetchCategories, categories.length]);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      // Use the category slug directly instead of converting to ID
      setFilterCategory(categoryParam);
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [showAlert]);

  // Helper function to update URL parameters
  const updateURLParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // Handle category filter change
  const handleCategoryChange = (categorySlug) => {
    setFilterCategory(categorySlug);
    updateURLParams({
      category: categorySlug === "all" ? undefined : categorySlug,
    });
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    updateURLParams({
      search: term,
    });
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      showAlertMessage("Please log in to manage your wishlist", "warning");
      return;
    }

    try {
      clearError();
      const wasInWishlist = isInWishlist(productId);
      const isNowInWishlist = await toggleWishlistItem(productId);

      if (isNowInWishlist && !wasInWishlist) {
        showAlertMessage("Added to wishlist", "success");
      } else if (!isNowInWishlist && wasInWishlist) {
        showAlertMessage("Removed from wishlist", "info");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showAlertMessage(
        "Failed to update wishlist. Please try again.",
        "danger"
      );
    }
  };

  const handleViewToBuy = (product) => {
    showAlertMessage(
      `To purchase ${product.name}, please contact our sales team at sales@axg.com or call (555) 123-4567 for more information and pricing.`,
      "info"
    );
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Since backend already filters by category and search, we only need to sort here
  const filteredProducts = products.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      default:
        return (a.name || "").localeCompare(b.name || "");
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const renderStars = (rating = 0) => {
    const validRating = rating || 0;
    return Array(5)
      .fill()
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < Math.floor(validRating) ? "#ffc107" : "none"}
          color="#ffc107"
        />
      ));
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "76px" }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#1d1d1b" }} />
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "0", backgroundColor: "#ffffff" }}>
      {/* Alert Messages */}
      {showAlert && (
        <Alert
          variant={alertType}
          dismissible
          onClose={() => setShowAlert(false)}
          className="position-fixed"
          style={{
            top: "80px",
            right: "20px",
            zIndex: 1050,
            width: "300px",
          }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Enhanced Modern "Our Products" Hero Section */}
      <div
        className="modern-products-hero-section products-section-animate"
        style={{
          margin: "0", // Remove margin to align under navbar
          background:
            "linear-gradient(135deg, #404040 0%, #555555 50%, #404040 100%)",
          color: "#ffffff",
          padding: "4rem 0",
          borderBottom: "3px solid #1d1d1b",
          boxShadow:
            "0 12px 40px rgba(64, 64, 64, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(29, 29, 27, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "float 20s ease-in-out infinite",
            opacity: "0.3",
          }}
        />
        <Container fluid className="px-4 position-relative">
          <div className="text-center">
            <h1
              className="display-3 products-title fw-bold"
              style={{
                color: "#ffffff",
                marginBottom: "1.5rem",
                textShadow: "2px 2px 8px rgba(29, 29, 27, 0.5)",
                letterSpacing: "1px",
              }}
            >
              Our Products
            </h1>
            <p
              className="products-subtitle fw-medium"
              style={{
                color: "#ffffff",
                opacity: "0.95",
                maxWidth: "800px",
                margin: "0 auto",
                fontSize: "1.4rem",
                lineHeight: "1.6",
                textShadow: "1px 1px 4px rgba(29, 29, 27, 0.3)",
              }}
            >
              Discover our carefully curated collection of premium photography
              accessories, batteries, and professional gear designed to enhance
              your creative workflow and elevate your photography experience.
            </p>
            {/* Enhanced Decorative Line */}
            <div
              style={{
                width: "120px",
                height: "5px",
                background:
                  "linear-gradient(135deg, #1d1d1b, #ffffff, #1d1d1b)",
                margin: "2.5rem auto 0",
                borderRadius: "3px",
                boxShadow: "0 2px 8px rgba(29, 29, 27, 0.4)",
                animation: "pulse 2s ease-in-out infinite alternate",
              }}
            />
            {/* Professional Badge */}
            <div
              className="professional-badge"
              style={{
                display: "inline-block",
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                background: "rgba(29, 29, 27, 0.8)",
                color: "#ffffff",
                borderRadius: "25px",
                fontSize: "0.9rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(29, 29, 27, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px) scale(1.05)";
                e.target.style.boxShadow = "0 8px 25px rgba(29, 29, 27, 0.5)";
                e.target.style.background = "rgba(29, 29, 27, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(29, 29, 27, 0.3)";
                e.target.style.background = "rgba(29, 29, 27, 0.8)";
              }}
            >
              Professional Quality Guaranteed
            </div>
          </div>
        </Container>
      </div>

      <Container
        className="pb-4"
        style={{ marginTop: "3rem", paddingTop: "0" }}
      >
        {/* Modern Enhanced Search and Filters */}
        <div
          className="modern-filters-section"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            marginTop: "0",
            boxShadow: "0 8px 32px rgba(64, 64, 64, 0.15)",
            border: "2px solid #404040",
          }}
        >
          <Row className="align-items-end">
            <Col lg={6} className="mb-3 mb-lg-0">
              <label
                htmlFor="product-search"
                className="form-label fw-semibold"
                style={{
                  color: "#1d1d1b",
                  marginBottom: "0.75rem",
                  fontSize: "1.1rem",
                }}
              >
                Search Products
              </label>
              <InputGroup size="lg">
                <InputGroup.Text
                  className="search-icon"
                  style={{
                    backgroundColor: "#404040",
                    borderColor: "#404040",
                    color: "#ffffff",
                    borderRadius: "12px 0 0 12px",
                    border: "2px solid #404040",
                    borderRight: "none",
                  }}
                >
                  <Search size={20} />
                </InputGroup.Text>
                <Form.Control
                  id="product-search"
                  type="text"
                  placeholder="Search by name, category, or brand..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    // Debounce URL update for search
                    setTimeout(() => {
                      if (value === e.target.value) {
                        handleSearchChange(value);
                      }
                    }, 500);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchChange(e.target.value);
                    }
                  }}
                  className="modern-search-input"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#404040",
                    color: "#1d1d1b",
                    borderRadius: "0 12px 12px 0",
                    fontSize: "1rem",
                    padding: "0.75rem 1rem",
                    transition: "all 0.3s ease",
                    border: "2px solid #404040",
                    borderLeft: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(64, 64, 64, 0.2)";
                    e.target.style.borderColor = "#404040";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                  }}
                />
              </InputGroup>
            </Col>
            <Col lg={6}>
              <Row className="g-3">
                <Col sm={6}>
                  <label
                    className="form-label fw-semibold"
                    style={{
                      color: "#1d1d1b",
                      marginBottom: "0.75rem",
                      display: "block",
                      fontSize: "1.1rem",
                    }}
                  >
                    Category
                  </label>
                  <Form.Select
                    value={filterCategory}
                    onChange={(e) => {
                      handleCategoryChange(e.target.value);
                      setCurrentPage(1); // Reset to first page when filtering
                    }}
                    size="lg"
                    className="enhanced-category-select"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#404040",
                      color: "#1d1d1b",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "2px solid #404040",
                      boxShadow: "0 2px 8px rgba(64, 64, 64, 0.1)",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(64, 64, 64, 0.2), 0 4px 12px rgba(64, 64, 64, 0.15)";
                      e.target.style.borderColor = "#1d1d1b";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(64, 64, 64, 0.1)";
                      e.target.style.borderColor = "#404040";
                      e.target.style.transform = "translateY(0)";
                    }}
                    onMouseEnter={(e) => {
                      if (e.target !== document.activeElement) {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(64, 64, 64, 0.15)";
                        e.target.style.borderColor = "#1d1d1b";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.target !== document.activeElement) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 2px 8px rgba(64, 64, 64, 0.1)";
                        e.target.style.borderColor = "#404040";
                      }
                    }}
                  >
                    <option
                      value="all"
                      style={{
                        padding: "8px",
                        backgroundColor: "#ffffff",
                        fontWeight: "500",
                        color: "#1d1d1b",
                      }}
                    >
                      🔍 All Categories
                    </option>

                    {/* Main Categories matching Navbar structure */}
                    <optgroup
                      label="Main Categories"
                      style={{
                        backgroundColor: "#f8f9fa",
                        fontWeight: "600",
                        color: "#404040",
                      }}
                    >
                      {getMainCategories().map((category) => (
                        <option
                          key={category._id}
                          value={category.slug}
                          style={{
                            padding: "8px",
                            backgroundColor: "#ffffff",
                            fontWeight: "400",
                            color: "#404040",
                            fontSize: "1rem",
                          }}
                        >
                          {getCategoryIcon(category.slug)} {category.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Lens Filter Subcategories */}
                    {getLensFilterSubcategories().length > 0 && (
                      <optgroup
                        label="Lens Filter Sizes"
                        style={{
                          backgroundColor: "#f8f9fa",
                          fontWeight: "600",
                          color: "#404040",
                        }}
                      >
                        {getLensFilterSubcategories().map((filterCategory) => (
                          <option
                            key={filterCategory._id}
                            value={filterCategory.slug}
                            style={{
                              padding: "8px",
                              backgroundColor: "#ffffff",
                              fontWeight: "400",
                              color: "#404040",
                              fontSize: "1rem",
                            }}
                          >
                            {getCategoryIcon(filterCategory.slug)}{" "}
                            {filterCategory.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Other categories not in main structure */}
                    {categories.filter(
                      (cat) =>
                        ![
                          "batteries",
                          "chargers",
                          "card-readers",
                          "lens-filters",
                          "camera-backpacks",
                        ].includes(cat.slug) && !cat.slug.includes("mm-filters")
                    ).length > 0 && (
                      <optgroup
                        label="Other Categories"
                        style={{
                          backgroundColor: "#f8f9fa",
                          fontWeight: "600",
                          color: "#404040",
                        }}
                      >
                        {categories
                          .filter(
                            (cat) =>
                              ![
                                "batteries",
                                "chargers",
                                "card-readers",
                                "lens-filters",
                                "camera-backpacks",
                              ].includes(cat.slug) &&
                              !cat.slug.includes("mm-filters")
                          )
                          .map((category) => (
                            <option
                              key={category._id}
                              value={category.slug}
                              style={{
                                padding: "8px",
                                backgroundColor: "#ffffff",
                                fontWeight: "400",
                                color: "#404040",
                                fontSize: "1rem",
                              }}
                            >
                              {getCategoryIcon(category.slug)} {category.name}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <label
                    className="form-label fw-semibold"
                    style={{
                      color: "#1d1d1b",
                      marginBottom: "0.75rem",
                      display: "block",
                      fontSize: "1.1rem",
                    }}
                  >
                    Sort By
                  </label>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="lg"
                    className="modern-select"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#404040",
                      color: "#1d1d1b",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                      border: "2px solid #404040",
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(64, 64, 64, 0.2)";
                      e.target.style.borderColor = "#404040";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(64, 64, 64, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      if (e.target !== document.activeElement) {
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {sortOptions
                      .filter((option) => !option.value.includes("price"))
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Professional Results Summary */}
        <div
          className="results-summary-section"
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            padding: "1.5rem 2rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid rgba(64, 64, 64, 0.1)",
            boxShadow: "0 2px 8px rgba(64, 64, 64, 0.05)",
          }}
        >
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center gap-3">
                <div>
                  <h5
                    className="mb-1"
                    style={{ color: "#1d1d1b", fontWeight: "600" }}
                  >
                    {filteredProducts.length === 0
                      ? "No Products Found"
                      : `${filteredProducts.length} Product${
                          filteredProducts.length !== 1 ? "s" : ""
                        } Found`}
                  </h5>
                  <p
                    className="mb-0"
                    style={{ color: "#404040", fontSize: "0.9rem" }}
                  >
                    {filterCategory === "all"
                      ? "Showing all categories"
                      : `Filtered by: ${
                          getCategoryOptions().find(
                            (cat) => cat.value === filterCategory
                          )?.label || filterCategory
                        }`}
                    {searchTerm && ` • Search: "${searchTerm}"`}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-2 mt-md-0">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <span
                  style={{
                    color: "#404040",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>
                {(filterCategory !== "all" || searchTerm) && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setFilterCategory("all");
                      setSearchTerm("");
                      setCurrentPage(1);
                      // Clear URL parameters
                      setSearchParams(new URLSearchParams());
                    }}
                    style={{
                      borderColor: "#404040",
                      color: "#404040",
                      fontSize: "0.8rem",
                      padding: "0.25rem 0.75rem",
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Products by Category */}
        {currentProducts.length === 0 ? (
          <div className="no-results-message">
            <div className="mb-3">
              <Search size={48} style={{ color: "#404040", opacity: 0.5 }} />
            </div>
            <h4 style={{ color: "#1d1d1b", marginBottom: "1rem" }}>
              No Products Found
            </h4>
            <p style={{ color: "#404040", marginBottom: "0" }}>
              No products found matching your search criteria. Try adjusting
              your filters or search terms to find what you're looking for.
            </p>
          </div>
        ) : filterCategory === "all" ? (
          // Group products by main category, with special handling for lens filters
          (() => {
            const mainCategories = getMainCategories();
            const sectionsToShow = [];

            // Process main categories
            mainCategories.forEach((category) => {
              if (category.slug === "lens-filters") {
                // Special handling for lens filters - show all subcategory products together
                const lensFilterProducts =
                  getAllLensFilterProducts(currentProducts);
                if (lensFilterProducts.length > 0) {
                  sectionsToShow.push({
                    key: "lens-filters-all",
                    label: "Lens Filters",
                    icon: "🔍",
                    products: lensFilterProducts,
                  });
                }
              } else {
                // Regular category handling
                const categoryProducts = currentProducts.filter(
                  (product) => product.category?._id === category._id
                );
                if (categoryProducts.length > 0) {
                  sectionsToShow.push({
                    key: category._id,
                    label: category.name,
                    icon: getCategoryIcon(category.slug),
                    products: categoryProducts,
                  });
                }
              }
            });

            // Add other categories (not in main structure)
            const otherCategories = categories.filter(
              (cat) =>
                ![
                  "batteries",
                  "chargers",
                  "card-readers",
                  "lens-filters",
                  "camera-backpacks",
                ].includes(cat.slug) && !cat.slug.includes("mm-filters")
            );

            otherCategories.forEach((category) => {
              const categoryProducts = currentProducts.filter(
                (product) => product.category?._id === category._id
              );
              if (categoryProducts.length > 0) {
                sectionsToShow.push({
                  key: category._id,
                  label: category.name,
                  icon: getCategoryIcon(category.slug),
                  products: categoryProducts,
                });
              }
            });

            return sectionsToShow.map((section) => {
              if (section.products.length === 0) return null;

              return (
                <div key={section.key} className="mb-5">
                  {/* Enhanced Category Header */}
                  <div className="d-flex align-items-center mb-4">
                    <h3 className="category-header mb-0 me-4">
                      {section.icon} {section.label}
                    </h3>
                    <hr className="category-divider flex-fill" />
                    <span
                      className="ms-4 px-4 py-2 rounded-pill"
                      style={{
                        background: "linear-gradient(135deg, #404040, #1d1d1b)",
                        color: "#ffffff",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        letterSpacing: "-0.01em",
                        boxShadow: "0 4px 12px rgba(64, 64, 64, 0.2)",
                      }}
                    >
                      {section.products.length}{" "}
                      {section.products.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Category Products */}
                  <Row className={viewMode === "grid" ? "g-4" : "g-3"}>
                    {section.products.map((product, index) => (
                      <Col
                        key={product._id}
                        xs={12}
                        sm={viewMode === "grid" ? 6 : 12}
                        md={viewMode === "grid" ? 4 : 12}
                        lg={viewMode === "grid" ? 4 : 12}
                        xl={viewMode === "grid" ? 3 : 12}
                        className="product-card-animate"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${
                            (index % 12) * 0.1
                          }s both`,
                        }}
                      >
                        {/* Product Card Content */}
                        <Card
                          className="h-100 product-card"
                          style={{
                            border: "1px solid #f0f0f0",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                            transition: "all 0.3s ease",
                            backgroundColor: "#ffffff",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 25px rgba(29, 29, 27, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(0, 0, 0, 0.08)";
                          }}
                        >
                          {/* Product Card JSX will be inserted here */}
                          <div className="position-relative">
                            <Card.Img
                              variant="top"
                              src={
                                product.image
                                  ? `http://localhost:8070${product.image}`
                                  : "/api/placeholder/300/200"
                              }
                              alt={product.name}
                              style={{
                                height: viewMode === "grid" ? "200px" : "180px",
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                borderRadius: "12px 12px 0 0",
                                backgroundColor: "#f8f9fa",
                                padding: "10px",
                              }}
                              className="product-image"
                            />

                            {/* Badges */}
                            <div className="position-absolute top-0 start-0 p-2">
                              {product.isNew && (
                                <Badge bg="success" className="me-1">
                                  New
                                </Badge>
                              )}
                              {product.isFeatured && (
                                <Badge bg="info" className="me-1">
                                  Featured
                                </Badge>
                              )}
                              <Badge
                                bg={
                                  product.status === "Active"
                                    ? "success"
                                    : product.status === "Out of Stock"
                                    ? "warning"
                                    : "secondary"
                                }
                                className="me-1"
                              >
                                {product.status}
                              </Badge>
                            </div>

                            {/* Wishlist Button */}
                            <Button
                              variant="light"
                              size="sm"
                              className="position-absolute top-0 end-0 m-2 wishlist-btn"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#ffffff",
                                border: "1px solid #f0f0f0",
                                opacity: isInWishlist(product._id) ? 1 : 0.8,
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => handleAddToWishlist(product._id)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#404040";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#ffffff";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Heart
                                size={16}
                                fill={
                                  isInWishlist(product._id) ? "#dc3545" : "none"
                                }
                                color={
                                  isInWishlist(product._id)
                                    ? "#dc3545"
                                    : "#404040"
                                }
                              />
                            </Button>

                            {/* Quick Actions (visible on hover) */}
                            <div
                              className="position-absolute bottom-0 start-0 end-0 p-2 quick-actions"
                              style={{
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                              }}
                            >
                              <Row className="g-1">
                                <Col>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    className="w-100"
                                    style={{
                                      backgroundColor: "#ffffff",
                                      borderColor: "#404040",
                                      color: "#404040",
                                    }}
                                    onClick={() =>
                                      handleViewDetails(product._id)
                                    }
                                  >
                                    <Eye size={14} />
                                  </Button>
                                </Col>
                                <Col>
                                  <Button
                                    variant="dark"
                                    size="sm"
                                    className="w-100"
                                    style={{
                                      backgroundColor: "#1d1d1b",
                                      borderColor: "#1d1d1b",
                                      color: "#ffffff",
                                    }}
                                    onClick={() => handleViewToBuy(product)}
                                  >
                                    <Eye size={14} />
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <Card.Body
                            className={
                              viewMode === "list"
                                ? "d-flex align-items-center"
                                : ""
                            }
                          >
                            <div
                              className={
                                viewMode === "list" ? "flex-grow-1" : ""
                              }
                            >
                              <Card.Title
                                className="h6 mb-2"
                                style={{ color: "#1d1d1b" }}
                              >
                                {product.name}
                              </Card.Title>

                              {/* Category and Features */}
                              <div className="d-flex align-items-center mb-2">
                                <div className="me-2">
                                  <Badge bg="secondary" className="me-2">
                                    {product.category?.name || "Uncategorized"}
                                  </Badge>
                                  {product.brand && (
                                    <small className="text-muted">
                                      by {product.brand}
                                    </small>
                                  )}
                                </div>
                              </div>
                              {product.features &&
                                product.features.length > 0 && (
                                  <small className="text-muted">
                                    {product.features.slice(0, 2).join(" • ")}
                                    {product.features.length > 2 && "..."}
                                  </small>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className={viewMode === "list" ? "ms-3" : ""}>
                              <Row className="g-2">
                                <Col xs={viewMode === "list" ? 12 : 6}>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="w-100"
                                    style={{
                                      borderColor: "#404040",
                                      color: "#404040",
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() =>
                                      handleViewDetails(product._id)
                                    }
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#404040";
                                      e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "transparent";
                                      e.currentTarget.style.color = "#404040";
                                    }}
                                  >
                                    <Eye size={14} className="me-1" />
                                    View
                                  </Button>
                                </Col>
                                <Col xs={viewMode === "list" ? 12 : 6}>
                                  <Button
                                    variant="dark"
                                    size="sm"
                                    className="w-100"
                                    style={{
                                      backgroundColor: cart.includes(
                                        product._id
                                      )
                                        ? "#28a745"
                                        : "#1d1d1b",
                                      borderColor: cart.includes(product._id)
                                        ? "#28a745"
                                        : "#1d1d1b",
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleViewToBuy(product)}
                                  >
                                    <Eye size={14} className="me-1" />
                                    View to Buy
                                  </Button>
                                </Col>
                              </Row>
                              {viewMode === "list" && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="w-100 mt-2"
                                  style={{
                                    backgroundColor: "#1d1d1b",
                                    borderColor: "#1d1d1b",
                                    transition: "all 0.3s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#404040";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#1d1d1b";
                                  }}
                                >
                                  Buy Now
                                </Button>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              );
            });
          })()
        ) : (
          // Regular grid when filtering by specific category
          <Row className={viewMode === "grid" ? "g-4" : "g-3"}>
            {currentProducts.map((product, index) => (
              <Col
                key={product.id}
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "grid" ? 4 : 12}
                lg={viewMode === "grid" ? 4 : 12}
                xl={viewMode === "grid" ? 3 : 12}
                className="product-card-animate"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${
                    (index % 12) * 0.1
                  }s both`,
                }}
              >
                <Card
                  className="h-100 product-card"
                  style={{
                    border: "1px solid #f0f0f0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    backgroundColor: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(29, 29, 27, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        product.image
                          ? `http://localhost:8070${product.image}`
                          : "/placeholder-image.jpg"
                      }
                      style={{
                        height: viewMode === "grid" ? "200px" : "180px",
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                        borderRadius: "12px 12px 0 0",
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                      }}
                      className="product-image"
                    />

                    {/* Badges */}
                    <div className="position-absolute top-0 start-0 p-2">
                      {product.isNew && (
                        <Badge bg="success" className="me-1">
                          New
                        </Badge>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2 wishlist-btn"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #f0f0f0",
                        opacity: isInWishlist(product._id || product.id)
                          ? 1
                          : 0.8,
                        transition: "all 0.2s ease",
                      }}
                      onClick={() =>
                        handleAddToWishlist(product._id || product.id)
                      }
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#404040";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Heart
                        size={16}
                        fill={
                          isInWishlist(product._id || product.id)
                            ? "#dc3545"
                            : "none"
                        }
                        color={
                          isInWishlist(product._id || product.id)
                            ? "#dc3545"
                            : "#404040"
                        }
                      />
                    </Button>

                    {/* Quick Actions (visible on hover) */}
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-2 quick-actions"
                      style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                    >
                      <Row className="g-1">
                        <Col>
                          <Button
                            variant="light"
                            size="sm"
                            className="w-100"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#404040",
                              color: "#404040",
                            }}
                            onClick={() => handleViewDetails(product.id)}
                          >
                            <Eye size={14} />
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="dark"
                            size="sm"
                            className="w-100"
                            style={{
                              backgroundColor: "#1d1d1b",
                              borderColor: "#1d1d1b",
                              color: "#ffffff",
                            }}
                            onClick={() => handleViewToBuy(product)}
                          >
                            <Eye size={14} />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <Card.Body
                    className={
                      viewMode === "list" ? "d-flex align-items-center" : ""
                    }
                  >
                    <div className={viewMode === "list" ? "flex-grow-1" : ""}>
                      <Card.Title
                        className="h6 mb-2"
                        style={{ color: "#1d1d1b" }}
                      >
                        {product.name}
                      </Card.Title>

                      {/* Rating */}
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-2">
                          {renderStars(product.rating)}
                        </div>
                        <small className="text-muted">
                          {product.rating || 0} ({product.reviews || 0} reviews)
                        </small>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={viewMode === "list" ? "ms-3" : ""}>
                      <Row className="g-2">
                        <Col xs={viewMode === "list" ? 12 : 6}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="w-100"
                            style={{
                              borderColor: "#404040",
                              color: "#404040",
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => handleViewDetails(product.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#404040";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#404040";
                            }}
                          >
                            <Eye size={14} className="me-1" />
                            View
                          </Button>
                        </Col>
                        <Col xs={viewMode === "list" ? 12 : 6}>
                          <Button
                            variant="dark"
                            size="sm"
                            className="w-100"
                            style={{
                              backgroundColor: cart.includes(product.id)
                                ? "#28a745"
                                : "#1d1d1b",
                              borderColor: cart.includes(product.id)
                                ? "#28a745"
                                : "#1d1d1b",
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => handleViewToBuy(product)}
                          >
                            <Eye size={14} className="me-1" />
                            View to Buy
                          </Button>
                        </Col>
                      </Row>
                      {viewMode === "list" && (
                        <Button
                          variant="success"
                          size="sm"
                          className="w-100 mt-2"
                          style={{
                            backgroundColor: "#1d1d1b",
                            borderColor: "#1d1d1b",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#404040";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#1d1d1b";
                          }}
                        >
                          Buy Now
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Enhanced Pagination with Smooth Navigation */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination className="custom-pagination">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  color: currentPage === 1 ? "#6c757d" : "#404040",
                  borderColor: "#e9ecef",
                }}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    style={{
                      backgroundColor:
                        page === currentPage ? "#1d1d1b" : "transparent",
                      borderColor: "#e9ecef",
                      color: page === currentPage ? "#ffffff" : "#404040",
                    }}
                  >
                    {page}
                  </Pagination.Item>
                )
              )}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  color: currentPage === totalPages ? "#6c757d" : "#404040",
                  borderColor: "#e9ecef",
                }}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;
