import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  Pagination,
  InputGroup,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  Star,
  Eye,
  Trash2,
  Search,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  Clock,
} from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [totalReviews, setTotalReviews] = useState(0);
  const [statistics, setStatistics] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0,
  });

  const API_BASE = "http://localhost:8070/api";
  const reviewsPerPage = 10;

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Fetch all reviews
  const fetchAllReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/reviews`);
      const data = await response.json();

      if (data.success) {
        let filteredReviews = data.data;

        // Apply client-side filtering
        if (searchTerm) {
          filteredReviews = filteredReviews.filter(
            (review) =>
              review.product?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              review.user?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (statusFilter !== "all") {
          filteredReviews = filteredReviews.filter((review) => {
            if (statusFilter === "approved") return review.approved === true;
            if (statusFilter === "pending") return review.approved === null;
            if (statusFilter === "rejected") return review.approved === false;
            return true;
          });
        }

        if (ratingFilter !== "all") {
          filteredReviews = filteredReviews.filter(
            (review) => review.rating === parseInt(ratingFilter)
          );
        }

        // Calculate statistics
        const stats = {
          total: data.data.length,
          approved: data.data.filter((r) => r.approved === true).length,
          pending: data.data.filter((r) => r.approved === null).length,
          rejected: data.data.filter((r) => r.approved === false).length,
          averageRating:
            data.data.length > 0
              ? data.data.reduce((sum, r) => sum + r.rating, 0) /
                data.data.length
              : 0,
        };
        setStatistics(stats);

        // Apply pagination
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const paginatedReviews = filteredReviews.slice(
          startIndex,
          startIndex + reviewsPerPage
        );

        setReviews(paginatedReviews);
        setTotalReviews(filteredReviews.length);
      } else {
        showAlertMessage(data.message || "Error fetching reviews", "danger");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showAlertMessage("Error loading reviews", "danger");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, ratingFilter]);

  // Delete review
  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading({ ...actionLoading, [selectedReview._id]: true });
      const authToken = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_BASE}/reviews/${selectedReview._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlertMessage("Review deleted successfully", "success");
        setShowDeleteModal(false);
        setSelectedReview(null);
        fetchAllReviews();
      } else {
        showAlertMessage(data.message || "Error deleting review", "danger");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showAlertMessage("Error deleting review", "danger");
    } finally {
      setActionLoading({ ...actionLoading, [selectedReview._id]: false });
      setShowDeleteModal(false);
      setSelectedReview(null);
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (rating) => {
    setRatingFilter(rating);
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < rating ? "#ffc107" : "none"}
        color={index < rating ? "#ffc107" : "#ddd"}
      />
    ));
  };

  // Get status badge variant
  const getStatusVariant = (isApproved) => {
    if (isApproved === true) return "success";
    if (isApproved === false) return "danger";
    return "warning";
  };

  // Get status text
  const getStatusText = (isApproved) => {
    if (isApproved === true) return "Approved";
    if (isApproved === false) return "Rejected";
    return "Pending";
  };

  // Pagination
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 style={{ color: "#1d1d1b" }}>
              <MessageSquare className="me-2" />
              Review Management
            </h2>
            <Button
              variant="outline-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} className="me-2" />
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert
          variant={alertType}
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <MessageSquare size={32} className="text-primary mb-2" />
              <h4 className="mb-1">{statistics.total}</h4>
              <small className="text-muted">Total Reviews</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <CheckCircle size={32} className="text-success mb-2" />
              <h4 className="mb-1">{statistics.approved}</h4>
              <small className="text-muted">Approved</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Clock size={32} className="text-warning mb-2" />
              <h4 className="mb-1">{statistics.pending}</h4>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Star size={32} className="text-info mb-2" />
              <h4 className="mb-1">
                {statistics.averageRating?.toFixed(1) || "0.0"}
              </h4>
              <small className="text-muted">Avg Rating</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by product, customer, or comment..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="mb-3">
          <ButtonGroup className="w-100">
            <Button
              variant={statusFilter === "all" ? "primary" : "outline-primary"}
              onClick={() => handleStatusFilterChange("all")}
            >
              All Status
            </Button>
            <Button
              variant={
                statusFilter === "approved" ? "success" : "outline-success"
              }
              onClick={() => handleStatusFilterChange("approved")}
            >
              Approved
            </Button>
            <Button
              variant={
                statusFilter === "pending" ? "warning" : "outline-warning"
              }
              onClick={() => handleStatusFilterChange("pending")}
            >
              Pending
            </Button>
          </ButtonGroup>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Select
            value={ratingFilter}
            onChange={(e) => handleRatingFilterChange(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Reviews Table */}
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" className="me-2" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <MessageSquare size={48} className="mb-3" />
              <h5>No reviews found</h5>
              <p>No reviews match your current filters.</p>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td>
                        <div>
                          <strong
                            className="text-truncate d-block"
                            style={{ maxWidth: "200px" }}
                          >
                            {review.product?.name || "Unknown Product"}
                          </strong>
                          <small className="text-muted">
                            ID: {review.product?._id}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{review.user?.name || "Unknown User"}</strong>
                          <br />
                          <small className="text-muted">
                            {review.user?.email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {renderStars(review.rating)}
                          <span className="ms-2">{review.rating}</span>
                        </div>
                      </td>
                      <td>
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                          title={review.comment}
                        >
                          {review.comment}
                        </div>
                      </td>
                      <td>
                        <small>{formatDate(review.createdAt)}</small>
                      </td>
                      <td>
                        <Badge variant={getStatusVariant(review.approved)}>
                          {getStatusText(review.approved)}
                        </Badge>
                      </td>
                      <td>
                        <ButtonGroup size="sm">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Details</Tooltip>}
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedReview(review);
                                setShowViewModal(true);
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete</Tooltip>}
                          >
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                setSelectedReview(review);
                                setShowDeleteModal(true);
                              }}
                              disabled={actionLoading[review._id]}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </OverlayTrigger>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>{paginationItems}</Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* View Review Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <Row>
              <Col md={6}>
                <h6>Product Information</h6>
                <p>
                  <strong>Name:</strong> {selectedReview.product?.name}
                </p>
                <p>
                  <strong>ID:</strong> {selectedReview.product?._id}
                </p>

                <h6 className="mt-3">Customer Information</h6>
                <p>
                  <strong>Name:</strong> {selectedReview.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedReview.user?.email}
                </p>
              </Col>
              <Col md={6}>
                <h6>Review Information</h6>
                <p>
                  <strong>Rating:</strong> {renderStars(selectedReview.rating)}{" "}
                  ({selectedReview.rating}/5)
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedReview.createdAt)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge variant={getStatusVariant(selectedReview.approved)}>
                    {getStatusText(selectedReview.approved)}
                  </Badge>
                </p>
              </Col>
              <Col xs={12} className="mt-3">
                <h6>Comment</h6>
                <Card className="bg-light">
                  <Card.Body>
                    <p className="mb-0">{selectedReview.comment}</p>
                  </Card.Body>
                </Card>

                {selectedReview.adminNotes && (
                  <>
                    <h6 className="mt-3">Admin Notes</h6>
                    <Card className="bg-warning bg-opacity-10 border-warning">
                      <Card.Body>
                        <p className="mb-0">{selectedReview.adminNotes}</p>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          {selectedReview && (
            <Card className="bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  {renderStars(selectedReview.rating)}
                  <span className="ms-2">by {selectedReview.user?.name}</span>
                </div>
                <p className="mb-0 text-truncate">{selectedReview.comment}</p>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteReview}
            disabled={selectedReview && actionLoading[selectedReview._id]}
          >
            {selectedReview && actionLoading[selectedReview._id] ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} className="me-2" />
                Delete Review
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminReviews;
