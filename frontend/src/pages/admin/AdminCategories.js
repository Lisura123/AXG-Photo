import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  InputGroup,
  Table,
  Alert,
  Spinner,
  Container,
} from "react-bootstrap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  Tag,
} from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
    sortOrder: 0,
  });

  // Backend API base URL
  const API_BASE_URL = "http://localhost:8070/api";

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        showAlertMessage("Error fetching categories", "danger");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showAlertMessage("Failed to load categories", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parentCategory: "",
      sortOrder: 0,
    });
    setSelectedCategory(null);
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    if (mode === "edit" && category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || "",
        description: category.description || "",
        parentCategory: category.parentCategory?._id || "",
        sortOrder: category.sortOrder || 0,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url =
        modalMode === "add"
          ? `${API_BASE_URL}/categories`
          : `${API_BASE_URL}/categories/${selectedCategory._id}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      // Prepare data
      const submitData = {
        ...formData,
        parentCategory: formData.parentCategory || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        showAlertMessage(
          `Category ${
            modalMode === "add" ? "created" : "updated"
          } successfully!`,
          "success"
        );
        fetchCategories(); // Refresh the list
        handleCloseModal();
      } else {
        showAlertMessage(data.message || "Error saving category", "danger");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      showAlertMessage("Failed to save category", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/categories/${categoryId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (data.success) {
          showAlertMessage("Category deleted successfully!", "success");
          fetchCategories(); // Refresh the list
        } else {
          showAlertMessage(data.message || "Error deleting category", "danger");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        showAlertMessage("Failed to delete category", "danger");
      }
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Separate main categories and subcategories
  const mainCategories = filteredCategories.filter(
    (cat) => !cat.parentCategory
  );
  const subCategories = filteredCategories.filter((cat) => cat.parentCategory);

  return (
    <Container
      fluid
      className="admin-categories"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2" style={{ color: "#1d1d1b" }}>
            Category Management
          </h1>
          <p className="mb-0" style={{ color: "#404040" }}>
            Organize your products with categories and subcategories
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal("add")}
          className="d-flex align-items-center gap-2"
          style={{ backgroundColor: "#404040", borderColor: "#404040" }}
        >
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      {/* Alert */}
      {showAlert && (
        <Alert
          variant={alertType}
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Search */}
      <Card
        className="mb-4 border-0"
        style={{ boxShadow: "0 2px 10px rgba(64,64,64,0.1)" }}
      >
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text
                  style={{ backgroundColor: "#f8f9fa", borderColor: "#404040" }}
                >
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderColor: "#404040" }}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center justify-content-end">
                <Badge
                  bg="secondary"
                  className="px-3 py-2 me-3"
                  style={{ backgroundColor: "#404040" }}
                >
                  {mainCategories.length} Main Categories
                </Badge>
                <Badge
                  bg="info"
                  className="px-3 py-2"
                  style={{ backgroundColor: "#17a2b8" }}
                >
                  {subCategories.length} Subcategories
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Categories Tables */}
      <Row>
        {/* Main Categories */}
        <Col lg={7} className="mb-4">
          <Card
            className="border-0"
            style={{ boxShadow: "0 2px 10px rgba(64,64,64,0.1)" }}
          >
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #404040",
              }}
            >
              <h5 className="mb-0 fw-semibold" style={{ color: "#1d1d1b" }}>
                <Folder size={20} className="me-2" />
                Main Categories
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <Spinner animation="border" variant="secondary" />
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th
                        style={{
                          color: "#404040",
                          fontWeight: "600",
                          padding: "1rem",
                        }}
                      >
                        Name
                      </th>
                      <th style={{ color: "#404040", fontWeight: "600" }}>
                        Description
                      </th>
                      <th style={{ color: "#404040", fontWeight: "600" }}>
                        Sort Order
                      </th>
                      <th
                        style={{
                          color: "#404040",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainCategories.map((category) => (
                      <tr key={category._id}>
                        <td style={{ padding: "1rem" }}>
                          <div className="d-flex align-items-center">
                            <FolderOpen
                              size={20}
                              className="me-2"
                              style={{ color: "#404040" }}
                            />
                            <div>
                              <div
                                className="fw-semibold"
                                style={{ color: "#1d1d1b" }}
                              >
                                {category.name}
                              </div>
                              <small style={{ color: "#6c757d" }}>
                                {category.slug}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{ color: "#404040", verticalAlign: "middle" }}
                        >
                          {category.description || "No description"}
                        </td>
                        <td
                          style={{ color: "#404040", verticalAlign: "middle" }}
                        >
                          {category.sortOrder}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleOpenModal("edit", category)}
                              style={{
                                borderColor: "#404040",
                                color: "#404040",
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(category._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {mainCategories.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4"
                          style={{ color: "#6c757d" }}
                        >
                          No main categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Subcategories */}
        <Col lg={5}>
          <Card
            className="border-0"
            style={{ boxShadow: "0 2px 10px rgba(64,64,64,0.1)" }}
          >
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #17a2b8",
              }}
            >
              <h5 className="mb-0 fw-semibold" style={{ color: "#1d1d1b" }}>
                <Tag size={20} className="me-2" />
                Subcategories
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <Spinner animation="border" variant="info" />
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th
                        style={{
                          color: "#404040",
                          fontWeight: "600",
                          padding: "1rem",
                        }}
                      >
                        Name
                      </th>
                      <th style={{ color: "#404040", fontWeight: "600" }}>
                        Parent
                      </th>
                      <th
                        style={{
                          color: "#404040",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map((category) => (
                      <tr key={category._id}>
                        <td style={{ padding: "1rem" }}>
                          <div className="d-flex align-items-center">
                            <Tag
                              size={16}
                              className="me-2"
                              style={{ color: "#17a2b8" }}
                            />
                            <div>
                              <div
                                className="fw-semibold"
                                style={{ color: "#1d1d1b" }}
                              >
                                {category.name}
                              </div>
                              <small style={{ color: "#6c757d" }}>
                                {category.slug}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{ color: "#404040", verticalAlign: "middle" }}
                        >
                          <Badge
                            bg="secondary"
                            style={{ backgroundColor: "#6c757d" }}
                          >
                            {category.parentCategory?.name || "None"}
                          </Badge>
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleOpenModal("edit", category)}
                              style={{
                                borderColor: "#17a2b8",
                                color: "#17a2b8",
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(category._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {subCategories.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-4"
                          style={{ color: "#6c757d" }}
                        >
                          No subcategories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #404040",
            }}
          >
            <Modal.Title style={{ color: "#1d1d1b" }}>
              {modalMode === "add" ? "Add New Category" : "Edit Category"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Category Name *
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter category name"
                style={{ borderColor: "#404040" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                style={{ borderColor: "#404040" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Parent Category
              </Form.Label>
              <Form.Select
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleInputChange}
                style={{ borderColor: "#404040" }}
              >
                <option value="">None (Main Category)</option>
                {mainCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Leave empty to create a main category, or select a parent to
                create a subcategory.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Sort Order
              </Form.Label>
              <Form.Control
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                style={{ borderColor: "#404040" }}
              />
              <Form.Text className="text-muted">
                Lower numbers appear first in listings.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer
            style={{
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #404040",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: "#404040", borderColor: "#404040" }}
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  {modalMode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : modalMode === "add" ? (
                "Create Category"
              ) : (
                "Update Category"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCategories;
