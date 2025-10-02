import React, { useState } from "react";
import { Card, Button, Form, Modal, Badge, Alert } from "react-bootstrap";
import { Star, Edit, Trash2, Calendar } from "lucide-react";

const ReviewCard = ({
  review,
  currentUser,
  onEdit,
  onDelete,
  showProductInfo = false,
  isAdmin = false,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    comment: review.comment || "",
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < rating ? "#ffc107" : "none"}
        color={index < rating ? "#ffc107" : "#ddd"}
      />
    ));
  };

  const handleEdit = () => {
    setEditData({
      rating: review.rating,
      comment: review.comment || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    onEdit(review._id, editData);
    setShowEditModal(false);
  };

  const canEditOrDelete =
    (currentUser && currentUser._id === review.user._id) || isAdmin;

  return (
    <>
      <Card className="mb-3 review-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f8f9fa",
                  color: "#404040",
                  fontWeight: "600",
                }}
              >
                {review.user?.firstName?.charAt(0)}
                {review.user?.lastName?.charAt(0)}
              </div>
              <div>
                <h6 className="mb-1" style={{ color: "#1d1d1b" }}>
                  {review.user?.firstName} {review.user?.lastName}
                </h6>
                <div className="d-flex align-items-center mb-1">
                  {renderStars(review.rating)}
                  <span className="ms-2 text-muted small">
                    {review.rating}/5
                  </span>
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <Calendar size={12} className="me-1" />
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>

            {canEditOrDelete && (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleEdit}
                  title="Edit Review"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(review._id)}
                  title="Delete Review"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </div>

          {showProductInfo && review.product && (
            <div className="mb-3">
              <small className="text-muted">Product: </small>
              <Badge bg="primary" className="mb-2">
                {review.product.name}
              </Badge>
            </div>
          )}

          {review.comment && (
            <p className="mb-2" style={{ color: "#333" }}>
              {review.comment}
            </p>
          )}

          {!review.isApproved && (
            <Alert variant="warning" className="mb-0 mt-2">
              <small>This review is pending approval.</small>
            </Alert>
          )}

          {review.adminNotes && isAdmin && (
            <Alert variant="info" className="mb-0 mt-2">
              <small>
                <strong>Admin Notes:</strong> {review.adminNotes}
              </small>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Edit Review Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating *</Form.Label>
              <div className="d-flex gap-1 mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={24}
                    fill={index < editData.rating ? "#ffc107" : "none"}
                    color={index < editData.rating ? "#ffc107" : "#ddd"}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setEditData({ ...editData, rating: index + 1 })
                    }
                  />
                ))}
              </div>
              <small className="text-muted">
                Selected: {editData.rating}/5 stars
              </small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editData.comment}
                onChange={(e) =>
                  setEditData({ ...editData, comment: e.target.value })
                }
                placeholder="Share your experience with this product..."
                maxLength={500}
              />
              <Form.Text className="text-muted">
                {editData.comment.length}/500 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#1d1d1b", borderColor: "#1d1d1b" }}
            onClick={handleSaveEdit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .review-card {
          transition: all 0.2s ease-in-out;
          border: 1px solid #dee2e6;
        }
        .review-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

export default ReviewCard;
