import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  InputGroup,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import {
  Heart,
  Eye,
  Star,
  Plus,
  Minus,
  Share2,
  Check,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  MessageCircle,
  Package,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ReviewCard from "../components/ReviewCard";
import AddReviewForm from "../components/AddReviewForm";

const ProductDetail = () => {
  // Add CSS for spinning animation
  const spinStyle = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 1s linear infinite;
    }
  `;

  const API_BASE = "http://localhost:8070/api";
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    name: "",
  });

  // Fetch product data from API
  const fetchProduct = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        // Add cache-busting parameter to API call to ensure fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(
          `${API_BASE}/products/${id}?t=${timestamp}`
        );
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
          // Reset image states when new product data is loaded
          setImageLoading(true);
          setImageError(false);
        } else {
          showAlertMessage("Product not found", "danger");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        showAlertMessage("Error loading product", "danger");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_BASE, id]
  );

  // Manual refresh function for users
  const handleRefresh = () => {
    fetchProduct(true);
    if (product?.category?._id) {
      fetchRelatedProducts(product.category._id);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = useCallback(
    async (categoryId) => {
      try {
        const response = await fetch(
          `${API_BASE}/products?category=${categoryId}&limit=4`
        );
        const data = await response.json();

        if (data.success) {
          // Filter out current product
          const related = data.data.filter((p) => p._id !== id);
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    },
    [API_BASE, id]
  );

  // Fetch reviews for the product
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_BASE}/reviews?product=${id}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
        // Find user's review if logged in
        if (user) {
          const userReview = data.data.find(
            (review) => review.user._id === user._id
          );
          setUserReview(userReview || null);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  }, [API_BASE, id, user]);

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

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  // Add visibility change listener to refresh product when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh product data
        fetchProduct();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also add focus event to handle when user returns from admin panel
    const handleWindowFocus = () => {
      fetchProduct();
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [fetchProduct]);

  // Separate effect for fetching related products when product changes
  useEffect(() => {
    if (product?.category?._id) {
      fetchRelatedProducts(product.category._id);
    }
  }, [product?.category?._id, fetchRelatedProducts]);

  const handleViewToBuy = () => {
    showAlertMessage(
      `To purchase ${product.name}, please contact our sales team at sales@axg.com or call (555) 123-4567 for more information and pricing.`,
      "info"
    );
  };

  const handleAddToWishlist = () => {
    if (wishlist.includes(parseInt(id))) {
      setWishlist(wishlist.filter((itemId) => itemId !== parseInt(id)));
      showAlertMessage("Removed from wishlist", "info");
    } else {
      setWishlist([...wishlist, parseInt(id)]);
      showAlertMessage("Added to wishlist", "success");
    }
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  // Handle new review added
  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    setUserReview(newReview);
    fetchProduct(); // Refresh product to update rating
  };

  // Handle review updated
  const handleReviewUpdated = (updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
    if (updatedReview.user._id === user?._id) {
      setUserReview(updatedReview);
    }
    fetchProduct(); // Refresh product to update rating
  };

  // Handle review deleted
  const handleReviewDeleted = (deletedReviewId) => {
    setReviews(reviews.filter((review) => review._id !== deletedReviewId));
    if (userReview?._id === deletedReviewId) {
      setUserReview(null);
    }
    fetchProduct(); // Refresh product to update rating
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      ...newReview,
      id: reviews.length + 1,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
      verified: false,
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: "", comment: "", name: "" });
    setShowReviewModal(false);
    showAlertMessage("Review submitted successfully!", "success");
  };

  const renderStars = (
    rating,
    size = 16,
    interactive = false,
    onRatingChange = null
  ) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? "#ffc107" : "none"}
          color="#ffc107"
          style={{ cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
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
          <p className="mt-3 text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "76px" }}
      >
        <div className="text-center">
          <h2 style={{ color: "#1d1d1b" }}>Product Not Found</h2>
          <p className="text-muted">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products" className="btn btn-dark">
            <ArrowLeft size={16} className="me-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "76px", backgroundColor: "#f8f9fa" }}>
      <style>{spinStyle}</style>
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

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: "#1d1d1b", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                to="/products"
                style={{ color: "#1d1d1b", textDecoration: "none" }}
              >
                Products
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <Row className="g-5">
          {/* Product Images */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                {/* Main Image */}
                <div className="position-relative mb-3">
                  {imageLoading && (
                    <div
                      className="d-flex align-items-center justify-content-center position-absolute w-100 h-100"
                      style={{
                        height: "400px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.375rem 0.375rem 0 0",
                        zIndex: 1,
                      }}
                    >
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  )}
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-100"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "0.375rem 0.375rem 0 0",
                      opacity: imageLoading ? 0 : 1,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                  {imageError && (
                    <div
                      className="d-flex align-items-center justify-content-center position-absolute w-100 h-100 top-0 start-0"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.375rem 0.375rem 0 0",
                      }}
                    >
                      <div className="text-center text-muted">
                        <Package size={48} className="mb-2" />
                        <p>Image not available</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setImageError(false);
                            setImageLoading(true);
                            // Force image reload by updating the timestamp
                            const img = new Image();
                            img.src = getImageUrl(product);
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="position-absolute top-0 start-0 p-3">
                    {product.isNew && (
                      <Badge bg="success" className="me-2">
                        New
                      </Badge>
                    )}
                    {product.isSale && <Badge bg="danger">Sale</Badge>}
                  </div>

                  {/* Share Button */}
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-0 end-0 m-3"
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <Share2 size={18} />
                  </Button>
                </div>

                {/* Thumbnail Gallery - Currently single image */}
                {(product.image || product.imageUrl) && (
                  <div className="px-3 pb-3">
                    <Row className="g-2">
                      <Col xs={3}>
                        <div className="position-relative">
                          <img
                            src={getImageUrl(product)}
                            alt={product.name}
                            className="w-100 border border-dark"
                            style={{
                              height: "80px",
                              objectFit: "contain",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "0.375rem",
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Product Information */}
          <Col lg={6}>
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h1 className="h2 mb-0" style={{ color: "#1d1d1b" }}>
                  {product.name}
                </h1>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="d-flex align-items-center"
                  title="Refresh product information"
                >
                  <RotateCcw size={16} className={refreshing ? "spin" : ""} />
                  {refreshing && <span className="ms-1">Refreshing...</span>}
                </Button>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <Badge
                  bg={product.status === "active" ? "success" : "secondary"}
                  className="me-2"
                >
                  {product.status === "active" ? "Available" : "Draft"}
                </Badge>
                {product.features && product.features.includes("featured") && (
                  <Badge bg="warning" className="me-2">
                    Featured
                  </Badge>
                )}
                {product.features &&
                  product.features.includes("new-arrival") && (
                    <Badge bg="info">New Arrival</Badge>
                  )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stockQuantity > 0 ? (
                  <div className="d-flex align-items-center text-success">
                    <Check size={20} className="me-2" />
                    <span>In Stock ({product.stockQuantity} available)</span>
                  </div>
                ) : (
                  <div className="text-danger">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <Form.Label
                  className="fw-semibold"
                  style={{ color: "#1d1d1b" }}
                >
                  Quantity
                </Form.Label>
                <InputGroup style={{ width: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <Form.Control
                    type="text"
                    value={quantity}
                    readOnly
                    className="text-center"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stockQuantity || 10)}
                  >
                    <Plus size={16} />
                  </Button>
                </InputGroup>
              </div>

              {/* Action Buttons */}
              <div className="mb-4">
                <Row className="g-3">
                  <Col>
                    <Button
                      variant="dark"
                      size="lg"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleViewToBuy}
                      disabled={!product.inStock}
                    >
                      <Eye size={20} />
                      View to Buy
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-dark"
                      size="lg"
                      onClick={handleAddToWishlist}
                      style={{ width: "60px", height: "48px" }}
                    >
                      <Heart
                        size={20}
                        fill={
                          wishlist.includes(parseInt(id)) ? "#dc3545" : "none"
                        }
                        color={
                          wishlist.includes(parseInt(id))
                            ? "#dc3545"
                            : "currentColor"
                        }
                      />
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Trust Badges */}
              <Row className="g-3 text-center">
                <Col xs={4}>
                  <div className="p-3">
                    <Shield
                      size={24}
                      className="mb-2"
                      style={{ color: "#1d1d1b" }}
                    />
                    <small className="d-block text-muted">Secure Payment</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3">
                    <Truck
                      size={24}
                      className="mb-2"
                      style={{ color: "#1d1d1b" }}
                    />
                    <small className="d-block text-muted">Free Shipping</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3">
                    <RotateCcw
                      size={24}
                      className="mb-2"
                      style={{ color: "#1d1d1b" }}
                    />
                    <small className="d-block text-muted">30-Day Returns</small>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="description" title="Description">
                    <div className="py-3">
                      <p className="lead text-muted mb-4">
                        {product.description}
                      </p>

                      {product.features && (
                        <>
                          <h5 className="mb-3" style={{ color: "#1d1d1b" }}>
                            Key Features
                          </h5>
                          <ul className="list-unstyled">
                            {product.features.map((feature, index) => (
                              <li
                                key={index}
                                className="mb-2 d-flex align-items-start"
                              >
                                <Check
                                  size={16}
                                  className="me-2 mt-1 text-success"
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </Tab>

                  <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
                    <div className="py-3">
                      {/* Reviews Summary */}
                      <div className="mb-4 p-4 bg-light rounded">
                        <Row className="align-items-center">
                          <Col md={4} className="text-center mb-3 mb-md-0">
                            <div
                              className="display-4 fw-bold"
                              style={{ color: "#1d1d1b" }}
                            >
                              {product?.averageRating?.toFixed(1) || "0.0"}
                            </div>
                            <div className="mb-2">
                              {renderStars(product?.averageRating || 0, 20)}
                            </div>
                            <small className="text-muted">
                              Based on {product?.totalReviews || 0} reviews
                            </small>
                          </Col>
                          <Col md={8}>
                            <Row>
                              <Col>
                                {[5, 4, 3, 2, 1].map((star) => {
                                  const starCount = reviews.filter(
                                    (r) => r.rating === star
                                  ).length;
                                  const percentage =
                                    reviews.length > 0
                                      ? (starCount / reviews.length) * 100
                                      : 0;
                                  return (
                                    <div
                                      key={star}
                                      className="d-flex align-items-center mb-1"
                                    >
                                      <span className="me-2">{star}</span>
                                      <Star
                                        size={14}
                                        fill="#ffc107"
                                        color="#ffc107"
                                      />
                                      <div className="flex-grow-1 mx-2">
                                        <ProgressBar
                                          now={percentage}
                                          style={{ height: "6px" }}
                                        />
                                      </div>
                                      <small className="text-muted">
                                        {starCount}
                                      </small>
                                    </div>
                                  );
                                })}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>

                      {/* Add Review Form */}
                      <AddReviewForm
                        productId={id}
                        onReviewAdded={handleReviewAdded}
                        currentUser={user}
                        existingReview={userReview}
                      />

                      {/* Reviews Loading */}
                      {reviewsLoading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" className="me-2" />
                          <span>Loading reviews...</span>
                        </div>
                      ) : (
                        /* Individual Reviews */
                        <div className="reviews-list">
                          {reviews.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                              <MessageCircle size={48} className="mb-3" />
                              <h5>No reviews yet</h5>
                              <p>
                                Be the first to share your experience with this
                                product!
                              </p>
                            </div>
                          ) : (
                            reviews.map((review) => (
                              <ReviewCard
                                key={review._id}
                                review={review}
                                currentUser={user}
                                onReviewUpdated={handleReviewUpdated}
                                onReviewDeleted={handleReviewDeleted}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Row className="mt-5">
            <Col>
              <h3 className="mb-4" style={{ color: "#1d1d1b" }}>
                Related Products
              </h3>
              <Row className="g-4">
                {relatedProducts.map((relatedProduct) => (
                  <Col key={relatedProduct._id} sm={6} lg={3}>
                    <Card className="h-100 product-card border-0 shadow-sm">
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={getImageUrl(relatedProduct)}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                          }}
                        >
                          <Heart size={14} />
                        </Button>
                      </div>
                      <Card.Body>
                        <Card.Title className="h6 mb-2">
                          <Link
                            to={`/product/${relatedProduct.id}`}
                            className="text-decoration-none"
                            style={{ color: "#1d1d1b" }}
                          >
                            {relatedProduct.name}
                          </Link>
                        </Card.Title>
                        <div className="d-flex align-items-center mb-2">
                          {renderStars(relatedProduct.rating || 4.5, 12)}
                          <small className="text-muted ms-2">
                            ({relatedProduct.reviews})
                          </small>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                          <Button
                            variant="outline-dark"
                            size="sm"
                            className="flex-fill"
                            as={Link}
                            to={`/product/${relatedProduct._id}`}
                          >
                            <Eye size={14} className="me-1" />
                            View
                          </Button>
                          <Button
                            variant="dark"
                            size="sm"
                            className="flex-fill"
                          >
                            <Eye size={14} className="me-1" />
                            View to Buy
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>

      {/* Review Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div>
                {renderStars(newReview.rating, 24, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review Title</Form.Label>
              <Form.Control
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowReviewModal(false)}
                className="flex-fill"
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark" className="flex-fill">
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;
