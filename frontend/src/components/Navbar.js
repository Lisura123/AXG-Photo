import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Heart,
  User,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/axg-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    wishlistItems = [],
    notifications = [],
    categories = [],
    setCategories,
  } = useApp();

  const wishlistItemsCount = wishlistItems.length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8070/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Only fetch if categories haven't been loaded yet
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, setCategories]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
    <BootstrapNavbar
      expand="lg"
      fixed="top"
      className="custom-navbar"
      style={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.9)",
        boxShadow: scrolled
          ? "0 2px 15px rgba(0,0,0,0.1)"
          : "0 2px 10px rgba(0,0,0,0.05)",
        border: scrolled
          ? "1px solid rgba(233, 236, 239, 0.8)"
          : "1px solid #e9ecef",
        backdropFilter: scrolled ? "blur(15px)" : "blur(10px)",
        minHeight: "70px",
        transition: "all 0.3s ease",
      }}
    >
      <Container fluid className="px-3 px-md-4">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Brand Logo */}
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="fw-bold d-flex align-items-center"
            style={{
              color: "#1d1d1b",
              textDecoration: "none",
              fontSize: "1.8rem",
            }}
          >
            <img
              src={logo}
              alt="AXG"
              width="80"
              height="80"
              className="me-2 rounded"
            />

            {user?.role === "admin" &&
              !location.pathname.startsWith("/admin") && (
                <span
                  className="ms-2 text-white bg-secondary rounded px-2 py-1"
                  style={{ fontSize: "0.6rem", fontWeight: "normal" }}
                >
                  Admin View
                </span>
              )}
          </BootstrapNavbar.Brand>

          {/* Center Section: Search + Navigation */}
          <div className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-center">
            {/* Search Bar */}
            <Form
              onSubmit={handleSearchSubmit}
              className="search-form me-4"
              style={{ maxWidth: "400px" }}
            >
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search cameras, lenses, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    border: `2px solid ${
                      searchFocused ? "#1d1d1b" : "#e9ecef"
                    }`,
                    borderRight: "none",
                    borderRadius: "50px 0 0 50px",
                    paddingLeft: "20px",
                    fontSize: "0.95rem",
                    height: "45px",
                    boxShadow: searchFocused
                      ? "0 0 0 0.2rem rgba(29, 29, 27, 0.25)"
                      : "none",
                  }}
                />
                <Button
                  type="submit"
                  style={{
                    backgroundColor: searchFocused ? "#1d1d1b" : "#404040",
                    border: `2px solid ${
                      searchFocused ? "#1d1d1b" : "#404040"
                    }`,
                    borderLeft: "none",
                    borderRadius: "0 50px 50px 0",
                    padding: "0 15px",
                    height: "45px",
                  }}
                >
                  <Search size={18} />
                </Button>
              </div>
            </Form>

            {/* Navigation Links */}
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link-animated ${
                  location.pathname === "/" ? "active" : ""
                }`}
                style={{
                  color: "#1d1d1b",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                Home
              </Nav.Link>

              <Dropdown className="me-3 products-dropdown">
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="d-flex align-items-center nav-link-animated"
                  style={{
                    color: "#1d1d1b",
                    fontWeight: "500",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Products <ChevronDown size={16} className="ms-1" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="products-dropdown-menu">
                  {/* Main Categories */}
                  {categories
                    .filter((cat) =>
                      [
                        "batteries",
                        "chargers",
                        "card-readers",
                        "camera-backpacks",
                      ].includes(cat.slug)
                    )
                    .map((category) => (
                      <Dropdown.Item
                        key={category._id}
                        as={Link}
                        to={`/products?category=${category.slug}`}
                        className="dropdown-item-custom"
                      >
                        {category.name}
                      </Dropdown.Item>
                    ))}

                  {/* Lens Filters with Sub-dropdown */}
                  {categories.find((cat) => cat.slug === "lens-filters") && (
                    <div className="dropdown-submenu-container">
                      <Dropdown.Item
                        as={Link}
                        to={`/products?category=lens-filters`}
                        className="dropdown-item-custom dropdown-item-with-submenu"
                      >
                        Lens Filters
                        <ChevronDown size={12} className="submenu-arrow ms-2" />
                      </Dropdown.Item>
                      <div className="dropdown-submenu">
                        {categories
                          .filter((cat) => cat.slug.includes("mm-filters"))
                          .sort((a, b) => parseInt(a.slug) - parseInt(b.slug))
                          .map((filterCategory) => (
                            <Dropdown.Item
                              key={filterCategory._id}
                              as={Link}
                              to={`/products?category=${filterCategory.slug}`}
                              className="dropdown-item-custom dropdown-subitem"
                            >
                              {filterCategory.name.replace(" Filters", "")}
                            </Dropdown.Item>
                          ))}
                      </div>
                    </div>
                  )}

                  <hr className="dropdown-divider" />

                  <Dropdown.Item
                    as={Link}
                    to="/products"
                    className="dropdown-item-custom dropdown-view-all"
                  >
                    <strong>View All</strong>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link
                as={Link}
                to="/about"
                className={`nav-link-animated ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                style={{
                  color: "#1d1d1b",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                About
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contact"
                className={`nav-link-animated ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
                style={{
                  color: "#1d1d1b",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                Contact
              </Nav.Link>
            </Nav>
          </div>

          {/* Right Section: Icons */}
          <div className="d-flex align-items-center">
            {/* Notifications */}
            {isAuthenticated && (
              <Dropdown className="me-3">
                <Dropdown.Toggle
                  as="div"
                  className="nav-action-icon position-relative action-icon-animated"
                  style={{ cursor: "pointer" }}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span
                      className="position-absolute rounded-pill d-flex align-items-center justify-content-center"
                      style={{
                        top: "4px",
                        right: "4px",
                        backgroundColor: "#ff4757",
                        fontSize: "0.65rem",
                        minWidth: "16px",
                        height: "16px",
                        color: "white",
                      }}
                    >
                      {notifications.length}
                    </span>
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            )}

            {/* Wishlist */}
            <a
              href="/wishlist"
              onClick={handleWishlistClick}
              className="nav-action-icon position-relative me-3 action-icon-animated"
              style={{ color: "#1d1d1b" }}
            >
              <Heart size={20} />
              {wishlistItemsCount > 0 && (
                <span
                  className="position-absolute rounded-pill d-flex align-items-center justify-content-center"
                  style={{
                    top: "4px",
                    right: "4px",
                    backgroundColor: "#1d1d1b",
                    fontSize: "0.65rem",
                    minWidth: "16px",
                    height: "16px",
                    color: "white",
                  }}
                >
                  {wishlistItemsCount}
                </span>
              )}
            </a>

            {/* View to Buy */}
            <Link
              to="/view-to-buy"
              className="nav-action-icon position-relative me-3 action-icon-animated"
              style={{ color: "#1d1d1b" }}
              title="View Products to Buy"
            >
              <Eye size={20} />
            </Link>

            {/* User Account */}
            <Dropdown>
              <Dropdown.Toggle
                as="div"
                className="nav-action-icon action-icon-animated"
                style={{ cursor: "pointer", color: "#1d1d1b" }}
              >
                <User size={20} />
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="fw-semibold">
                            {user?.fullName ||
                              `${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`.trim() ||
                              "User"}
                          </div>
                          {user?.role === "admin" && (
                            <span
                              className="text-white bg-primary rounded px-2 py-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                      <small className="text-muted">{user?.email}</small>
                    </div>
                    <Dropdown.Item as={Link} to="/profile">
                      <User size={16} className="me-2" />
                      My Profile
                    </Dropdown.Item>
                    {user?.role === "admin" && (
                      <>
                        {location.pathname.startsWith("/admin") ? (
                          <Dropdown.Item as={Link} to="/">
                            View Main Site
                          </Dropdown.Item>
                        ) : (
                          <Dropdown.Item as={Link} to="/admin">
                            Admin Panel
                          </Dropdown.Item>
                        )}
                      </>
                    )}
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/login">
                      Login
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/signup">
                      Sign Up
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline-secondary"
              className="d-lg-none ms-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <BootstrapNavbar.Collapse in={isMenuOpen}>
          <div className="d-lg-none mt-3">
            {/* Mobile Search */}
            <Form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="dark" className="ms-2">
                  <Search size={16} />
                </Button>
              </div>
            </Form>

            {/* Mobile Nav Links */}
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Nav.Link>

              {/* Products Section with Categories */}
              <div className="mobile-products-section">
                <div
                  className="fw-bold text-dark px-3 py-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  Products
                </div>

                {/* Main Categories */}
                {categories
                  .filter((cat) =>
                    [
                      "batteries",
                      "chargers",
                      "card-readers",
                      "camera-backpacks",
                    ].includes(cat.slug)
                  )
                  .map((category) => (
                    <Nav.Link
                      key={category._id}
                      as={Link}
                      to={`/products?category=${category.slug}`}
                      className="ps-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Nav.Link>
                  ))}

                {/* Lens Filters */}
                {categories.find((cat) => cat.slug === "lens-filters") && (
                  <Nav.Link
                    as={Link}
                    to={`/products?category=lens-filters`}
                    className="ps-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lens Filters
                  </Nav.Link>
                )}

                {/* Lens Filter Sub-items */}
                {categories
                  .filter((cat) => cat.slug.includes("mm-filters"))
                  .sort((a, b) => parseInt(a.slug) - parseInt(b.slug))
                  .map((filterCategory) => (
                    <Nav.Link
                      key={filterCategory._id}
                      as={Link}
                      to={`/products?category=${filterCategory.slug}`}
                      className="ps-5 mobile-subitem"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ fontSize: "0.9rem", color: "#666" }}
                    >
                      • {filterCategory.name.replace(" Filters", "")}
                    </Nav.Link>
                  ))}

                <Nav.Link
                  as={Link}
                  to="/products"
                  className="ps-4 fw-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All
                </Nav.Link>
              </div>

              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Nav.Link>
            </Nav>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

// Add CSS styles for dropdown and sub-dropdown functionality
const styles = `
  .products-dropdown-menu {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border: none;
    border-radius: 12px;
    padding: 8px;
    min-width: 220px;
  }

  .dropdown-item-custom {
    padding: 10px 16px;
    margin: 2px 0;
    border-radius: 8px;
    transition: all 0.3s ease;
    color: #1d1d1b !important;
    text-decoration: none !important;
    font-weight: 500;
  }

  .dropdown-item-custom:hover,
  .dropdown-item-custom:focus {
    background-color: #f8f9fa;
    color: #1d1d1b !important;
    transform: translateX(4px);
  }

  .dropdown-view-all {
    border-top: 1px solid #e9ecef;
    margin-top: 8px;
    padding-top: 12px;
  }

  /* Sub-dropdown container */
  .dropdown-submenu-container {
    position: relative;
  }

  .dropdown-item-with-submenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .submenu-arrow {
    transform: rotate(-90deg);
    transition: transform 0.3s ease;
  }

  .dropdown-submenu-container:hover .submenu-arrow {
    transform: rotate(0deg);
  }

  /* Sub-dropdown menu */
  .dropdown-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 4px;
    min-width: 120px;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    z-index: 1050;
  }

  .dropdown-submenu-container:hover .dropdown-submenu {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .dropdown-subitem {
    padding: 8px 12px !important;
    font-size: 0.9rem;
    color: #666 !important;
  }

  .dropdown-subitem:hover {
    background-color: #f8f9fa;
    color: #1d1d1b !important;
    transform: translateX(2px);
  }

  /* Mobile responsiveness */
  @media (max-width: 991px) {
    .dropdown-submenu {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      box-shadow: none;
      background: #f8f9fa;
      margin-left: 16px;
      margin-top: 4px;
      border-left: 2px solid #1d1d1b;
    }

    .dropdown-submenu-container:hover .submenu-arrow {
      transform: rotate(90deg);
    }
  }

  /* Enhanced hover animations for desktop */
  @media (min-width: 992px) {
    .products-dropdown:hover .products-dropdown-menu {
      display: block;
    }

    .dropdown-item-custom {
      position: relative;
      overflow: hidden;
    }

    .dropdown-item-custom::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(29, 29, 27, 0.1), transparent);
      transition: left 0.5s;
    }

    .dropdown-item-custom:hover::before {
      left: 100%;
    }
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleId = "navbar-dropdown-styles";
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}

export default Navbar;
