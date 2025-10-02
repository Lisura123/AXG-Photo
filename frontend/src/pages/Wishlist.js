import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  Heart,
  Trash2,
  ArrowLeft,
  Eye,
  Star,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const {
    wishlist,
    wishlistLoading,
    toggleWishlistItem,
    loadWishlist,
    error,
    clearError,
    isAuthenticated,
  } = useApp();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [refreshing, setRefreshing] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { message: "Please log in to view your wishlist" },
      });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Manual refresh function for users
  const handleRefresh = async () => {
    if (!isAuthenticated) {
      showAlertMessage("Please log in to view your wishlist", "warning");
      return;
    }

    try {
      setRefreshing(true);
      clearError();
      await loadWishlist();
      showAlertMessage("Wishlist refreshed", "success");
    } catch (error) {
      showAlertMessage("Error refreshing wishlist", "danger");
    } finally {
      setRefreshing(false);
    }
  };

  // Helper function to get image URL with cache busting
  const getImageUrl = (product) => {
    // Try both image field names (image and imageUrl for compatibility)
    const imagePath = product?.image || product?.imageUrl;

    if (!imagePath) {
      // Return a proper placeholder data URL instead of a file path
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xNjAgMjAwQzE2MCAyMTEuMDQ2IDE2OS41NDEgMjIwIDIwMCAyMjBDMjMwLjQ1OSAyMjAgMjQwIDIxMS4wNDYgMjQwIDIwMEMyNDAgMTg4Ljk1NCAyMzAuNDU5IDE4MCAyMDAgMTgwQzE2OS41NDEgMTgwIDE2MCAxODguOTU0IDE2MCAyMDBaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xMjAgMjgwQzEyMCAyOTEuMDQ2IDEyOS41NDEgMzAwIDI4MCAzMDBIMzIwQzMzMC40NTkgMzAwIDM0MCAyOTEuMDQ2IDM0MCAyODBWMTIwQzM0MCAxMDguOTU0IDMzMC40NTkgMTAwIDMyMCAxMDBIMjgwQzEyOS41NDEgMTAwIDEyMCAxMDguOTU0IDEyMCAxMjBWMjgwWiIgZmlsbD0iI0RERERERCIvPgo8cGF0aCBkPSJNMTQwIDI2MEMxNDAgMjY1LjUyMyAxNDQuNDc3IDI3MCAxNTAgMjcwSDE3MEM4NS41MjMgMjcwIDE4MCAyNjUuNTIzIDE4MCAyNjBWMTQwQzE4MCAxMzQuNDc3IDE3NS41MjMgMTMwIDE3MCAxMzBIMTUwQzE0NC40NzcgMTMwIDE0MCAxMzQuNDc3IDE0MCAxNDBWMjYwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4=";
    }

    if (imagePath.startsWith("http")) return imagePath;

    // Add cache-busting parameter to force fresh image loads
    const timestamp = new Date().getTime();
    return `http://localhost:8070${
      imagePath.startsWith("/") ? "" : "/"
    }${imagePath}?t=${timestamp}`;
  };

  // Show error message if present
  useEffect(() => {
    if (error) {
      showAlertMessage(error, "danger");
      clearError();
    }
  }, [error, clearError]);

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      showAlertMessage("Please log in to manage your wishlist", "warning");
      return;
    }

    const product = wishlist.find(
      (item) => (item._id || item.id) === productId
    );
    const itemName = product?.name || "Product";

    try {
      await toggleWishlistItem(productId);
      showAlertMessage(`${itemName} removed from wishlist`, "warning");
    } catch (error) {
      showAlertMessage("Failed to remove item from wishlist", "danger");
    }
  };

  const clearAllWishlist = async () => {
    if (!isAuthenticated) {
      showAlertMessage("Please log in to manage your wishlist", "warning");
      return;
    }

    if (wishlist.length === 0) return;

    try {
      // Remove each item individually
      const removePromises = wishlist.map((item) =>
        toggleWishlistItem(item._id || item.id)
      );

      await Promise.all(removePromises);
      showAlertMessage(`All items cleared from wishlist!`, "success");
    } catch (error) {
      showAlertMessage("Failed to clear wishlist", "danger");
    }
  };

  const handleViewToBuy = (product) => {
    showAlertMessage(
      `To purchase ${product.name}, please contact our sales team at sales@axg.com or call (555) 123-4567 for more information and pricing.`,
      "info"
    );
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < Math.floor(rating) ? "#ffc107" : "none"}
          color="#ffc107"
        />
      ));
  };

  if (wishlistLoading && !refreshing) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "76px" }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#1d1d1b" }} />
          <p className="mt-3 text-muted">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlistLoading && wishlist.length === 0) {
    return (
      <div
        style={{ paddingTop: "76px", backgroundColor: "#ffffff" }}
        className="min-vh-100"
      >
        <Container className="py-5">
          <div className="text-center py-5">
            <div
              className="mb-4 mx-auto"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(64, 64, 64, 0.1)",
              }}
            >
              <Heart size={60} style={{ color: "#404040", opacity: 0.6 }} />
            </div>
            <h1
              className="display-5 fw-bold mb-4"
              style={{
                color: "#1d1d1b",
                letterSpacing: "-0.02em",
              }}
            >
              Your Wishlist is Empty
            </h1>
            <p
              className="lead mb-5"
              style={{
                color: "#404040",
                maxWidth: "500px",
                margin: "0 auto 2rem",
                lineHeight: "1.6",
              }}
            >
              Start building your collection of favorite items. Save products
              you love for easy access and future shopping.
            </p>
            <Button
              as={Link}
              to="/products"
              size="lg"
              className="d-inline-flex align-items-center gap-3"
              style={{
                backgroundColor: "#404040",
                borderColor: "#404040",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1d1d1b";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(29, 29, 27, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#404040";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <ArrowLeft size={20} />
              Start Shopping
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{ paddingTop: "76px", backgroundColor: "#ffffff" }}
      className="min-vh-100"
    >
      {/* Enhanced CSS Styles */}
      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        .wishlist-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: 1px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          background: #ffffff !important;
        }
        .wishlist-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 40px rgba(64, 64, 64, 0.15) !important;
          border-color: rgba(64, 64, 64, 0.2) !important;
        }
        .wishlist-image-container {
          overflow: hidden;
          border-radius: 16px 16px 0 0;
          position: relative;
          height: 180px;
          background: #fafafa;
        }
        .wishlist-image {
          width: 100%;
          height: 100%;
          object-fit: contain !important;
          padding: 8px;
          transition: transform 0.4s ease;
        }
        .wishlist-card:hover .wishlist-image {
          transform: scale(1.05);
        }
        .wishlist-badge {
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .wishlist-remove-btn {
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          transition: all 0.3s ease;
        }
        .wishlist-remove-btn:hover {
          transform: scale(1.1);
          border-color: #dc3545 !important;
          background-color: rgba(220, 53, 69, 0.1) !important;
        }
        .wishlist-action-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px !important;
          font-weight: 600;
          font-size: 0.8rem;
          padding: 8px 12px;
        }
        .wishlist-action-btn:hover {
          transform: translateY(-2px);
        }
        .wishlist-primary-btn {
          background-color: #404040 !important;
          border-color: #404040 !important;
          color: #ffffff !important;
        }
        .wishlist-primary-btn:hover {
          background-color: #1d1d1b !important;
          border-color: #1d1d1b !important;
          box-shadow: 0 8px 20px rgba(29, 29, 27, 0.2);
        }
        .wishlist-secondary-btn {
          background-color: transparent !important;
          border: 2px solid #404040 !important;
          color: #404040 !important;
        }
        .wishlist-secondary-btn:hover {
          background-color: #404040 !important;
          color: #ffffff !important;
          box-shadow: 0 6px 16px rgba(64, 64, 64, 0.2);
        }
        .wishlist-price {
          color: #1d1d1b !important;
          font-weight: 700 !important;
          font-size: 1.1rem !important;
        }
        .wishlist-title {
          color: #1d1d1b !important;
          font-weight: 700 !important;
          line-height: 1.3;
          margin-bottom: 8px !important;
          font-size: 0.95rem !important;
        }
        .wishlist-rating {
          margin-bottom: 8px;
        }
        .stock-badge {
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
        }
        .page-header {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(64, 64, 64, 0.1);
        }
        `}
      </style>
      <Container className="py-5">
        {/* Alert Messages */}
        {showAlert && (
          <Alert
            variant={alertType}
            dismissible
            onClose={() => setShowAlert(false)}
            className="position-fixed"
            style={{
              top: "100px",
              right: "20px",
              zIndex: 1050,
              width: "300px",
            }}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Header */}
        <Row className="page-header align-items-center">
          <Col>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <Heart
                  size={32}
                  className="me-3"
                  style={{ color: "#404040" }}
                  fill="#404040"
                />
                <h1
                  className="display-6 fw-bold mb-0"
                  style={{
                    color: "#1d1d1b",
                    letterSpacing: "-0.02em",
                  }}
                >
                  My Wishlist
                </h1>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="d-flex align-items-center"
                title="Refresh wishlist"
              >
                <RotateCcw size={16} className={refreshing ? "spin" : ""} />
                {refreshing && <span className="ms-1">Refreshing...</span>}
              </Button>
            </div>
            <p
              className="mb-0"
              style={{
                color: "#404040",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
              for later
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-3">
              {wishlist.filter((item) => item.inStock).length > 0 && (
                <Button
                  onClick={clearAllWishlist}
                  className="d-flex align-items-center gap-2 wishlist-action-btn wishlist-primary-btn"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontWeight: "600",
                  }}
                >
                  <Trash2 size={18} />
                  Clear Wishlist
                </Button>
              )}
              <Button
                as={Link}
                to="/products"
                className="d-flex align-items-center gap-2 wishlist-action-btn wishlist-secondary-btn"
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>

        {/* Wishlist Items */}
        <Row className="g-4">
          {wishlist.map((item) => (
            <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 wishlist-card">
                <div className="wishlist-image-container">
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="wishlist-image"
                  />

                  {/* Remove from Wishlist */}
                  <Button
                    size="sm"
                    className="wishlist-remove-btn position-absolute top-0 end-0 m-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <Heart size={18} fill="#dc3545" color="#dc3545" />
                  </Button>
                </div>

                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="wishlist-title">
                    {item.name}
                  </Card.Title>

                  {/* Rating */}
                  <div className="wishlist-rating d-flex align-items-center">
                    <div className="me-2">{renderStars(item.rating)}</div>
                    <small
                      style={{
                        color: "#404040",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      {item.rating} ({item.reviews} reviews)
                    </small>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-2">
                    <Badge
                      className="stock-badge"
                      style={{
                        backgroundColor: item.inStock ? "#28a745" : "#6c757d",
                        color: "#ffffff",
                      }}
                    >
                      {item.inStock ? "✓ In Stock" : "⚠ Out of Stock"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      {/* Primary Action Button */}
                      <Button
                        onClick={() => handleViewToBuy(item)}
                        disabled={!item.inStock}
                        className={`w-100 d-flex align-items-center justify-content-center gap-2 wishlist-action-btn ${
                          item.inStock ? "wishlist-primary-btn" : ""
                        }`}
                        style={{
                          backgroundColor: item.inStock ? "#404040" : "#6c757d",
                          borderColor: item.inStock ? "#404040" : "#6c757d",
                          color: "#ffffff",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          cursor: item.inStock ? "pointer" : "not-allowed",
                        }}
                      >
                        <Eye size={16} />
                        {item.inStock ? "View to Buy" : "Out of Stock"}
                      </Button>

                      {/* Secondary Action Buttons */}
                      <div className="d-flex gap-2">
                        <Button
                          as={Link}
                          to={`/product/${item.id}`}
                          className="flex-fill d-flex align-items-center justify-content-center gap-2 wishlist-action-btn wishlist-secondary-btn"
                        >
                          <Eye size={14} />
                          View Details
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(item._id)}
                          className="flex-fill d-flex align-items-center justify-content-center gap-2 wishlist-action-btn"
                          style={{
                            backgroundColor: "transparent",
                            border: "2px solid #dc3545",
                            color: "#dc3545",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontWeight: "600",
                            fontSize: "0.8rem",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc3545";
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc3545";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <Trash2 size={14} />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recommendations */}
        <Row
          className="mt-5 pt-4"
          style={{ borderTop: "2px solid rgba(64, 64, 64, 0.1)" }}
        >
          <Col>
            <Card
              className="border-0"
              style={{
                backgroundColor: "#fafafa",
                borderRadius: "20px",
                border: "1px solid rgba(64, 64, 64, 0.1)",
              }}
            >
              <Card.Body className="text-center py-5 px-4">
                <div className="mb-4">
                  <ShoppingBag size={48} style={{ color: "#404040" }} />
                </div>
                <h4
                  className="mb-3 fw-bold"
                  style={{
                    color: "#1d1d1b",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Discover More Amazing Products
                </h4>
                <p
                  className="mb-4"
                  style={{
                    color: "#404040",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                >
                  Explore our complete collection of premium photography
                  equipment, accessories, and professional gear to enhance your
                  creative journey.
                </p>
                <Button
                  as={Link}
                  to="/products"
                  className="d-inline-flex align-items-center gap-3 wishlist-action-btn wishlist-primary-btn"
                  style={{
                    padding: "16px 32px",
                    borderRadius: "14px",
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  <ShoppingBag size={20} />
                  Browse All Products
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Wishlist;
