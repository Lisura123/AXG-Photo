import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/axg-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      formData.email.length > 0 &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 6;
    setIsFormValid(isValid);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Clear previous errors
      clearError();
      setErrors({});

      // Prepare data for login
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      // Call login function from AuthContext
      await login(loginData);

      // Show success message
      setAlertType("success");
      setAlertMessage("Login successful! Welcome back.");
      setShowAlert(true);

      // Redirect to dashboard or home after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);

      // Handle login errors from backend
      setAlertType("danger");
      setAlertMessage(
        error.message ||
          "Login failed. Please check your credentials and try again."
      );
      setShowAlert(true);
    }
  };

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
                src={logo}
                alt="AXG Photography"
                height="80"
                className="mb-4"
              />
              <h2
                className="display-4 fw-bold mb-4"
                style={{ color: "#1d1d1b" }}
              >
                Welcome Back
              </h2>
              <p
                className="lead"
                style={{
                  color: "#404040",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                Sign in to access your photography gear collection and continue
                your creative journey.
              </p>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={6} xl={5}>
            <Card
              className="login-card border-0"
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
                    src={logo}
                    alt="AXG Photography"
                    height="60"
                    className="mb-3"
                  />
                </div>

                {/* Form Header */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2" style={{ color: "#1d1d1b" }}>
                    Sign In
                  </h3>
                  <p style={{ color: "#404040", fontSize: "0.95rem" }}>
                    Welcome back! Please enter your details.
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
                        autoComplete="current-password"
                        className="login-input"
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
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      className="login-checkbox"
                      style={{ color: "#6c757d" }}
                    />
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none small login-link p-0"
                      style={{ color: "#1d1d1b" }}
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading || !isFormValid}
                    className="w-100 d-flex align-items-center justify-content-center gap-2 login-submit-btn"
                    style={{
                      backgroundColor:
                        isLoading || !isFormValid ? "#6c757d" : "#1d1d1b",
                      borderColor:
                        isLoading || !isFormValid ? "#6c757d" : "#1d1d1b",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        {isFormValid && <CheckCircle size={18} />}
                        {isFormValid ? "Sign in" : "Complete all fields"}
                      </>
                    )}
                  </Button>
                </Form>

                {/* Divider */}
                <div className="my-4">
                  <hr className="my-4" />
                  <div className="text-center">
                    <span
                      className="px-3 small text-muted"
                      style={{ backgroundColor: "white" }}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <Row className="g-3">
                  <Col xs={6}>
                    <Button
                      variant="outline-secondary"
                      className="w-100 d-flex align-items-center justify-content-center gap-2 social-login-btn"
                      style={{ borderColor: "#dee2e6" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="small">Google</span>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-secondary"
                      className="w-100 d-flex align-items-center justify-content-center gap-2 social-login-btn"
                      style={{ borderColor: "#dee2e6" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="small">Facebook</span>
                    </Button>
                  </Col>
                </Row>

                {/* Sign Up Link */}
                <div
                  className="text-center mt-4 pt-3"
                  style={{ borderTop: "1px solid #dee2e6" }}
                >
                  <p className="mb-0 text-muted">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-decoration-none fw-semibold signup-link"
                      style={{ color: "#1d1d1b" }}
                    >
                      Sign Up
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

export default Login;
