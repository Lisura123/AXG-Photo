import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/axg-logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/wishlist");
    } else {
      navigate("/login", {
        state: { message: "Please log in to view your wishlist" },
      });
    }
  };

  return (
    <footer className="text-white" style={{ backgroundColor: "#1d1d1b" }}>
      <Container className="py-5">
        <Row className="g-4">
          {/* Brand Section */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <Link to="/" className="d-inline-block mb-3">
                <img
                  src={logo}
                  alt="AXG"
                  height="40"
                  style={{ filter: "invert(1)" }}
                />
              </Link>
              <h5 className="fw-bold mb-3" style={{ color: "#e5e7eb" }}>
                POWER YOUR CREATIVITY
              </h5>
              <p className="small mb-4" style={{ color: "#9ca3af" }}>
                Premium photography accessories and equipment for creative
                professionals and enthusiasts.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="https://facebook.com/axgstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none d-inline-flex align-items-center justify-content-center rounded-circle social-icon"
                  style={{
                    color: "#9ca3af",
                    width: "40px",
                    height: "40px",
                    border: "1px solid #404040",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com/axgstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none d-inline-flex align-items-center justify-content-center rounded-circle social-icon"
                  style={{
                    color: "#9ca3af",
                    width: "40px",
                    height: "40px",
                    border: "1px solid #404040",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://twitter.com/axgstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none d-inline-flex align-items-center justify-content-center rounded-circle social-icon"
                  style={{
                    color: "#9ca3af",
                    width: "40px",
                    height: "40px",
                    border: "1px solid #404040",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={3} sm={6}>
            <h5 className="fw-semibold mb-4" style={{ color: "#ffffff" }}>
              Quick Links
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <a
                  href="/wishlist"
                  onClick={handleWishlistClick}
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Wishlist
                </a>
              </li>
            </ul>
          </Col>

          {/* Categories */}
          <Col lg={3} md={3} sm={6}>
            <h5 className="fw-semibold mb-4" style={{ color: "#ffffff" }}>
              Categories
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/products?category=batteries"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Batteries
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=chargers"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Chargers
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=card-readers"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Card Readers
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=lens-filters"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Lens Filters
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=camera-backpacks"
                  className="text-decoration-none small footer-link"
                  style={{ color: "#9ca3af" }}
                >
                  Camera Backpacks
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={12}>
            <h5 className="fw-semibold mb-4" style={{ color: "#ffffff" }}>
              Contact Info
            </h5>
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center me-3 rounded-circle"
                  style={{
                    width: "35px",
                    height: "35px",
                    backgroundColor: "#404040",
                  }}
                >
                  <Mail size={16} style={{ color: "#ffffff" }} />
                </div>
                <span className="small" style={{ color: "#9ca3af" }}>
                  info@axg.com
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Section */}
        <hr className="my-5" style={{ borderColor: "#404040" }} />
        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="small mb-0" style={{ color: "#9ca3af" }}>
              © 2025 AXG. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex flex-wrap justify-content-md-end gap-4">
              <button
                type="button"
                className="btn btn-link text-decoration-none small footer-link p-0"
                style={{ color: "#9ca3af", border: "none" }}
                onClick={() => window.alert("Privacy Policy page coming soon!")}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="btn btn-link text-decoration-none small footer-link p-0"
                style={{ color: "#9ca3af", border: "none" }}
                onClick={() =>
                  window.alert("Terms of Service page coming soon!")
                }
              >
                Terms of Service
              </button>
              <button
                type="button"
                className="btn btn-link text-decoration-none small footer-link p-0"
                style={{ color: "#9ca3af", border: "none" }}
                onClick={() => window.alert("Return Policy page coming soon!")}
              >
                Return Policy
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
