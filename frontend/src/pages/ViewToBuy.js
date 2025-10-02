import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  Eye,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  Info,
  RotateCcw,
} from "lucide-react";

const ViewToBuy = () => {
  const API_BASE = "http://localhost:8070/api";
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch featured products from API
  const fetchFeaturedProducts = useCallback(
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
          `${API_BASE}/products/featured?t=${timestamp}`
        );
        const data = await response.json();

        if (data.success) {
          setFeaturedProducts(data.data.slice(0, 6)); // Limit to 6 products
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_BASE]
  );

  // Manual refresh function for users
  const handleRefresh = () => {
    fetchFeaturedProducts(true);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Add visibility change listener to refresh products when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh featured products
        fetchFeaturedProducts();
      }
    };

    // Also add focus event to handle when user returns from admin panel
    const handleWindowFocus = () => {
      fetchFeaturedProducts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [fetchFeaturedProducts]);

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

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", message: "" });

    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-vh-100"
      style={{ backgroundColor: "#f8f9fa", paddingTop: "100px" }}
    >
      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        `}
      </style>
      <Container>
        {/* Alert */}
        {showAlert && (
          <Alert
            variant="success"
            className="mb-4 d-flex align-items-center"
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(40, 167, 69, 0.2)",
            }}
          >
            <CheckCircle size={20} className="me-2" />
            Thank you for your inquiry! We'll contact you within 24 hours with
            product information and pricing.
          </Alert>
        )}

        {/* Header Section */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <Button
                as={Link}
                to="/"
                variant="outline-dark"
                className="me-3 d-flex align-items-center"
                style={{ borderRadius: "50px", padding: "8px 16px" }}
              >
                <ArrowLeft size={16} className="me-2" />
                Back to Home
              </Button>
            </div>

            <div className="text-center position-relative">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <h1
                  className="display-4 fw-bold mb-0 me-3"
                  style={{ color: "#1d1d1b" }}
                >
                  View Products to Buy
                </h1>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="d-flex align-items-center"
                  title="Refresh products"
                >
                  <RotateCcw size={16} className={refreshing ? "spin" : ""} />
                  {refreshing && <span className="ms-1">Refreshing...</span>}
                </Button>
              </div>
              <p
                className="lead text-muted mb-4"
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                Browse our premium photography equipment and contact us to
                purchase. We provide personalized service and competitive
                pricing for all our products.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                <Badge
                  bg="success"
                  className="px-3 py-2"
                  style={{ fontSize: "0.9rem", borderRadius: "20px" }}
                >
                  <CheckCircle size={14} className="me-1" />
                  Professional Grade
                </Badge>
                <Badge
                  bg="info"
                  className="px-3 py-2"
                  style={{ fontSize: "0.9rem", borderRadius: "20px" }}
                >
                  <Clock size={14} className="me-1" />
                  Fast Response
                </Badge>
                <Badge
                  bg="warning"
                  className="px-3 py-2"
                  style={{ fontSize: "0.9rem", borderRadius: "20px" }}
                >
                  <Phone size={14} className="me-1" />
                  Personal Service
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* Contact Information Cards */}
        <Row className="mb-5">
          <Col md={4} className="mb-3">
            <Card
              className="h-100 border-0 text-center"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <Card.Body className="p-4">
                <div
                  className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#28a745",
                    borderRadius: "50%",
                    color: "white",
                  }}
                >
                  <Phone size={24} />
                </div>
                <h5 className="fw-bold mb-2">Call Us</h5>
                <p className="text-muted mb-3">Speak with our sales experts</p>
                <a
                  href="tel:+15551234567"
                  className="btn btn-outline-success"
                  style={{ borderRadius: "25px", fontWeight: "600" }}
                >
                  (555) 123-4567
                </a>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card
              className="h-100 border-0 text-center"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <Card.Body className="p-4">
                <div
                  className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#17a2b8",
                    borderRadius: "50%",
                    color: "white",
                  }}
                >
                  <Mail size={24} />
                </div>
                <h5 className="fw-bold mb-2">Email Us</h5>
                <p className="text-muted mb-3">
                  Get detailed product information
                </p>
                <a
                  href="mailto:sales@axg.com"
                  className="btn btn-outline-info"
                  style={{ borderRadius: "25px", fontWeight: "600" }}
                >
                  sales@axg.com
                </a>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card
              className="h-100 border-0 text-center"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <Card.Body className="p-4">
                <div
                  className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#ffc107",
                    borderRadius: "50%",
                    color: "white",
                  }}
                >
                  <MessageCircle size={24} />
                </div>
                <h5 className="fw-bold mb-2">Live Chat</h5>
                <p className="text-muted mb-3">
                  Instant answers to your questions
                </p>
                <Button
                  variant="outline-warning"
                  style={{ borderRadius: "25px", fontWeight: "600" }}
                >
                  Start Chat
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Featured Products Section */}
        <Row className="mb-5">
          <Col>
            <h2
              className="h3 fw-bold mb-4 text-center"
              style={{ color: "#1d1d1b" }}
            >
              Featured Products Available for Purchase
            </h2>
          </Col>
        </Row>

        <Row className="g-4">
          {loading ? (
            <Col className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#1d1d1b" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading featured products...</p>
            </Col>
          ) : (
            featuredProducts.map((product) => (
              <Col key={product._id} lg={4} md={6}>
                <Card
                  className="h-100 border-0 position-relative"
                  style={{
                    borderRadius: "14px",
                    boxShadow: "0 3px 16px rgba(0,0,0,0.08)",
                    transition: "all 0.4s ease",
                    overflow: "hidden",
                  }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={getImageUrl(product)}
                      alt={product.name}
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        objectPosition: "center",
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                      }}
                    />

                    <div className="position-absolute top-0 end-0 m-3">
                      <Badge
                        bg={product.stock > 0 ? "success" : "danger"}
                        style={{ fontSize: "0.75rem", borderRadius: "12px" }}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="px-3 py-2">
                    <div className="mb-1">
                      <Badge
                        bg="light"
                        text="dark"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {product.category?.name || "Product"}
                      </Badge>
                    </div>

                    <Card.Title
                      className="h6 mb-1"
                      style={{ color: "#1d1d1b", fontSize: "0.95rem" }}
                    >
                      {product.name}
                    </Card.Title>

                    <Card.Text
                      className="text-muted mb-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {product.description}
                    </Card.Text>

                    {product.features && product.features.length > 0 && (
                      <div className="mb-2">
                        <div className="d-flex flex-wrap gap-1">
                          {product.features
                            .slice(0, 3)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                bg="outline-secondary"
                                text="muted"
                                style={{
                                  fontSize: "0.6rem",
                                  borderRadius: "4px",
                                  padding: "2px 6px",
                                }}
                              >
                                {feature}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div>
                        <span
                          className="small fw-bold"
                          style={{ color: "#1d1d1b", fontSize: "0.8rem" }}
                        >
                          Status:{" "}
                          {product.status === "active" ? "Available" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="dark"
                      className="w-100 d-flex align-items-center justify-content-center gap-1"
                      style={{
                        backgroundColor: "#1d1d1b",
                        borderColor: "#1d1d1b",
                        borderRadius: "8px",
                        padding: "8px",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye size={14} />
                      View to Buy
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Information Section */}
        <Row className="mt-5 pt-5">
          <Col lg={8} className="mx-auto">
            <Card
              className="border-0 text-center"
              style={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1d1d1b 0%, #404040 100%)",
                color: "white",
              }}
            >
              <Card.Body className="p-5">
                <Info
                  size={48}
                  className="mb-4 mx-auto"
                  style={{ opacity: 0.8 }}
                />
                <h3 className="fw-bold mb-3">How to Purchase</h3>
                <p className="lead mb-4" style={{ opacity: 0.9 }}>
                  We provide personalized service for all purchases. Contact us
                  through any of the methods above to get detailed product
                  information, custom quotes, and expert recommendations
                  tailored to your needs.
                </p>
                <div className="row g-3 text-start">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3 mt-1"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem" }}>1</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Browse Products</h6>
                        <p
                          className="mb-0"
                          style={{ fontSize: "0.9rem", opacity: 0.8 }}
                        >
                          View our catalog and select items you're interested in
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3 mt-1"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem" }}>2</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Contact Us</h6>
                        <p
                          className="mb-0"
                          style={{ fontSize: "0.9rem", opacity: 0.8 }}
                        >
                          Reach out via phone, email, or chat for personalized
                          assistance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3 mt-1"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem" }}>3</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Get Quote</h6>
                        <p
                          className="mb-0"
                          style={{ fontSize: "0.9rem", opacity: 0.8 }}
                        >
                          Receive competitive pricing and product
                          recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3 mt-1"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem" }}>4</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Complete Purchase</h6>
                        <p
                          className="mb-0"
                          style={{ fontSize: "0.9rem", opacity: 0.8 }}
                        >
                          Finalize your order with secure payment and fast
                          shipping
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Spacing before footer */}
      <div className="py-5 mb-4"></div>

      {/* Product Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Inquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img
                  src={
                    selectedProduct.image
                      ? `http://localhost:8070${selectedProduct.image}`
                      : "/placeholder-image.jpg"
                  }
                  alt={selectedProduct.name}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "300px",
                    objectFit: "contain",
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    width: "100%",
                  }}
                />
              </Col>
              <Col md={6}>
                <h4 className="fw-bold mb-3">{selectedProduct.name}</h4>
                <p className="text-muted mb-3">{selectedProduct.description}</p>
                <div className="mb-3">
                  <strong>Features:</strong>
                  <ul className="mt-2">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <span className="h4 text-success fw-bold">
                    ${selectedProduct.price}
                  </span>
                  <Badge bg="success" className="ms-2">
                    {selectedProduct.availability}
                  </Badge>
                </div>
              </Col>
            </Row>
          )}

          <hr className="my-4" />

          <h5 className="mb-3">Contact us for more information</h5>
          <Form onSubmit={handleContactSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your specific needs or ask any questions..."
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="success"
                className="flex-fill"
                style={{ borderRadius: "25px", fontWeight: "600" }}
              >
                Send Inquiry
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowModal(false)}
                style={{ borderRadius: "25px" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewToBuy;
