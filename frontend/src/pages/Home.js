import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Zap,
  Shield,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  Star,
  ChevronLeft,
  Heart,
  ShoppingCart,
  Eye,
  Bell,
} from "lucide-react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

import axgLogo from "../assets/images/axg-logo.png";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [allNewArrivals, setAllNewArrivals] = useState([]); // Store all new arrivals for pagination
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Show 4 products per page
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Backend API base URL
  const API_BASE_URL = "http://localhost:8070/api";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        const featuredResponse = await fetch(
          `${API_BASE_URL}/products/featured?limit=8`
        );
        const featuredData = await featuredResponse.json();

        // Fetch new arrivals - get more products for pagination
        const newArrivalsResponse = await fetch(
          `${API_BASE_URL}/products/new-arrivals?limit=12`
        );
        const newArrivalsData = await newArrivalsResponse.json();

        if (featuredData.success) {
          setFeaturedProducts(featuredData.data);
        }

        if (newArrivalsData.success) {
          setAllNewArrivals(newArrivalsData.data);
          // Set initial page products
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          setNewArrivals(newArrivalsData.data.slice(startIndex, endIndex));
        }

        setOffers([]); // No offers for now
      } catch (error) {
        console.error("Error fetching products:", error);
        // Keep arrays empty on error - show appropriate message instead
        setFeaturedProducts([]);
        setNewArrivals([]);
        setAllNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage]);

  // Pagination functions
  const totalPages = Math.ceil(allNewArrivals.length / itemsPerPage);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber === currentPage || isTransitioning) return;

    setIsTransitioning(true);

    // Add fade out animation
    const productCards = document.querySelectorAll(".new-arrival-card");
    productCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
    });

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update products for new page
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setNewArrivals(allNewArrivals.slice(startIndex, endIndex));
    setCurrentPage(pageNumber);

    // Wait for DOM update then fade in
    setTimeout(() => {
      const newCards = document.querySelectorAll(".new-arrival-card");
      newCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
      setIsTransitioning(false);
    }, 50);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleViewToBuy = (product) => {
    // Navigate to product details or show purchase info
    console.log("Viewing product to buy:", product);
    // For now, alert the user about how to purchase
    alert(
      `To purchase ${product.name}, please contact our sales team at sales@axg.com or call (555) 123-4567 for more information and pricing.`
    );
  };

  const handleAddToWishlist = (product) => {
    // TODO: Implement add to wishlist functionality
    console.log("Adding to wishlist:", product);
  };

  if (loading) {
    return <Loading size="large" text="Loading amazing products..." />;
  }

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section
        className="hero-section position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1d1d1b 0%, #2c2c2a 40%, #404040 80%, #2c2c2a 100%)",
          backgroundSize: "400% 400%",
        }}
      >
        {/* Background Geometric Patterns */}
        <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
          {/* Subtle Grid Pattern */}
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              opacity: 0.5,
            }}
          />

          {/* Floating Geometric Shapes */}
          <div className="hero-geometric-shapes">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>
            <div className="hero-shape hero-shape-4"></div>
          </div>

          {/* Radial Gradients */}
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
                          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 40%),
                          radial-gradient(circle at 60% 40%, rgba(255,255,255,0.03) 0%, transparent 30%)`,
            }}
          />
        </div>

        <Container className="position-relative" style={{ zIndex: 3 }}>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              {/* Hero Content */}
              <div className="hero-text-content">
                {/* Logo Section */}
                <div
                  className="hero-logo-container mb-4"
                  style={{
                    marginTop: "clamp(80px, 12vh, 160px)",
                    paddingTop: "clamp(30px, 6vh, 60px)",
                  }}
                >
                  <img
                    src={axgLogo}
                    alt="AXG Photography Equipment"
                    className="hero-logo"
                    style={{
                      width: "clamp(160px, 25vw, 280px)",
                      height: "auto",
                      borderRadius: "20px",
                      boxShadow: "0 8px 32px rgba(255,255,255,0.2)",
                      border: "3px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      animation: "logoFloat 6s ease-in-out infinite",
                    }}
                  />
                </div>

                {/* Main Headline */}
                <h1
                  className="hero-main-title hero-fade-in-up mb-4"
                  style={{
                    fontSize: "clamp(3.5rem, 9vw, 7rem)",
                    fontWeight: "900",
                    lineHeight: "1.05",
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                    marginBottom: "2rem",
                  }}
                >
                  <span className="hero-main-text d-block">Power Your</span>
                  <span
                    className="hero-highlight-text d-block"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      position: "relative",
                      transform: "translateZ(0)",
                    }}
                  >
                    Creativity
                  </span>
                </h1>

                {/* Supporting Tagline */}
                <div className="hero-subtitle-container mb-5">
                  <p
                    className="hero-subtitle hero-fade-in-up-delay lead"
                    style={{
                      fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                      color: "#ffffff",
                      lineHeight: "1.6",
                      maxWidth: "650px",
                      margin: "0 auto",
                      fontWeight: "300",
                      letterSpacing: "0.5px",
                      opacity: "0.9",
                      textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    Premium accessories designed for professionals who demand
                    excellence in every shot
                  </p>
                </div>

                {/* Statistics Row */}
                <div className="hero-stats-row mb-5">
                  <Row className="g-4 justify-content-center text-white">
                    <Col xs={6} md={3} className="hero-stat-item">
                      <div
                        className="hero-stat-number fw-bold mb-1"
                        style={{ fontSize: "2rem" }}
                      >
                        2500+
                      </div>
                      <div
                        className="hero-stat-label"
                        style={{ fontSize: "0.9rem", opacity: 0.8 }}
                      >
                        Happy Customers
                      </div>
                    </Col>
                    <Col xs={6} md={3} className="hero-stat-item">
                      <div
                        className="hero-stat-number fw-bold mb-1"
                        style={{ fontSize: "2rem" }}
                      >
                        50+
                      </div>
                      <div
                        className="hero-stat-label"
                        style={{ fontSize: "0.9rem", opacity: 0.8 }}
                      >
                        Premium Products
                      </div>
                    </Col>
                    <Col xs={6} md={3} className="hero-stat-item">
                      <div
                        className="hero-stat-number fw-bold mb-1"
                        style={{ fontSize: "2rem" }}
                      >
                        24/7
                      </div>
                      <div
                        className="hero-stat-label"
                        style={{ fontSize: "0.9rem", opacity: 0.8 }}
                      >
                        Expert Support
                      </div>
                    </Col>
                    <Col xs={6} md={3} className="hero-stat-item">
                      <div
                        className="hero-stat-number fw-bold mb-1"
                        style={{ fontSize: "2rem" }}
                      >
                        2Y
                      </div>
                      <div
                        className="hero-stat-label"
                        style={{ fontSize: "0.9rem", opacity: 0.8 }}
                      >
                        Warranty
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* CTA Buttons */}
                <div className="hero-cta-container hero-fade-in-up-delay-2 d-flex flex-column flex-sm-row gap-4 justify-content-center">
                  <Button
                    as={Link}
                    to="/products"
                    size="lg"
                    className="hero-shop-now-btn d-inline-flex align-items-center justify-content-center gap-3 px-6 py-4 btn-animated"
                    style={{
                      color: "#1d1d1b",
                      fontWeight: "700",
                      fontSize: "1.2rem",
                      minWidth: "220px",
                      borderRadius: "60px",
                      boxShadow: "0 12px 40px rgba(255,255,255,0.3)",
                      border: "2px solid #ffffff",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#404040";
                      e.target.style.color = "#ffffff";
                      e.target.style.borderColor = "#404040";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)";
                      e.target.style.color = "#1d1d1b";
                      e.target.style.borderColor = "#ffffff";
                    }}
                  >
                    <ShoppingCart size={24} />
                    <span>Shop Now</span>
                  </Button>

                  <Button
                    as={Link}
                    to="/about"
                    size="lg"
                    className="hero-learn-more-btn d-inline-flex align-items-center justify-content-center gap-3 px-6 py-4 btn-animated"
                    style={{
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      minWidth: "220px",
                      borderRadius: "60px",
                      borderWidth: "2px",
                      borderColor: "#404040",
                      background: "#404040",
                      color: "#ffffff",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(64, 64, 64, 0.1)";
                      e.target.style.borderColor = "#ffffff";
                      e.target.style.backdropFilter = "blur(15px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#404040";
                      e.target.style.borderColor = "#404040";
                      e.target.style.backdropFilter = "none";
                    }}
                  >
                    <span>Learn More</span>
                    <ArrowRight size={24} />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="hero-trust-indicators mt-5 pt-4">
                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 text-white-50">
                    <div className="d-flex align-items-center gap-2">
                      <Shield size={18} />
                      <span style={{ fontSize: "0.9rem" }}>
                        2-Year Warranty
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Truck size={18} />
                      <span style={{ fontSize: "0.9rem" }}>Free Shipping</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <HeadphonesIcon size={18} />
                      <span style={{ fontSize: "0.9rem" }}>Expert Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Scroll Indicator */}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 hero-scroll-indicator">
            <div className="text-center text-white-50">
              <small
                className="d-block mb-2"
                style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
              >
                SCROLL DOWN
              </small>
              <div
                className="mx-auto hero-scroll-line"
                style={{
                  width: "2px",
                  height: "40px",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
                  borderRadius: "1px",
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          {/* Section Header */}
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: "#1d1d1b", letterSpacing: "-0.02em" }}
              >
                Featured Products
              </h2>
              <p
                className="lead"
                style={{
                  color: "#404040",
                  maxWidth: "500px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Hand-picked premium photography accessories that professionals
                trust
              </p>
            </Col>
          </Row>

          {/* Products Carousel */}
          <div className="featured-products-carousel">
            <Carousel
              indicators={true}
              controls={true}
              interval={4000}
              pause="hover"
              className="featured-carousel"
              prevIcon={
                <div
                  className="carousel-control-custom carousel-control-prev-custom"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <ChevronLeft size={20} style={{ color: "#1d1d1b" }} />
                </div>
              }
              nextIcon={
                <div
                  className="carousel-control-custom carousel-control-next-custom"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <ChevronRight size={20} style={{ color: "#1d1d1b" }} />
                </div>
              }
            >
              {/* Group products in slides of 3 for desktop, 2 for tablet, 1 for mobile */}
              {Array.from(
                { length: Math.ceil(featuredProducts.length / 3) },
                (_, slideIndex) => (
                  <Carousel.Item key={slideIndex}>
                    <Container>
                      <Row className="g-4 justify-content-center">
                        {featuredProducts
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((product) => (
                            <Col
                              xs={12}
                              md={6}
                              lg={4}
                              key={product._id || product.id}
                            >
                              <Card
                                className="featured-product-card h-100 border-0 position-relative"
                                style={{
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 4px 20px rgba(29, 29, 27, 0.08)",
                                  transition:
                                    "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  overflow: "hidden",
                                }}
                              >
                                {/* Product Image */}
                                <div className="position-relative overflow-hidden">
                                  <Card.Img
                                    variant="top"
                                    src={
                                      product.image
                                        ? `http://localhost:8070${product.image}`
                                        : product.image
                                    }
                                    alt={product.name}
                                    className="featured-product-img"
                                    style={{
                                      height: "240px",
                                      objectFit: "contain",
                                      objectPosition: "center",
                                      backgroundColor: "#f8f9fa",
                                      transition:
                                        "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                    }}
                                  />

                                  {/* Badges */}
                                  <div className="position-absolute top-0 start-0 p-3">
                                    {product.isFeatured && (
                                      <Badge
                                        bg="warning"
                                        text="dark"
                                        className="me-1 mb-1 product-badge"
                                        style={{
                                          fontSize: "0.7rem",
                                          padding: "4px 8px",
                                          borderRadius: "12px",
                                        }}
                                      >
                                        Featured
                                      </Badge>
                                    )}
                                    {product.status === "Active" &&
                                      product.stockQuantity > 0 && (
                                        <Badge
                                          bg="success"
                                          className="me-1 mb-1 product-badge"
                                          style={{
                                            fontSize: "0.7rem",
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                          }}
                                        >
                                          In Stock
                                        </Badge>
                                      )}
                                  </div>

                                  {/* Quick Actions */}
                                  <div
                                    className="position-absolute top-0 end-0 p-3 featured-actions"
                                    style={{
                                      opacity: 0,
                                      transform: "translateY(-10px)",
                                      transition: "all 0.4s ease",
                                    }}
                                  >
                                    <div className="d-flex flex-column gap-2">
                                      <Button
                                        size="sm"
                                        variant="light"
                                        className="rounded-circle p-2"
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                        onClick={() =>
                                          handleAddToWishlist(product)
                                        }
                                      >
                                        <Heart size={16} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="light"
                                        className="rounded-circle p-2"
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        <Eye size={16} />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Overlay */}
                                  <div
                                    className="position-absolute top-0 start-0 w-100 h-100 featured-overlay"
                                    style={{
                                      background:
                                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)",
                                      opacity: 0,
                                      transition: "opacity 0.4s ease",
                                    }}
                                  />
                                </div>

                                {/* Product Content */}
                                <Card.Body className="p-4">
                                  {/* Rating and Category */}
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          fill={
                                            i < (product.rating || 0)
                                              ? "#ffc107"
                                              : "none"
                                          }
                                          color="#ffc107"
                                          style={{ marginRight: "2px" }}
                                        />
                                      ))}
                                      {product.reviewsCount > 0 && (
                                        <small className="text-muted ms-2">
                                          ({product.reviewsCount})
                                        </small>
                                      )}
                                    </div>
                                    {product.category && (
                                      <Badge
                                        bg="light"
                                        text="dark"
                                        style={{
                                          fontSize: "0.7rem",
                                          color: "#404040",
                                          backgroundColor: "#f8f9fa",
                                          border: "1px solid #e9ecef",
                                        }}
                                      >
                                        {product.category.name ||
                                          product.category}
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Product Title */}
                                  <Card.Title
                                    className="h6 mb-3"
                                    style={{
                                      color: "#1d1d1b",
                                      fontSize: "1rem",
                                      lineHeight: "1.4",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {product.name}
                                  </Card.Title>

                                  {/* Add to Cart Button */}
                                  <Button
                                    variant="dark"
                                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                      backgroundColor: "#1d1d1b",
                                      borderColor: "#1d1d1b",
                                      borderRadius: "8px",
                                      padding: "8px 16px",
                                      fontSize: "0.9rem",
                                      fontWeight: "500",
                                    }}
                                    onClick={() => handleViewToBuy(product)}
                                  >
                                    <Eye size={16} />
                                    View to Buy
                                  </Button>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    </Container>
                  </Carousel.Item>
                )
              )}
            </Carousel>
          </div>

          {/* View All Products Link */}
          <Row className="mt-5">
            <Col className="text-center">
              <Button
                as={Link}
                to="/products"
                variant="outline-dark"
                size="lg"
                className="px-5 py-3 btn-animated"
                style={{
                  borderColor: "#1d1d1b",
                  color: "#1d1d1b",
                  borderRadius: "50px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
              >
                View All Products
                <ArrowRight size={18} className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section
        className="features-benefits-section py-6 position-relative overflow-hidden"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Background Pattern */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: `
            radial-gradient(circle at 25% 25%, rgba(29, 29, 27, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(29, 29, 27, 0.015) 0%, transparent 50%)
          `,
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 1 }}>
          {/* Section Header */}
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <div className="features-section-header">
                <Badge
                  className="features-badge mb-3 px-4 py-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d1d1b 0%, #404040 100%)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "none",
                    borderRadius: "25px",
                    color: "#ffffff",
                  }}
                >
                  ✨ Why Choose AXG
                </Badge>
                <h2
                  className="features-title display-5 fw-bold mb-3"
                  style={{
                    color: "#1d1d1b",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Premium Features & Benefits
                </h2>
                <p
                  className="features-subtitle lead mb-4"
                  style={{
                    color: "#666666",
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontSize: "1.1rem",
                  }}
                >
                  Experience the difference with our professional-grade
                  accessories and exceptional service
                </p>
                <div
                  className="features-divider mx-auto mb-4"
                  style={{
                    width: "60px",
                    height: "3px",
                    background:
                      "linear-gradient(135deg, #1d1d1b 0%, #404040 100%)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </Col>
          </Row>

          {/* Features Grid */}
          <Row className="g-4 justify-content-center">
            {/* High Performance */}
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex mb-4 animate-feature-card animate-delay-1"
            >
              <Card className="feature-card h-100 w-100 border-0 shadow text-center rounded-4">
                <Card.Body className="feature-card-body p-5 d-flex flex-column">
                  <div className="feature-icon-container mb-4 mx-auto">
                    <Zap size={32} />
                  </div>
                  <h4
                    className="feature-title fw-bold mb-3"
                    style={{
                      color: "#1d1d1b",
                      fontSize: "1.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    High Performance
                  </h4>
                  <p
                    className="feature-description flex-grow-1 mb-4"
                    style={{
                      color: "#6c757d",
                      lineHeight: "1.7",
                      fontSize: "1rem",
                    }}
                  >
                    Premium quality accessories engineered for professional
                    results and exceptional durability
                  </p>
                  <div className="feature-highlight mt-3">
                    <span
                      className="highlight-text"
                      style={{
                        color: "#28a745",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <ArrowRight size={14} className="me-1" />
                      Professional Grade
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Warranty */}
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex mb-4 animate-feature-card animate-delay-2"
            >
              <Card className="feature-card h-100 w-100 border-0 shadow text-center rounded-4">
                <Card.Body className="feature-card-body p-5 d-flex flex-column">
                  <div className="feature-icon-container mb-4 mx-auto">
                    <Shield size={32} />
                  </div>
                  <h4
                    className="feature-title fw-bold mb-3"
                    style={{
                      color: "#1d1d1b",
                      fontSize: "1.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Warranty
                  </h4>
                  <p
                    className="feature-description flex-grow-1 mb-4"
                    style={{
                      color: "#6c757d",
                      lineHeight: "1.7",
                      fontSize: "1rem",
                    }}
                  >
                    Comprehensive warranty coverage on all products with
                    hassle-free replacement guarantee
                  </p>
                  <div className="feature-highlight mt-3">
                    <span
                      className="highlight-text"
                      style={{
                        color: "#28a745",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <ArrowRight size={14} className="me-1" />
                      Peace of Mind
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* 24/7 Support */}
            <Col
              xs={12}
              sm={12}
              lg={4}
              className="d-flex mb-4 animate-feature-card animate-delay-3"
            >
              <Card className="feature-card h-100 w-100 border-0 shadow text-center rounded-4">
                <Card.Body className="feature-card-body p-5 d-flex flex-column">
                  <div className="feature-icon-container mb-4 mx-auto">
                    <HeadphonesIcon size={32} />
                  </div>
                  <h4
                    className="feature-title fw-bold mb-3"
                    style={{
                      color: "#1d1d1b",
                      fontSize: "1.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    24/7 Support
                  </h4>
                  <p
                    className="feature-description flex-grow-1 mb-4"
                    style={{
                      color: "#6c757d",
                      lineHeight: "1.7",
                      fontSize: "1rem",
                    }}
                  >
                    Expert customer support available around the clock to assist
                    with any questions or concerns
                  </p>
                  <div className="feature-highlight mt-3">
                    <span
                      className="highlight-text"
                      style={{
                        color: "#28a745",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <ArrowRight size={14} className="me-1" />
                      Always Here
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Additional Trust Indicators */}
          <Row
            className="text-center mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(29, 29, 27, 0.05)" }}
          >
            <Col>
              <div className="trust-indicators d-flex flex-wrap justify-content-center align-items-center gap-4">
                <div className="trust-item d-flex align-items-center">
                  <div
                    className="trust-icon me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{
                      color: "#666666",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    ISO Certified
                  </span>
                </div>
                <div className="trust-item d-flex align-items-center">
                  <div
                    className="trust-icon me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{
                      color: "#666666",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    10,000+ Happy Customers
                  </span>
                </div>
                <div className="trust-item d-flex align-items-center">
                  <div
                    className="trust-icon me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{
                      color: "#666666",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Industry Leading
                  </span>
                </div>
                <div className="trust-item d-flex align-items-center">
                  <div
                    className="trust-icon me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{
                      color: "#666666",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Secure Payments
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* New Arrivals */}
      <section
        className="new-arrivals-section py-5"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Container>
          {/* Section Header */}
          <Row className="text-center mb-5">
            <Col>
              <div className="new-arrivals-header">
                <Badge
                  bg="dark"
                  className="new-arrivals-badge mb-3 px-3 py-2"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                  }}
                >
                  ✨ Fresh Collection
                </Badge>
                <h2
                  className="new-arrivals-title display-4 fw-bold mb-3"
                  style={{ color: "#1d1d1b" }}
                >
                  New Arrivals
                </h2>
                <p
                  className="new-arrivals-subtitle lead mb-4"
                  style={{
                    color: "#666666",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Discover the latest premium photography accessories crafted
                  for professionals and enthusiasts
                </p>
                <div
                  className="new-arrivals-divider mx-auto mb-4"
                  style={{
                    width: "60px",
                    height: "3px",
                    backgroundColor: "#1d1d1b",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </Col>
          </Row>

          {/* Products Grid */}
          <div className="position-relative">
            {isTransitioning && (
              <div
                className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  zIndex: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(2px)",
                  minHeight: "400px",
                }}
              >
                <div className="text-center">
                  <div
                    className="spinner-border text-dark mb-3"
                    role="status"
                    style={{ width: "2rem", height: "2rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0">Loading products...</p>
                </div>
              </div>
            )}

            <Row className="g-4 justify-content-center">
              {newArrivals.length === 0 && !isTransitioning ? (
                <Col xs={12} className="text-center py-5">
                  <div className="text-muted">
                    <p className="fs-4 mb-3" style={{ color: "#666" }}>
                      No New Arrivals Available
                    </p>
                    <p className="mb-0">
                      No new arrivals available at the moment.
                      <br />
                      Please check back later for exciting new products!
                    </p>
                  </div>
                </Col>
              ) : (
                newArrivals.map((product, index) => (
                  <Col
                    xs={12}
                    sm={6}
                    lg={4}
                    xl={3}
                    key={product._id || product.id}
                  >
                    <Card
                      className={`new-arrival-card h-100 border-0 shadow-sm animate-card animate-delay-${
                        index + 1
                      }`}
                    >
                      {/* Product Image Container */}
                      <div className="new-arrival-image-container position-relative overflow-hidden">
                        <Card.Img
                          variant="top"
                          src={
                            product.image
                              ? `http://localhost:8070${product.image}`
                              : `data:image/svg+xml;base64,${btoa(`
                                <svg width="260" height="260" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="100%" height="100%" fill="#f8f9fa"/>
                                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial, sans-serif" font-size="16">
                                    ${product.name || "Product"}
                                  </text>
                                </svg>
                              `)}`
                          }
                          alt={product.name}
                          className="new-arrival-image"
                          style={{
                            height: "260px",
                            objectFit: "contain",
                            objectPosition: "center",
                            backgroundColor: "#f8f9fa",
                            transition: "transform 0.4s ease",
                          }}
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml;base64,${btoa(`
                              <svg width="260" height="260" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="#f8f9fa"/>
                                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial, sans-serif" font-size="16">
                                  No Image
                                </text>
                              </svg>
                            `)}`;
                          }}
                        />

                        {/* Badges */}
                        <div
                          className="new-arrival-badges position-absolute"
                          style={{ top: "15px", left: "15px" }}
                        >
                          <Badge bg="info" className="me-2 new-badge">
                            NEW ARRIVAL
                          </Badge>
                          {product.status === "Active" &&
                            product.stockQuantity > 0 && (
                              <Badge bg="success" className="me-2 new-badge">
                                IN STOCK
                              </Badge>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                          variant="light"
                          className="new-arrival-wishlist position-absolute"
                          style={{
                            top: "15px",
                            right: "15px",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: "0",
                            transform: "translateY(-10px)",
                            transition: "all 0.3s ease",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                          }}
                          onClick={() => handleAddToWishlist(product)}
                        >
                          <Heart size={16} />
                        </Button>

                        {/* Quick Actions Overlay */}
                        <div
                          className="new-arrival-actions position-absolute w-100 d-flex gap-2 px-3"
                          style={{
                            bottom: "15px",
                            opacity: "0",
                            transform: "translateY(20px)",
                            transition: "all 0.3s ease 0.1s",
                          }}
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="flex-fill quick-view-btn"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid rgba(29, 29, 27, 0.1)",
                              backdropFilter: "blur(10px)",
                              fontWeight: "500",
                            }}
                          >
                            <Eye size={14} className="me-1" />
                            Quick View
                          </Button>
                          <Button
                            variant="dark"
                            size="sm"
                            className="flex-fill view-to-buy-btn"
                            onClick={() => handleViewToBuy(product)}
                            style={{ fontWeight: "500" }}
                          >
                            <Eye size={14} className="me-1" />
                            View to Buy
                          </Button>
                        </div>
                      </div>

                      {/* Product Content */}
                      <Card.Body className="new-arrival-content p-4">
                        {/* Rating and Category */}
                        <div className="new-arrival-rating d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <div className="star-rating me-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={
                                    i < (product.rating || 0)
                                      ? "#ffc107"
                                      : "none"
                                  }
                                  color="#ffc107"
                                />
                              ))}
                            </div>
                            {product.reviewsCount > 0 && (
                              <small className="text-muted">
                                ({product.reviewsCount})
                              </small>
                            )}
                          </div>
                          {product.category && (
                            <Badge
                              bg="light"
                              text="dark"
                              style={{
                                fontSize: "0.7rem",
                                color: "#404040",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #e9ecef",
                              }}
                            >
                              {product.category.name || product.category}
                            </Badge>
                          )}
                        </div>

                        {/* Product Title */}
                        <Card.Title
                          className="new-arrival-title h6 mb-3"
                          style={{
                            color: "#1d1d1b",
                            fontWeight: "600",
                            lineHeight: "1.4",
                            minHeight: "2.8em",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </Card.Title>

                        {/* Main CTA Button */}
                        <Button
                          variant="outline-dark"
                          className="new-arrival-cta w-100"
                          onClick={() => handleViewToBuy(product)}
                          style={{
                            borderWidth: "2px",
                            fontWeight: "600",
                            padding: "0.75rem",
                            transition: "all 0.3s ease",
                            borderRadius: "8px",
                          }}
                        >
                          View to Buy
                          <ArrowRight size={16} className="ms-2" />
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Row className="justify-content-center mt-5">
              <Col xs="auto">
                <div className="d-flex align-items-center gap-3">
                  {/* Previous Button */}
                  <Button
                    variant="outline-dark"
                    size="sm"
                    disabled={currentPage === 1 || isTransitioning}
                    onClick={handlePrevPage}
                    className="pagination-btn d-flex align-items-center"
                    style={{
                      borderRadius: "25px",
                      minWidth: "45px",
                      height: "45px",
                      border: "2px solid #1d1d1b",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ChevronLeft size={18} />
                  </Button>

                  {/* Page Numbers */}
                  <div className="d-flex align-items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "dark" : "outline-light"
                          }
                          size="sm"
                          disabled={isTransitioning}
                          onClick={() => handlePageChange(pageNum)}
                          className="pagination-number"
                          style={{
                            borderRadius: "50%",
                            minWidth: "40px",
                            height: "40px",
                            fontWeight: "600",
                            border:
                              currentPage === pageNum
                                ? "none"
                                : "2px solid #e0e0e0",
                            backgroundColor:
                              currentPage === pageNum
                                ? "#1d1d1b"
                                : "transparent",
                            color: currentPage === pageNum ? "white" : "#666",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline-dark"
                    size="sm"
                    disabled={currentPage === totalPages || isTransitioning}
                    onClick={handleNextPage}
                    className="pagination-btn d-flex align-items-center"
                    style={{
                      borderRadius: "25px",
                      minWidth: "45px",
                      height: "45px",
                      border: "2px solid #1d1d1b",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {/* View All Products Link */}
          <Row className="text-center mt-4">
            <Col>
              <Button
                as={Link}
                to="/products?filter=new"
                variant="link"
                className="text-decoration-none"
                style={{
                  color: "#666",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1d1d1b")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                View All New Arrivals →
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Special Offers */}
      <section
        className="special-offers-section py-5 position-relative overflow-hidden"
        style={{ backgroundColor: "#1d1d1b" }}
      >
        {/* Background Pattern */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)
          `,
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 1 }}>
          {/* Section Header */}
          <Row className="text-center mb-5">
            <Col>
              <div className="special-offers-header">
                <Badge
                  className="special-offers-badge mb-3 px-4 py-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)",
                  }}
                >
                  🔥 Hot Deals
                </Badge>
                <h2
                  className="special-offers-title display-3 fw-bold mb-3 text-white"
                  style={{
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Special Offers
                </h2>
                <p
                  className="special-offers-subtitle lead mb-4 text-white"
                  style={{
                    opacity: "0.9",
                    maxWidth: "700px",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                  }}
                >
                  Exclusive deals and limited-time discounts on premium
                  photography gear
                </p>
                <div
                  className="special-offers-divider mx-auto mb-4"
                  style={{
                    width: "80px",
                    height: "3px",
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </Col>
          </Row>

          {/* Offers Content */}
          {offers.length === 0 ? (
            /* No Offers Placeholder */
            <Row className="justify-content-center">
              <Col lg={8} xl={6}>
                <Card
                  className="no-offers-card border-0 shadow-lg text-center overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                  }}
                >
                  <Card.Body className="p-5">
                    {/* Icon */}
                    <div
                      className="offer-icon-container mb-4"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        boxShadow: "0 8px 32px rgba(220, 53, 69, 0.3)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2.5rem",
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      >
                        🎁
                      </div>
                      <div
                        className="position-absolute"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          border: "2px solid rgba(220, 53, 69, 0.3)",
                          animation: "ripple 3s ease-in-out infinite",
                        }}
                      ></div>
                    </div>

                    {/* Content */}
                    <h3
                      className="h2 fw-bold text-white mb-3"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Exciting Offers Coming Soon!
                    </h3>
                    <p
                      className="lead mb-4 text-white"
                      style={{ opacity: "0.8", lineHeight: "1.6" }}
                    >
                      We're preparing something special for you. Stay tuned for
                      amazing deals, exclusive discounts, and limited-time
                      offers on premium photography equipment.
                    </p>

                    {/* Benefits List */}
                    <Row className="mb-4 text-start">
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "rgba(220, 53, 69, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>💰</span>
                          </div>
                          <span
                            className="text-white"
                            style={{ fontSize: "0.95rem" }}
                          >
                            Up to 50% savings
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "rgba(220, 53, 69, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>⚡</span>
                          </div>
                          <span
                            className="text-white"
                            style={{ fontSize: "0.95rem" }}
                          >
                            Flash deals
                          </span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "rgba(220, 53, 69, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>�</span>
                          </div>
                          <span
                            className="text-white"
                            style={{ fontSize: "0.95rem" }}
                          >
                            Exclusive bundles
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "rgba(220, 53, 69, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>🏷️</span>
                          </div>
                          <span
                            className="text-white"
                            style={{ fontSize: "0.95rem" }}
                          >
                            Member-only prices
                          </span>
                        </div>
                      </Col>
                    </Row>

                    {/* CTA Buttons */}
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                      <Button
                        variant="light"
                        size="lg"
                        className="notify-me-btn px-4 py-3"
                        style={{
                          borderRadius: "50px",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          minWidth: "200px",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                          color: "#1d1d1b",
                          border: "2px solid transparent",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Bell size={18} className="me-2" />
                        Notify Me
                      </Button>
                      <Button
                        variant="outline-light"
                        size="lg"
                        as={Link}
                        to="/products"
                        className="browse-products-btn px-4 py-3"
                        style={{
                          borderRadius: "50px",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          minWidth: "200px",
                          borderWidth: "2px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Browse Products
                        <ArrowRight size={18} className="ms-2" />
                      </Button>
                    </div>

                    {/* Newsletter Signup */}
                    <div
                      className="mt-4 pt-4"
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <p
                        className="small text-white mb-3"
                        style={{ opacity: "0.7" }}
                      >
                        Be the first to know about our special offers
                      </p>
                      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          className="form-control offer-email-input"
                          style={{
                            borderRadius: "25px",
                            border: "2px solid rgba(255, 255, 255, 0.2)",
                            background: "rgba(255, 255, 255, 0.1)",
                            color: "#ffffff",
                            padding: "0.75rem 1.25rem",
                            maxWidth: "300px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Button
                          variant="danger"
                          className="subscribe-offers-btn px-4"
                          style={{
                            borderRadius: "25px",
                            fontWeight: "600",
                            background:
                              "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                            border: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            /* Offers Grid */
            <Row className="g-4">
              {offers.map((product, index) => (
                <Col xs={12} sm={6} lg={4} xl={3} key={product.id}>
                  <Card
                    className={`offer-product-card h-100 border-0 shadow-lg animate-offer-card animate-delay-${
                      index + 1
                    }`}
                  >
                    {/* Product Image Container */}
                    <div className="offer-image-container position-relative overflow-hidden">
                      <Card.Img
                        variant="top"
                        src={
                          product.image
                            ? `http://localhost:8070${product.image}`
                            : "/placeholder-image.jpg"
                        }
                        alt={product.name}
                        className="offer-product-image"
                        style={{
                          height: "260px",
                          objectFit: "contain",
                          objectPosition: "center",
                          backgroundColor: "#f8f9fa",
                          transition: "transform 0.4s ease",
                        }}
                      />

                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <Badge
                            className="discount-badge"
                            style={{
                              background:
                                "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                              fontSize: "0.9rem",
                              fontWeight: "700",
                              padding: "0.5rem 1rem",
                              borderRadius: "20px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
                            }}
                          >
                            -{product.discount}%
                          </Badge>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <Button
                        variant="light"
                        className="offer-wishlist-btn position-absolute top-0 end-0 m-3"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: "0",
                          transform: "translateY(-10px)",
                          transition: "all 0.3s ease",
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart size={18} />
                      </Button>

                      {/* Quick Actions */}
                      <div className="offer-quick-actions position-absolute bottom-0 start-0 end-0 p-3">
                        <div
                          className="d-flex gap-2"
                          style={{
                            opacity: "0",
                            transform: "translateY(20px)",
                            transition: "all 0.3s ease 0.1s",
                          }}
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="flex-fill quick-view-btn"
                            style={{
                              background: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid rgba(29, 29, 27, 0.1)",
                              backdropFilter: "blur(10px)",
                              fontWeight: "500",
                            }}
                          >
                            <Eye size={14} className="me-1" />
                            Quick View
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-fill buy-now-btn"
                            onClick={() => handleViewToBuy(product)}
                            style={{
                              background:
                                "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                              border: "none",
                              fontWeight: "600",
                            }}
                          >
                            <Eye size={14} className="me-1" />
                            View to Buy
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Product Content */}
                    <Card.Body
                      className="offer-product-content p-4"
                      style={{ background: "#ffffff" }}
                    >
                      {/* Rating */}
                      <div className="offer-rating d-flex align-items-center mb-2">
                        <div className="star-rating me-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < product.rating ? "#ffc107" : "none"}
                              color="#ffc107"
                            />
                          ))}
                        </div>
                        <small className="text-muted">
                          ({product.reviews} reviews)
                        </small>
                      </div>

                      {/* Product Title */}
                      <Card.Title
                        className="offer-product-title h6 mb-3"
                        style={{
                          color: "#1d1d1b",
                          fontWeight: "600",
                          lineHeight: "1.4",
                          minHeight: "2.8em",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.name}
                      </Card.Title>

                      {/* Pricing */}
                      <div className="offer-pricing d-flex align-items-center justify-content-between mb-3">
                        <div className="price-container">
                          <span
                            className="offer-current-price fw-bold"
                            style={{
                              color: "#dc3545",
                              fontSize: "1.4rem",
                            }}
                          >
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span
                              className="offer-original-price text-muted ms-2"
                              style={{
                                textDecoration: "line-through",
                                fontSize: "1rem",
                              }}
                            >
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && (
                          <Badge bg="success" className="savings-badge">
                            Save $
                            {(product.originalPrice - product.price).toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      {/* Limited Time Notice */}
                      <div
                        className="limited-time-notice mb-3 p-2 text-center"
                        style={{
                          background: "rgba(220, 53, 69, 0.1)",
                          borderRadius: "8px",
                          border: "1px solid rgba(220, 53, 69, 0.2)",
                        }}
                      >
                        <small className="text-danger fw-semibold">
                          ⏰ Limited Time Offer
                        </small>
                      </div>

                      {/* Main CTA Button */}
                      <Button
                        variant="danger"
                        className="offer-cta-btn w-100"
                        onClick={() => handleViewToBuy(product)}
                        size="lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
                          border: "none",
                          borderRadius: "12px",
                          fontWeight: "700",
                          padding: "0.875rem",
                          fontSize: "1rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        View to Buy - Limited Time
                        <Eye size={18} className="ms-2" />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Bottom CTA Section */}
          <Row
            className="text-center mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <Col>
              <p className="text-white mb-3" style={{ opacity: "0.8" }}>
                Don't miss out on our exclusive deals and flash sales
              </p>
              <Button
                as={Link}
                to="/products?filter=offers"
                variant="outline-light"
                size="lg"
                className="view-all-offers-btn px-5 py-3"
                style={{
                  borderRadius: "50px",
                  borderWidth: "2px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
              >
                View All Offers
                <ChevronRight size={20} className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-5 text-white"
        style={{ backgroundColor: "#1d1d1b" }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4">Stay Updated</h2>
              <p className="lead mb-4" style={{ color: "#e5e7eb" }}>
                Subscribe to get updates on new products, offers, and creative
                tips
              </p>
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="form-control flex-grow-1"
                      style={{ color: "#1d1d1b" }}
                    />
                    <Button
                      variant="light"
                      className="fw-semibold"
                      style={{
                        color: "#1d1d1b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

// Add CSS animations for New Arrivals cards and pagination
const styles = `
  .animate-card {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease;
  }

  .animate-delay-1 {
    animation-delay: 0.1s;
  }

  .animate-delay-2 {
    animation-delay: 0.2s;
  }

  .animate-delay-3 {
    animation-delay: 0.3s;
  }

  .animate-delay-4 {
    animation-delay: 0.4s;
  }

  /* Initial load animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Product card hover effects */
  .new-arrival-card {
    transition: all 0.3s ease;
  }

  .new-arrival-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
  }

  .new-arrival-image {
    transition: transform 0.4s ease;
  }

  .new-arrival-image:hover {
    transform: scale(1.05);
  }

  /* Pagination button animations */
  .pagination-btn:hover:not(:disabled) {
    background-color: #1d1d1b !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(29, 29, 27, 0.3);
  }

  .pagination-number:hover:not(.btn-dark) {
    background-color: #f8f9fa !important;
    color: #1d1d1b !important;
    border-color: #1d1d1b !important;
    transform: translateY(-2px);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Responsive design for pagination */
  @media (max-width: 576px) {
    .pagination-btn {
      min-width: 38px !important;
      height: 38px !important;
    }
    
    .pagination-number {
      min-width: 35px !important;
      height: 35px !important;
      font-size: 0.85rem !important;
    }
  }

  /* Smooth page transition effect */
  .page-transition-enter {
    opacity: 0;
    transform: translateX(30px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.4s ease;
  }

  .page-transition-exit {
    opacity: 1;
    transform: translateX(0);
  }

  .page-transition-exit-active {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.3s ease;
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Home;
