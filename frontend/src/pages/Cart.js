import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  InputGroup,
  Form,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Lock,
  Truck,
  Gift,
  Tag,
} from "lucide-react";

// Import local images for demo
import cameraBackpack1 from "../assets/images/camera-backpack-1.jpg";
import canonBattery from "../assets/images/canon-battery.jpg";
import lensFilter from "../assets/images/lens-filter.jpg";

const Cart = () => {
  // Add custom styles for cart enhancements
  React.useEffect(() => {
    const styleId = "cart-custom-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .cart-item-row:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .cart-item-row {
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        .quantity-btn:hover {
          background-color: #404040 !important;
          color: #ffffff !important;
          border-color: #404040 !important;
        }
        .remove-btn:hover {
          transform: scale(1.1);
          transition: all 0.2s ease;
        }
        .cart-card {
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border: 1px solid #f0f0f0 !important;
        }
        .cart-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
        }
        .order-summary-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .order-summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        }
        .pricing-breakdown .pricing-label {
          transition: color 0.3s ease;
        }
        .pricing-breakdown div:hover .pricing-label {
          color: #1d1d1b !important;
        }
        .total-section {
          transition: all 0.3s ease;
        }
        .total-section:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(64, 64, 64, 0.1);
        }
        .checkout-btn:active {
          transform: translateY(-1px) scale(0.98) !important;
        }
        .free-shipping-alert {
          transition: all 0.3s ease;
        }
        .free-shipping-alert:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Mock cart data for demo
  const mockCartItems = [
    {
      id: 1,
      name: "Professional Camera Backpack",
      price: 149.99,
      quantity: 1,
      image: cameraBackpack1,
      category: "Photography",
      inStock: true,
    },
    {
      id: 2,
      name: "Canon Rechargeable Battery",
      price: 89.99,
      quantity: 2,
      image: canonBattery,
      category: "Photography",
      inStock: true,
    },
    {
      id: 3,
      name: "Premium Lens Filter Set",
      price: 79.99,
      quantity: 1,
      image: lensFilter,
      category: "Photography",
      inStock: true,
    },
  ];

  useEffect(() => {
    // Simulate loading cart items
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    showAlertMessage("Quantity updated successfully", "info");
  };

  const removeItem = (id) => {
    const itemName = cartItems.find((item) => item.id === id)?.name;
    setCartItems((items) => items.filter((item) => item.id !== id));
    showAlertMessage(`${itemName} removed from cart`, "warning");
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getShippingCost = () => {
    const subtotal = getTotalPrice();
    return subtotal >= 100 ? 0 : 9.99;
  };

  const getTax = () => {
    return getTotalPrice() * 0.08; // 8% tax
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTax() - discount;
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(getTotalPrice() * 0.1);
      showAlertMessage("Promo code applied! 10% discount", "success");
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(20);
      showAlertMessage("Welcome discount applied! $20 off", "success");
    } else {
      showAlertMessage("Invalid promo code", "danger");
    }
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "76px" }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#1d1d1b" }} />
          <p className="mt-3 text-muted">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        style={{ paddingTop: "76px", backgroundColor: "#ffffff" }}
        className="min-vh-100"
      >
        <Container className="py-5">
          <div className="text-center py-5">
            <ShoppingBag
              size={80}
              className="mb-4"
              style={{ color: "#404040" }}
            />
            <h1 className="display-5 fw-bold mb-4" style={{ color: "#1d1d1b" }}>
              Your Cart is Empty
            </h1>
            <p className="lead mb-4" style={{ color: "#404040" }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              as={Link}
              to="/products"
              size="lg"
              className="d-inline-flex align-items-center gap-2"
              style={{
                backgroundColor: "#1d1d1b",
                borderColor: "#1d1d1b",
                color: "#ffffff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#404040";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(29, 29, 27, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1d1d1b";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <ArrowLeft size={20} />
              Continue Shopping
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
        <Row className="mb-5">
          <Col>
            <h1 className="display-6 fw-bold mb-2" style={{ color: "#1d1d1b" }}>
              Shopping Cart
            </h1>
            <p style={{ color: "#404040", fontSize: "1.1rem" }}>
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in
              your cart
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="cart-card border-0 mb-4">
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead
                    style={{
                      backgroundColor: "#fafafa",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <tr>
                      <th
                        className="border-0 py-4 ps-4 fw-semibold"
                        style={{ color: "#1d1d1b", fontSize: "0.95rem" }}
                      >
                        Product
                      </th>
                      <th
                        className="border-0 py-4 text-center fw-semibold"
                        style={{ color: "#1d1d1b", fontSize: "0.95rem" }}
                      >
                        Quantity
                      </th>
                      <th
                        className="border-0 py-4 text-end fw-semibold"
                        style={{ color: "#1d1d1b", fontSize: "0.95rem" }}
                      >
                        Price
                      </th>
                      <th
                        className="border-0 py-4 text-end fw-semibold"
                        style={{ color: "#1d1d1b", fontSize: "0.95rem" }}
                      >
                        Total
                      </th>
                      <th className="border-0 py-4 pe-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="cart-item-row border-bottom">
                        <td className="py-4 ps-4">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="me-3"
                              style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #f0f0f0",
                              }}
                            />
                            <div>
                              <h6
                                className="mb-1 fw-semibold"
                                style={{ color: "#1d1d1b" }}
                              >
                                {item.name}
                              </h6>
                              <small style={{ color: "#404040" }}>
                                Category: {item.category}
                              </small>
                              <br />
                              <Badge
                                className="mt-2"
                                style={{
                                  backgroundColor: item.inStock
                                    ? "#28a745"
                                    : "#dc3545",
                                  color: "#ffffff",
                                  borderRadius: "12px",
                                  padding: "4px 8px",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {item.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <InputGroup
                            style={{ width: "130px", margin: "0 auto" }}
                          >
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="quantity-btn"
                              style={{
                                borderColor: "#404040",
                                color: "#404040",
                                transition: "all 0.3s ease",
                              }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </Button>
                            <Form.Control
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="text-center fw-semibold"
                              size="sm"
                              style={{
                                borderColor: "#404040",
                                backgroundColor: "#ffffff",
                                color: "#1d1d1b",
                              }}
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="quantity-btn"
                              style={{
                                borderColor: "#404040",
                                color: "#404040",
                                transition: "all 0.3s ease",
                              }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </Button>
                          </InputGroup>
                        </td>
                        <td className="py-4 text-end">
                          <span
                            className="fw-semibold"
                            style={{ color: "#1d1d1b", fontSize: "1.05rem" }}
                          >
                            ${item.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 text-end">
                          <span
                            className="fw-bold"
                            style={{ color: "#1d1d1b", fontSize: "1.1rem" }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 pe-4 text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="remove-btn"
                            style={{
                              borderColor: "#dc3545",
                              color: "#dc3545",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              transition: "all 0.2s ease",
                            }}
                            onClick={() => removeItem(item.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#dc3545";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#dc3545";
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Promo Code */}
            <Card className="cart-card border-0">
              <Card.Body>
                <h6
                  className="mb-3 fw-semibold d-flex align-items-center"
                  style={{ color: "#1d1d1b" }}
                >
                  <Tag
                    size={18}
                    className="me-2"
                    style={{ color: "#404040" }}
                  />
                  Apply Promo Code
                </h6>
                <Row className="g-2">
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter promo code (try: SAVE10 or WELCOME20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        borderColor: "#e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#404040")}
                      onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    />
                  </Col>
                  <Col sm={4}>
                    <Button
                      className="w-100"
                      style={{
                        backgroundColor: "#404040",
                        borderColor: "#404040",
                        color: "#ffffff",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onClick={applyPromoCode}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1d1d1b";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#404040";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card
              className="order-summary-card border-0 sticky-top"
              style={{
                top: "100px",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                border: "1px solid #f0f0f0",
                backgroundColor: "#ffffff",
              }}
            >
              <Card.Body className="p-0">
                {/* Header Section */}
                <div
                  className="p-4 border-bottom"
                  style={{
                    backgroundColor: "#fafafa",
                    borderRadius: "16px 16px 0 0",
                    borderBottom: "1px solid rgba(64, 64, 64, 0.1)",
                  }}
                >
                  <h4
                    className="mb-0 fw-bold d-flex align-items-center"
                    style={{
                      color: "#1d1d1b",
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <CreditCard
                      size={24}
                      className="me-3"
                      style={{ color: "#404040" }}
                    />
                    Order Summary
                  </h4>
                </div>

                {/* Pricing Breakdown */}
                <div className="pricing-breakdown p-4">
                  {/* Subtotal */}
                  <div className="d-flex justify-content-between align-items-center py-3">
                    <span
                      className="pricing-label"
                      style={{
                        color: "#404040",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="pricing-value fw-semibold"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "0.95rem",
                      }}
                    >
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="d-flex justify-content-between align-items-center py-3">
                    <span
                      className="pricing-label"
                      style={{
                        color: "#404040",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Shipping
                    </span>
                    <span
                      className="pricing-value fw-semibold"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {getShippingCost() === 0 ? (
                        <span
                          className="fw-bold"
                          style={{
                            color: "#28a745",
                            fontSize: "0.9rem",
                          }}
                        >
                          FREE
                        </span>
                      ) : (
                        <span style={{ color: "#1d1d1b" }}>
                          ${getShippingCost().toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="d-flex justify-content-between align-items-center py-3">
                    <span
                      className="pricing-label"
                      style={{
                        color: "#404040",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Tax (8%)
                    </span>
                    <span
                      className="pricing-value fw-semibold"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "0.95rem",
                      }}
                    >
                      ${getTax().toFixed(2)}
                    </span>
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div className="d-flex justify-content-between align-items-center py-3">
                      <span
                        className="pricing-label fw-medium"
                        style={{
                          color: "#28a745",
                          fontSize: "0.9rem",
                        }}
                      >
                        Discount Applied
                      </span>
                      <span
                        className="pricing-value fw-bold"
                        style={{
                          color: "#28a745",
                          fontSize: "0.95rem",
                        }}
                      >
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <hr
                    style={{
                      borderColor: "rgba(64, 64, 64, 0.2)",
                      margin: "1.5rem 0 1rem",
                      opacity: "0.5",
                    }}
                  />

                  {/* Total */}
                  <div
                    className="total-section d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "12px",
                      padding: "20px",
                      border: "2px solid rgba(64, 64, 64, 0.1)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <span
                      className="fw-bold"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.1rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Total
                    </span>
                    <span
                      className="fw-bold"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.4rem",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ${getFinalTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Alert and Actions */}
                <div className="p-4 pt-0">
                  {getTotalPrice() < 100 && (
                    <div
                      className="free-shipping-alert mb-4"
                      style={{
                        backgroundColor: "#fff7ed",
                        border: "1px solid rgba(64, 64, 64, 0.15)",
                        borderRadius: "10px",
                        padding: "16px 20px",
                        textAlign: "center",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <Truck
                          size={20}
                          className="me-2"
                          style={{ color: "#404040" }}
                        />
                        <span
                          className="fw-semibold"
                          style={{
                            color: "#1d1d1b",
                            fontSize: "0.9rem",
                          }}
                        >
                          Almost there!
                        </span>
                      </div>
                      <p
                        className="mb-0"
                        style={{ fontSize: "0.85rem", color: "#404040" }}
                      >
                        Add{" "}
                        <strong style={{ color: "#1d1d1b" }}>
                          ${(100 - getTotalPrice()).toFixed(2)}
                        </strong>{" "}
                        more for{" "}
                        <strong style={{ color: "#28a745" }}>
                          FREE shipping
                        </strong>
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="checkout-actions d-grid gap-3">
                    {/* Primary Checkout Button */}
                    <Button
                      size="lg"
                      className="checkout-btn d-flex align-items-center justify-content-center gap-3"
                      style={{
                        backgroundColor: "#404040",
                        borderColor: "#404040",
                        color: "#ffffff",
                        borderRadius: "14px",
                        padding: "18px 32px",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        letterSpacing: "-0.01em",
                        boxShadow: "0 4px 16px rgba(64, 64, 64, 0.15)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1d1d1b";
                        e.currentTarget.style.transform =
                          "translateY(-3px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 25px rgba(29, 29, 27, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#404040";
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 16px rgba(64, 64, 64, 0.15)";
                      }}
                    >
                      <Lock size={20} style={{ opacity: 0.9 }} />
                      <span>Secure Checkout</span>
                      <CreditCard size={20} style={{ opacity: 0.9 }} />
                    </Button>

                    {/* Secondary Continue Shopping Button */}
                    <Button
                      as={Link}
                      to="/products"
                      variant="link"
                      className="continue-shopping-btn d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      style={{
                        color: "#1d1d1b",
                        padding: "12px 24px",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                        border: "2px solid transparent",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#404040";
                        e.currentTarget.style.backgroundColor =
                          "rgba(64, 64, 64, 0.05)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.borderColor =
                          "rgba(64, 64, 64, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#1d1d1b";
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <ArrowLeft size={18} />
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </Card.Body>

              {/* Trust Badges */}
              <Card.Footer
                className="border-0 p-4"
                style={{
                  backgroundColor: "#fafafa",
                  borderRadius: "0 0 16px 16px",
                  borderTop: "1px solid rgba(64, 64, 64, 0.1)",
                }}
              >
                <Row className="text-center g-2">
                  <Col xs={4} className="mb-2">
                    <div
                      className="d-flex flex-column align-items-center"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Lock
                        size={24}
                        className="mb-2"
                        style={{ color: "#404040" }}
                      />
                      <small className="fw-medium" style={{ color: "#1d1d1b" }}>
                        Secure Payment
                      </small>
                    </div>
                  </Col>
                  <Col xs={4} className="mb-2">
                    <div
                      className="d-flex flex-column align-items-center"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Truck
                        size={24}
                        className="mb-2"
                        style={{ color: "#404040" }}
                      />
                      <small className="fw-medium" style={{ color: "#1d1d1b" }}>
                        Free Shipping
                      </small>
                    </div>
                  </Col>
                  <Col xs={4} className="mb-2">
                    <div
                      className="d-flex flex-column align-items-center"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Gift
                        size={24}
                        className="mb-2"
                        style={{ color: "#404040" }}
                      />
                      <small className="fw-medium" style={{ color: "#1d1d1b" }}>
                        Gift Wrapping
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
