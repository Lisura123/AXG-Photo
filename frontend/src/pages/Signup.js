import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axgLogo from "../assets/images/axg-logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for name fields - allow only text characters
    let processedValue = value;
    if (name === "firstName" || name === "lastName") {
      // Allow letters, spaces, hyphens, and apostrophes only
      processedValue = value.replace(/[^a-zA-Z\s'-]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }

    // Hide alert when user starts typing
    if (showAlert) {
      setShowAlert(false);
    }
  };

  // Real-time form validation
  useEffect(() => {
    const isValid =
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      formData.email.length > 0 &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      formData.phone.trim().length > 0;
    setIsFormValid(isValid);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName =
        "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName =
        "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    return newErrors;
  };

  const handleFormValidation = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Show alert for missing fields
      const missingFields = [];
      if (newErrors.firstName) missingFields.push("First Name");
      if (newErrors.lastName) missingFields.push("Last Name");
      if (newErrors.email) missingFields.push("Email");
      if (newErrors.password) missingFields.push("Password");
      if (newErrors.confirmPassword) missingFields.push("Confirm Password");
      if (newErrors.phone) missingFields.push("Phone");

      setAlertType("danger");
      setAlertMessage(
        `Please complete the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      setShowAlert(true);

      // Auto-hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      handleFormValidation(e);
      return;
    }

    try {
      // Clear previous errors
      clearError();
      setErrors({});

      // Prepare data for registration
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      };

      // Call register function from AuthContext
      await register(registrationData);

      // Show success message
      setAlertType("success");
      setAlertMessage(
        "Account created successfully! Welcome to AXG Photography!"
      );
      setShowAlert(true);

      // Redirect to dashboard or home after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);

      // Handle validation errors from backend
      if (
        error.message.includes("validation") ||
        error.message.includes("Validation")
      ) {
        setAlertType("danger");
        setAlertMessage(error.message);
        setShowAlert(true);
      } else {
        setAlertType("danger");
        setAlertMessage(
          error.message || "Registration failed. Please try again."
        );
        setShowAlert(true);
      }
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const texts = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return { strength, text: texts[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ paddingTop: "76px", backgroundColor: "#ffffff" }}
    >
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          {/* Left Side - Optional Image/Brand Panel */}
          <Col lg={6} className="d-none d-lg-block">
            <div className="text-center">
              <img
                src={axgLogo}
                alt="AXG Photography"
                height="80"
                className="mb-4"
              />
              <h2
                className="display-4 fw-bold mb-4"
                style={{ color: "#1d1d1b" }}
              >
                Join AXG
              </h2>
              <p
                className="lead"
                style={{
                  color: "#404040",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                Create your account and start exploring the world of photography
                gear with our premium collection.
              </p>
            </div>
          </Col>

          {/* Right Side - Signup Form */}
          <Col lg={6} xl={5}>
            <Card
              className="signup-card border-0"
              style={{
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(29, 29, 27, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Card.Body className="p-5">
                {/* Mobile Logo */}
                <div className="text-center mb-4 d-lg-none">
                  <img
                    src={axgLogo}
                    alt="AXG Photography"
                    height="60"
                    className="mb-3"
                  />
                </div>

                {/* Form Header */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2" style={{ color: "#1d1d1b" }}>
                    Sign Up
                  </h3>
                  <p style={{ color: "#404040", fontSize: "0.95rem" }}>
                    Create your account to get started.
                  </p>
                </div>

                {/* Alert Messages */}
                {showAlert && (
                  <Alert
                    variant={alertType}
                    dismissible
                    onClose={() => setShowAlert(false)}
                    className="d-flex align-items-center gap-2 mb-4"
                    style={{
                      borderRadius: "12px",
                      border: "none",
                    }}
                  >
                    {alertType === "success" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <Row className="mb-4">
                    {/* First Name Field */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="fw-medium mb-2"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          First Name *
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#e9ecef",
                              borderRight: "none",
                              color: "#404040",
                            }}
                          >
                            <User size={18} />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            isInvalid={!!errors.firstName}
                            autoComplete="given-name"
                            style={{
                              borderLeft: "none",
                              fontSize: "0.95rem",
                              padding: "12px 16px",
                              borderColor: errors.firstName
                                ? "#dc3545"
                                : "#dee2e6",
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    {/* Last Name Field */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="fw-medium mb-2"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          Last Name *
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#e9ecef",
                              borderRight: "none",
                              color: "#404040",
                            }}
                          >
                            <User size={18} />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            isInvalid={!!errors.lastName}
                            autoComplete="family-name"
                            style={{
                              borderLeft: "none",
                              fontSize: "0.95rem",
                              padding: "12px 16px",
                              borderColor: errors.lastName
                                ? "#dc3545"
                                : "#dee2e6",
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email Field */}
                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-medium mb-2"
                      style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                    >
                      Email Address
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e9ecef",
                          borderRight: "none",
                          color: "#404040",
                        }}
                      >
                        <Mail size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        isInvalid={!!errors.email}
                        autoComplete="email"
                        style={{
                          borderLeft: "none",
                          fontSize: "0.95rem",
                          padding: "12px 16px",
                          borderColor: errors.email ? "#dc3545" : "#dee2e6",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-semibold"
                      style={{ color: "#1d1d1b" }}
                    >
                      Password
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderColor: "#dee2e6",
                        }}
                      >
                        <Lock size={20} style={{ color: "#6c757d" }} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        autoComplete="new-password"
                        className="signup-input"
                        style={{
                          borderColor: errors.password ? "#dc3545" : "#dee2e6",
                        }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderColor: "#dee2e6" }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} style={{ color: "#6c757d" }} />
                        ) : (
                          <Eye size={20} style={{ color: "#6c757d" }} />
                        )}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <ProgressBar
                          className="mb-2"
                          style={{ height: "3px", borderRadius: "2px" }}
                        >
                          <ProgressBar
                            now={(passwordStrength.strength / 5) * 100}
                            variant={
                              passwordStrength.strength <= 2
                                ? "danger"
                                : passwordStrength.strength <= 3
                                ? "warning"
                                : passwordStrength.strength <= 4
                                ? "info"
                                : "success"
                            }
                          />
                        </ProgressBar>
                        <small
                          className="d-block mb-2"
                          style={{ color: "#404040", fontSize: "0.85rem" }}
                        >
                          Password strength: {passwordStrength.text}
                        </small>
                      </div>
                    )}
                  </Form.Group>

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-semibold"
                      style={{ color: "#1d1d1b" }}
                    >
                      Confirm Password
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderColor: "#dee2e6",
                        }}
                      >
                        <Lock size={20} style={{ color: "#6c757d" }} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        isInvalid={!!errors.confirmPassword}
                        autoComplete="new-password"
                        className="signup-input"
                        style={{
                          borderColor: errors.confirmPassword
                            ? "#dc3545"
                            : "#dee2e6",
                        }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{ borderColor: "#dee2e6" }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} style={{ color: "#6c757d" }} />
                        ) : (
                          <Eye size={20} style={{ color: "#6c757d" }} />
                        )}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Phone Field */}
                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-semibold"
                      style={{ color: "#1d1d1b" }}
                    >
                      Phone Number
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderColor: "#dee2e6",
                        }}
                      >
                        <Phone size={20} style={{ color: "#6c757d" }} />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        isInvalid={!!errors.phone}
                        style={{
                          borderColor: "#dee2e6",
                          fontSize: "1rem",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1d1d1b";
                          e.target.style.boxShadow =
                            "0 0 0 0.2rem rgba(29, 29, 27, 0.25)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#dee2e6";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    onClick={!isFormValid ? handleFormValidation : undefined}
                    className="w-100 d-flex align-items-center justify-content-center gap-2 signup-submit-btn"
                    style={{
                      backgroundColor:
                        isLoading || !isFormValid ? "#6c757d" : "#1d1d1b",
                      borderColor:
                        isLoading || !isFormValid ? "#6c757d" : "#1d1d1b",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      cursor: !isFormValid ? "pointer" : "default",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        {isFormValid ? (
                          <CheckCircle size={18} />
                        ) : (
                          <AlertCircle size={18} />
                        )}
                        {isFormValid ? "Sign Up" : "Check Required Fields"}
                      </>
                    )}
                  </Button>

                  {/* Helper Text */}
                  {!isFormValid && (
                    <div className="text-center mt-2">
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Fill out all required fields above to activate the Sign
                        Up button
                      </small>
                    </div>
                  )}
                </Form>

                {/* Login Link */}
                <div
                  className="text-center mt-4 pt-3"
                  style={{ borderTop: "1px solid #dee2e6" }}
                >
                  <p className="mb-0 text-muted">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold login-link"
                      style={{ color: "#1d1d1b" }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
