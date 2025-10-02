import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Nav,
  Badge,
  Spinner,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  User,
  Edit2,
  Save,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  MessageSquare,
  Star,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Alert helper function
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "success" }),
      5000
    );
  };

  // Load user reviews
  const loadUserReviews = useCallback(async () => {
    if (!user?._id) return;

    setReviewsLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(
        `http://localhost:8070/api/users/${user._id}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setUserReviews(data.reviews || []);
      } else {
        console.error("Failed to load reviews:", data.message);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  }, [user?._id]);

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = authService.getToken();
      const response = await fetch("http://localhost:8070/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Profile updated successfully!");
        setEditMode(false);
      } else {
        showAlert(data.message || "Failed to update profile", "danger");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("Failed to update profile. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("New passwords do not match", "danger");
      return;
    }

    setLoading(true);

    try {
      const token = authService.getToken();
      const response = await fetch(
        "http://localhost:8070/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlert("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordModal(false);
      } else {
        showAlert(data.message || "Failed to change password", "danger");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showAlert("Failed to change password. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Load reviews when tab changes
  useEffect(() => {
    if (activeTab === "reviews") {
      loadUserReviews();
    }
  }, [activeTab, user, loadUserReviews]);

  if (!user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h3 style={{ color: "#1d1d1b" }}>
              Please log in to view your profile
            </h3>
            <Button
              onClick={() => navigate("/login")}
              style={{ backgroundColor: "#404040", borderColor: "#404040" }}
            >
              Go to Login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Container className="py-5">
        {/* Alert */}
        {alert.show && (
          <Alert
            variant={alert.type}
            dismissible
            onClose={() =>
              setAlert({ show: false, message: "", type: "success" })
            }
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        <Row>
          <Col lg={4} className="mb-4">
            {/* Profile Card */}
            <Card
              className="border-0 shadow-sm sticky-top"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(64, 64, 64, 0.1)",
                top: "100px",
              }}
            >
              <Card.Body className="text-center p-4">
                {/* Profile Avatar */}
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#404040",
                    borderRadius: "50%",
                    fontSize: "2rem",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User size={32} />
                  )}
                </div>

                {/* User Info */}
                <h4 className="mb-1" style={{ color: "#1d1d1b" }}>
                  {user.name || "User"}
                </h4>
                <p className="text-muted mb-2">{user.email}</p>

                {/* Role Badge */}
                <Badge
                  className="mb-3"
                  style={{
                    backgroundColor:
                      user.role === "admin" ? "#dc3545" : "#28a745",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                  }}
                >
                  <Shield size={14} className="me-1" />
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </Badge>

                {/* Join Date */}
                <div className="text-muted small">
                  <Calendar size={14} className="me-1" />
                  Member since {formatDate(user.createdAt || new Date())}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {/* Navigation Tabs */}
            <Card
              className="border-0 shadow-sm mb-4"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(64, 64, 64, 0.1)",
              }}
            >
              <Card.Body className="p-0">
                <Nav
                  variant="pills"
                  className="p-3"
                  style={{
                    "--bs-nav-pills-border-radius": "12px",
                    "--bs-nav-pills-link-active-bg": "#404040",
                  }}
                >
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "profile"}
                      onClick={() => setActiveTab("profile")}
                      className="d-flex align-items-center"
                      style={{
                        color: activeTab === "profile" ? "#ffffff" : "#404040",
                        backgroundColor:
                          activeTab === "profile" ? "#404040" : "transparent",
                        border: "none",
                      }}
                    >
                      <User size={16} className="me-2" />
                      Profile Details
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "reviews"}
                      onClick={() => setActiveTab("reviews")}
                      className="d-flex align-items-center"
                      style={{
                        color: activeTab === "reviews" ? "#ffffff" : "#404040",
                        backgroundColor:
                          activeTab === "reviews" ? "#404040" : "transparent",
                        border: "none",
                      }}
                    >
                      <MessageSquare size={16} className="me-2" />
                      My Reviews
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(64, 64, 64, 0.1)",
                }}
              >
                <Card.Header
                  className="border-0 pb-0"
                  style={{
                    backgroundColor: "transparent",
                    padding: "1.5rem 1.5rem 0",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ color: "#1d1d1b" }}>
                      Profile Information
                    </h5>
                    <div>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowPasswordModal(true)}
                        style={{ borderColor: "#404040", color: "#404040" }}
                      >
                        <Lock size={16} className="me-1" />
                        Change Password
                      </Button>
                      <Button
                        variant={
                          editMode ? "outline-danger" : "outline-primary"
                        }
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                        style={{
                          borderColor: editMode ? "#dc3545" : "#404040",
                          color: editMode ? "#dc3545" : "#404040",
                        }}
                      >
                        {editMode ? <X size={16} /> : <Edit2 size={16} />}
                        <span className="ms-1">
                          {editMode ? "Cancel" : "Edit"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label
                          style={{ color: "#404040", fontWeight: "600" }}
                        >
                          <User size={16} className="me-2" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          style={{
                            borderRadius: "8px",
                            border: editMode
                              ? "2px solid #e9ecef"
                              : "1px solid #e9ecef",
                            backgroundColor: editMode ? "#ffffff" : "#f8f9fa",
                          }}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label
                          style={{ color: "#404040", fontWeight: "600" }}
                        >
                          <Mail size={16} className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          style={{
                            borderRadius: "8px",
                            border: editMode
                              ? "2px solid #e9ecef"
                              : "1px solid #e9ecef",
                            backgroundColor: editMode ? "#ffffff" : "#f8f9fa",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label
                          style={{ color: "#404040", fontWeight: "600" }}
                        >
                          <Phone size={16} className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          placeholder="Enter your phone number"
                          style={{
                            borderRadius: "8px",
                            border: editMode
                              ? "2px solid #e9ecef"
                              : "1px solid #e9ecef",
                            backgroundColor: editMode ? "#ffffff" : "#f8f9fa",
                          }}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label
                          style={{ color: "#404040", fontWeight: "600" }}
                        >
                          <MapPin size={16} className="me-2" />
                          Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={profileForm.address}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              address: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          placeholder="Enter your address"
                          style={{
                            borderRadius: "8px",
                            border: editMode
                              ? "2px solid #e9ecef"
                              : "1px solid #e9ecef",
                            backgroundColor: editMode ? "#ffffff" : "#f8f9fa",
                          }}
                        />
                      </Col>
                    </Row>

                    {editMode && (
                      <div className="text-end mt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          style={{
                            backgroundColor: "#404040",
                            borderColor: "#404040",
                          }}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-1" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(64, 64, 64, 0.1)",
                }}
              >
                <Card.Header
                  className="border-0 pb-0"
                  style={{
                    backgroundColor: "transparent",
                    padding: "1.5rem 1.5rem 0",
                  }}
                >
                  <h5
                    className="mb-0 d-flex align-items-center"
                    style={{ color: "#1d1d1b" }}
                  >
                    <MessageSquare size={20} className="me-2" />
                    My Reviews ({userReviews.length})
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {reviewsLoading ? (
                    <div className="text-center py-4">
                      <Spinner
                        animation="border"
                        style={{ color: "#404040" }}
                      />
                      <p className="mt-2 text-muted">Loading your reviews...</p>
                    </div>
                  ) : userReviews.length > 0 ? (
                    <div className="space-y-3">
                      {userReviews.map((review) => (
                        <Card
                          key={review._id}
                          className="border-0 mb-3"
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "12px",
                          }}
                        >
                          <Card.Body className="p-3">
                            <Row className="align-items-start">
                              <Col md={8}>
                                <h6
                                  className="mb-2 fw-bold"
                                  style={{ color: "#1d1d1b" }}
                                >
                                  {review.product?.name || "Product"}
                                </h6>
                                <div className="d-flex align-items-center mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={
                                        i < review.rating
                                          ? "text-warning"
                                          : "text-muted"
                                      }
                                      fill={
                                        i < review.rating
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  ))}
                                  <span className="ms-2 text-muted small">
                                    {review.rating}/5
                                  </span>
                                </div>
                                <p
                                  className="mb-2"
                                  style={{ color: "#404040" }}
                                >
                                  {review.comment}
                                </p>
                                <small className="text-muted">
                                  <Calendar size={14} className="me-1" />
                                  {formatDate(review.createdAt)}
                                </small>
                              </Col>
                              <Col md={4} className="text-end">
                                <Badge
                                  style={{
                                    backgroundColor: review.isApproved
                                      ? "#28a745"
                                      : "#ffc107",
                                    color: "#ffffff",
                                    fontSize: "0.75rem",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {review.isApproved ? "Approved" : "Pending"}
                                </Badge>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <MessageSquare size={48} className="text-muted mb-3" />
                      <h5 style={{ color: "#1d1d1b" }}>No Reviews Yet</h5>
                      <p className="text-muted">
                        You haven't written any reviews yet. Start shopping to
                        leave your first review!
                      </p>
                      <Button
                        style={{
                          backgroundColor: "#404040",
                          borderColor: "#404040",
                        }}
                        onClick={() => navigate("/products")}
                      >
                        Browse Products
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Change Password Modal */}
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          centered
        >
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#ffffff",
              borderBottom: "1px solid rgba(64, 64, 64, 0.1)",
            }}
          >
            <Modal.Title style={{ color: "#1d1d1b" }}>
              <Lock size={20} className="me-2" />
              Change Password
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handlePasswordSubmit}>
            <Modal.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                  Current Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      paddingRight: "45px",
                    }}
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    style={{
                      border: "none",
                      background: "none",
                      color: "#6c757d",
                    }}
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                  New Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      paddingRight: "45px",
                    }}
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    style={{
                      border: "none",
                      background: "none",
                      color: "#6c757d",
                    }}
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                  Confirm New Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      paddingRight: "45px",
                    }}
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    style={{
                      border: "none",
                      background: "none",
                      color: "#6c757d",
                    }}
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid rgba(64, 64, 64, 0.1)",
              }}
            >
              <Button
                variant="outline-secondary"
                onClick={() => setShowPasswordModal(false)}
                style={{ borderColor: "#404040", color: "#404040" }}
              >
                <X size={16} className="me-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#404040", borderColor: "#404040" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-1" />
                    Change Password
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default UserProfile;
