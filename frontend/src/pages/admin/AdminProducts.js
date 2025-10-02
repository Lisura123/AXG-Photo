import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  InputGroup,
  Alert,
  Table,
  Spinner,
  Image,
} from "react-bootstrap";
import { Plus, Search, Filter, Edit, Trash2, Package, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const AdminProducts = () => {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [products, setProducts] = useState([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Get categories and actions from AppContext
  const { categories, setCategories, addCategory } = useApp();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: [],
    category: "",
    subCategory: "",
    brand: "",
    model: "",
    sku: "",
    stockQuantity: 0,
    status: "Active",
    isFeatured: false,
    image: null,
  });

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8070/api";

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory && filterCategory !== "all")
        params.append("category", filterCategory);
      if (filterStatus && filterStatus !== "all")
        params.append("status", filterStatus);
      params.append("limit", "50"); // Get more products for admin view

      const response = await fetch(`${API_BASE}/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        showAlertMessage("Error fetching products", "danger");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlertMessage("Error fetching products", "danger");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterStatus, API_BASE]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [API_BASE, setCategories]);

  // Get categories that match Navbar structure
  const getMainCategories = () => {
    return categories.filter((cat) =>
      [
        "batteries",
        "chargers",
        "card-readers",
        "lens-filters",
        "camera-backpacks",
      ].includes(cat.slug)
    );
  };

  // Get subcategories for Lens Filters
  const getLensFilterSubcategories = () => {
    return categories
      .filter((cat) => cat.slug.includes("mm-filters"))
      .sort((a, b) => parseInt(a.slug) - parseInt(b.slug));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    // Only fetch categories if they haven't been loaded yet
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchProducts, fetchCategories, categories.length]);

  // Show alert message
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  // Add feature to features array
  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()],
      });
      setCurrentFeature("");
    }
  };

  // Remove feature from features array
  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // Create new category
  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    try {
      // Generate slug from name
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const response = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: slug,
          description: `${newCategoryName.trim()} category`,
          sortOrder: categories.length + 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add new category to the global state
        addCategory(data.data);
        // Set the new category as selected
        setFormData({ ...formData, category: data.data._id });
        // Reset new category form
        setNewCategoryName("");
        setShowAddNewCategory(false);
        showAlertMessage("Category created successfully!", "success");
      } else {
        showAlertMessage(data.message || "Failed to create category", "danger");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showAlertMessage("Error creating category", "danger");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      features: [],
      category: "",
      subCategory: "",
      brand: "",
      model: "",
      sku: "",
      stockQuantity: 0,
      status: "Active",
      isFeatured: false,
      image: null,
    });
    setCurrentFeature("");
    setSelectedProduct(null);
    setNewCategoryName("");
    setShowAddNewCategory(false);
  };

  // Handle modal open
  const handleModalOpen = (mode, product = null) => {
    setModalMode(mode);
    if (mode === "edit" && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        features: product.features || [],
        category: product.category?._id || product.category || "",
        subCategory: product.subCategory || "",
        brand: product.brand || "",
        model: product.model || "",
        sku: product.sku || "",
        stockQuantity: product.stockQuantity || 0,
        status: product.status || "Active",
        isFeatured: product.isFeatured || false,
        image: null, // Don't pre-fill image for editing
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "features") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "image" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== "image") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url =
        modalMode === "add"
          ? `${API_BASE}/products`
          : `${API_BASE}/products/${selectedProduct._id}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showAlertMessage(
          `Product ${
            modalMode === "add" ? "created" : "updated"
          } successfully!`,
          "success"
        );
        handleModalClose();
        fetchProducts(); // Refresh the product list
      } else {
        showAlertMessage(data.message || "Error saving product", "danger");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showAlertMessage("Error saving product", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showAlertMessage("Product deleted successfully!", "success");
          fetchProducts(); // Refresh the product list
        } else {
          showAlertMessage(data.message || "Error deleting product", "danger");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        showAlertMessage("Error deleting product", "danger");
      }
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Out of Stock":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div
      className="admin-products"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "1.5rem",
      }}
    >
      {/* Alert */}
      {showAlert && (
        <Alert
          variant={alertType}
          className="mb-4"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
            Product Management
          </h2>
          <p className="mb-0" style={{ color: "#404040" }}>
            Manage your product catalog with full CRUD operations
          </p>
        </div>
        <Button
          onClick={() => handleModalOpen("add")}
          className="d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#404040",
            borderColor: "#404040",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
          }}
        >
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Filters Section */}
      <Card
        className="mb-4"
        style={{
          border: "1px solid rgba(64, 64, 64, 0.1)",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Search size={16} style={{ color: "#404040" }} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: "1px solid #e9ecef" }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ border: "1px solid #e9ecef" }}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ border: "1px solid #e9ecef" }}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button
                variant="outline-secondary"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ borderColor: "#404040", color: "#404040" }}
              >
                <Filter size={16} />
                Filter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card
        style={{
          border: "1px solid rgba(64, 64, 64, 0.1)",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#404040" }} />
              <p className="mt-3" style={{ color: "#404040" }}>
                Loading products...
              </p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #e9ecef",
                }}
              >
                <tr>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Stock
                  </th>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Featured
                  </th>
                  <th
                    style={{
                      color: "#404040",
                      fontWeight: "600",
                      padding: "1rem",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5"
                      style={{ color: "#404040" }}
                    >
                      <Package
                        size={48}
                        className="mb-3"
                        style={{ color: "#404040", opacity: 0.5 }}
                      />
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <Image
                            src={
                              product.image
                                ? `http://localhost:8070${product.image}`
                                : "/api/placeholder/60/60"
                            }
                            alt={product.name}
                            width="60"
                            height="60"
                            className="rounded me-3"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <h6
                              className="mb-1 fw-semibold"
                              style={{ color: "#1d1d1b" }}
                            >
                              {product.name}
                            </h6>
                            <p
                              className="mb-0 small"
                              style={{ color: "#404040" }}
                            >
                              {product.brand} {product.model}
                            </p>
                            <small style={{ color: "#404040" }}>
                              SKU: {product.sku}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span style={{ color: "#1d1d1b" }}>
                          {product.category?.name || "No Category"}
                        </span>
                        {product.subCategory && (
                          <small
                            className="d-block"
                            style={{ color: "#404040" }}
                          >
                            {product.subCategory}
                          </small>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className="fw-semibold"
                          style={{
                            color:
                              product.stockQuantity > 0 ? "#28a745" : "#dc3545",
                          }}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge
                          bg={getStatusVariant(product.status)}
                          className="px-2 py-1"
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {product.isFeatured ? (
                          <Badge bg="info" className="px-2 py-1">
                            Featured
                          </Badge>
                        ) : (
                          <span style={{ color: "#404040" }}>-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleModalOpen("edit", product)}
                            style={{ borderColor: "#404040", color: "#404040" }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa" }}>
          <Modal.Title style={{ color: "#1d1d1b" }}>
            {modalMode === "add" ? "Add New Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Product Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Brand *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter brand name"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Model
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter model"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    SKU *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter SKU"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Description *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter product description"
                style={{ border: "1px solid #e9ecef" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                Features
              </Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Enter a feature"
                  style={{ border: "1px solid #e9ecef" }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  className="ms-2"
                  style={{ backgroundColor: "#404040", borderColor: "#404040" }}
                >
                  Add
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="d-flex align-items-center gap-2 px-3 py-2"
                    style={{ backgroundColor: "#e9ecef", color: "#495057" }}
                  >
                    {feature}
                    <X
                      size={14}
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Category *
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{ border: "1px solid #e9ecef" }}
                  >
                    <option value="">Select Category</option>

                    {/* Main Categories matching Navbar structure */}
                    {getMainCategories().map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}

                    {/* Lens Filter Subcategories */}
                    {getLensFilterSubcategories().length > 0 && (
                      <optgroup label="Lens Filter Sizes">
                        {getLensFilterSubcategories().map((filterCategory) => (
                          <option
                            key={filterCategory._id}
                            value={filterCategory._id}
                          >
                            {filterCategory.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Other categories not in main structure */}
                    {categories.filter(
                      (cat) =>
                        ![
                          "batteries",
                          "chargers",
                          "card-readers",
                          "lens-filters",
                          "camera-backpacks",
                        ].includes(cat.slug) && !cat.slug.includes("mm-filters")
                    ).length > 0 && (
                      <optgroup label="Other Categories">
                        {categories
                          .filter(
                            (cat) =>
                              ![
                                "batteries",
                                "chargers",
                                "card-readers",
                                "lens-filters",
                                "camera-backpacks",
                              ].includes(cat.slug) &&
                              !cat.slug.includes("mm-filters")
                          )
                          .map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Add New Category
                  </Form.Label>
                  {!showAddNewCategory ? (
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowAddNewCategory(true)}
                      className="w-100"
                      style={{
                        borderColor: "#404040",
                        color: "#404040",
                        backgroundColor: "transparent",
                      }}
                    >
                      + Add New Category
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        style={{ border: "1px solid #e9ecef" }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateNewCategory();
                          }
                        }}
                      />
                      <Button
                        onClick={handleCreateNewCategory}
                        disabled={!newCategoryName.trim() || creatingCategory}
                        style={{
                          backgroundColor: "#404040",
                          borderColor: "#404040",
                          minWidth: "60px",
                        }}
                      >
                        {creatingCategory ? <Spinner size="sm" /> : "Add"}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setShowAddNewCategory(false);
                          setNewCategoryName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Create a new category that will be available in both the
                    product form and navbar dropdown.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Stock Quantity *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ border: "1px solid #e9ecef" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#404040", fontWeight: "600" }}>
                    Product Image
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{ border: "1px solid #e9ecef" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                label="Mark as Featured Product"
                style={{ color: "#404040" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleModalClose}
                style={{ borderColor: "#404040", color: "#404040" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: "#404040", borderColor: "#404040" }}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {modalMode === "add" ? "Creating..." : "Updating..."}
                  </>
                ) : modalMode === "add" ? (
                  "Create Product"
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminProducts;
