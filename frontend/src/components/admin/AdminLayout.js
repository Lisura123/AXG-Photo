import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Menu,
  LogOut,
  Settings,
  Bell,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  Container,
  Nav,
  Navbar,
  Badge,
  Dropdown,
  Button,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/login");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if logout fails
      navigate("/login");
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#404040" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const sidebarItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      path: "/admin/products",
      icon: <Package size={20} />,
      label: "Products",
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Users",
    },
    {
      path: "/admin/reviews",
      icon: <MessageSquare size={20} />,
      label: "Reviews",
    },
  ];

  return (
    <div className="admin-layout">
      {/* Top Navigation */}
      <Navbar
        expand="lg"
        className="admin-navbar border-bottom"
        style={{
          backgroundColor: "#ffffff",
          height: "70px",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "1030",
        }}
      >
        <Container fluid className="px-4">
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              className="admin-menu-btn p-0 me-3 d-lg-none"
              onClick={toggleSidebar}
              style={{ border: "none", color: "#404040" }}
            >
              <Menu size={24} />
            </Button>

            <Navbar.Brand
              as={Link}
              to="/admin/dashboard"
              className="fw-bold d-flex align-items-center"
              style={{ color: "#1d1d1b", textDecoration: "none" }}
            >
              <div
                className="admin-logo-icon rounded me-2"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1d1d1b",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                AXG
              </div>
              <span className="d-none d-sm-inline">Admin Panel</span>
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Notifications */}
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="admin-notification-btn position-relative p-0"
                style={{ border: "none", color: "#404040" }}
              >
                <Bell size={20} />
                <Badge
                  bg="danger"
                  className="position-absolute"
                  style={{
                    top: "0",
                    right: "0",
                    fontSize: "0.6rem",
                  }}
                >
                  3
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item>New order received</Dropdown.Item>
                <Dropdown.Item>Low stock alert</Dropdown.Item>
                <Dropdown.Item>User registration</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Admin Profile */}
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="admin-profile-btn d-flex align-items-center"
                style={{
                  border: "none",
                  color: "#404040",
                  textDecoration: "none",
                }}
              >
                <div
                  className="admin-avatar rounded-circle me-2"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#1d1d1b",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="d-none d-md-inline fw-medium">
                  {user?.name || "Admin"}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/">
                  <ExternalLink size={16} className="me-2" />
                  View Main Site
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Settings size={16} className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <LogOut size={16} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div
        className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
        style={{
          position: "fixed",
          top: "70px",
          left: sidebarOpen ? "0" : "-280px",
          width: "280px",
          height: "calc(100vh - 70px)",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e9ecef",
          transition: "left 0.3s ease",
          zIndex: "1020",
          overflowY: "auto",
        }}
      >
        <div className="p-3">
          <Nav className="flex-column admin-nav">
            {sidebarItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`admin-nav-link d-flex align-items-center py-3 px-3 mb-1 ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
                style={{
                  color: isActive(item.path) ? "#1d1d1b" : "#404040",
                  backgroundColor: isActive(item.path)
                    ? "#f8f9fa"
                    : "transparent",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span className="me-3">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay position-fixed"
          style={{
            top: "70px",
            left: "0",
            width: "100vw",
            height: "calc(100vh - 70px)",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: "1019",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className="admin-main-content"
        style={{
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Outlet />
      </div>

      {/* Global Styles */}
      <style>
        {`
          .admin-navbar .navbar-brand:hover {
            color: #404040 !important;
          }
          
          .admin-nav-link:hover {
            background-color: #f8f9fa !important;
            color: #1d1d1b !important;
          }
          
          .admin-profile-btn:focus,
          .admin-notification-btn:focus {
            box-shadow: none !important;
          }
          
          .dropdown-toggle::after {
            display: none;
          }
          
          @media (max-width: 991.98px) {
            .admin-sidebar {
              box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminLayout;
