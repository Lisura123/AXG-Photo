import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import { Star, MessageSquare } from "lucide-react";

const AddReviewForm = ({
  productId,
  onReviewAdded,
  currentUser,
  existingReview = null,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const API_BASE = "http://localhost:8070/api";

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters long";
    }

    if (formData.comment.length > 500) {
      newErrors.comment = "Comment cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!currentUser) {
      showAlert("Please log in to add a review", "danger");
      return;
    }

    setSubmitting(true);

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product: productId,
          rating: formData.rating,
          comment: formData.comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Review added successfully!", "success");
        setFormData({ rating: 0, comment: "" });
        setShowModal(false);
        if (onReviewAdded) {
          onReviewAdded(data.data);
        }
      } else {
        showAlert(data.message || "Error adding review", "danger");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      showAlert("Error adding review. Please try again.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: "" });
  };

  const handleCommentChange = (e) => {
    setFormData({ ...formData, comment: e.target.value });
    setErrors({ ...errors, comment: "" });
  };

  if (!currentUser) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-4">
          <MessageSquare size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Want to leave a review?</h5>
          <p className="text-muted mb-3">
            Please log in to share your experience with this product.
          </p>
          <Button
            href="/login"
            style={{ backgroundColor: "#1d1d1b", borderColor: "#1d1d1b" }}
          >
            Log In to Review
          </Button>
        </Card.Body>
      </Card>
    );
  }

  if (existingReview) {
    return (
      <Alert variant="info" className="mb-4">
        <strong>You have already reviewed this product.</strong>
        <br />
        You can edit or delete your existing review below.
      </Alert>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0" style={{ color: "#1d1d1b" }}>
              Share Your Experience
            </h5>
            <Button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "#1d1d1b", borderColor: "#1d1d1b" }}
              className="d-flex align-items-center"
            >
              <Star size={16} className="me-2" />
              Write a Review
            </Button>
          </div>
          <p className="text-muted mb-0">
            Help other customers by sharing your thoughts about this product.
          </p>
        </Card.Body>
      </Card>

      {/* Add Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {alert.show && (
              <Alert
                variant={alert.type}
                dismissible
                onClose={() => setAlert({ show: false, message: "", type: "" })}
              >
                {alert.message}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Rating *</Form.Label>
              <div className="d-flex gap-1 mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={28}
                    fill={index < formData.rating ? "#ffc107" : "none"}
                    color={index < formData.rating ? "#ffc107" : "#ddd"}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => handleRatingClick(index + 1)}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                ))}
              </div>
              {formData.rating > 0 && (
                <small className="text-success">
                  Selected: {formData.rating}/5 stars
                </small>
              )}
              {errors.rating && (
                <div className="text-danger small mt-1">{errors.rating}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Your Review *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={formData.comment}
                onChange={handleCommentChange}
                placeholder="Share your experience with this product. What did you like or dislike? How was the quality and performance?"
                maxLength={500}
                isInvalid={!!errors.comment}
              />
              <div className="d-flex justify-content-between align-items-center mt-1">
                <Form.Text className="text-muted">
                  Minimum 10 characters required
                </Form.Text>
                <Form.Text className="text-muted">
                  {formData.comment.length}/500 characters
                </Form.Text>
              </div>
              {errors.comment && (
                <Form.Control.Feedback type="invalid">
                  {errors.comment}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Alert variant="light" className="border">
              <small className="text-muted">
                <strong>Review Guidelines:</strong>
                <br />
                • Be honest and helpful to other customers
                <br />
                • Focus on the product's features, quality, and performance
                <br />
                • Avoid inappropriate language or personal information
                <br />• Your review will be visible to other customers after
                approval
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || formData.rating === 0}
              style={{ backgroundColor: "#1d1d1b", borderColor: "#1d1d1b" }}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Star size={16} className="me-2" />
                  Submit Review
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddReviewForm;
