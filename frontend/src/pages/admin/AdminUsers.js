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
  Dropdown,
  Alert,
  Table,
  Spinner,
  Pagination,
} from "react-bootstrap";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Users,
  Activity,
  Shield,
} from "lucide-react";

const AdminUsers = () => {
  const API_BASE = "http://localhost:8070/api";

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);

  // Statistics
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    usersByRole: [],
    recentRegistrations: 0,
  });

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const roles = [
    { value: "customer", label: "Customer" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
  ];

  // API Functions
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        showAlertMessage(
          "Authentication token not found. Please login again.",
          "danger"
        );
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
        role: filterRole !== "all" ? filterRole : "",
        status: filterStatus !== "all" ? filterStatus : "",
        sortBy,
        sortOrder,
      });

      const response = await fetch(`${API_BASE}/users?${params}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.totalItems || 0);
      } else {
        console.error("API Error:", data);
        showAlertMessage(data.message || "Error fetching users", "danger");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlertMessage(`Error fetching users: ${error.message}`, "danger");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    usersPerPage,
    searchTerm,
    filterRole,
    filterStatus,
    sortBy,
    sortOrder,
  ]);

  const fetchUserStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      console.log("Fetching stats from test endpoint...");

      const response = await fetch(`${API_BASE}/test-users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Stats data received:", data.data);
        setUserStats(
          data.data || {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            usersByRole: [],
            recentRegistrations: 0,
          }
        );
      } else {
        console.error("Error fetching user stats:", data.message);
        showAlertMessage("Error fetching statistics", "warning");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      showAlertMessage(
        `Error fetching statistics: ${error.message}`,
        "warning"
      );
    } finally {
      setStatsLoading(false);
    }
  }, [API_BASE]);

  const createUser = async (userData) => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        showAlertMessage("User created successfully", "success");
        fetchUsers();
        fetchUserStats();
        return true;
      } else {
        showAlertMessage(data.message || "Error creating user", "danger");
        return false;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showAlertMessage("Error creating user", "danger");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        showAlertMessage("User updated successfully", "success");
        fetchUsers();
        fetchUserStats();
        return true;
      } else {
        showAlertMessage(data.message || "Error updating user", "danger");
        return false;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showAlertMessage("Error updating user", "danger");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        showAlertMessage("User deleted successfully", "success");
        fetchUsers();
        fetchUserStats();
        return true;
      } else {
        showAlertMessage(data.message || "Error deleting user", "danger");
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlertMessage("Error deleting user", "danger");
      return false;
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlertMessage(data.message, "success");
        fetchUsers();
        fetchUserStats();
      } else {
        showAlertMessage(
          data.message || "Error updating user status",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showAlertMessage("Error updating user status", "danger");
    }
  };

  // Event Handlers
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
      isActive: true,
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const handleAddUser = () => {
    resetForm();
    setSelectedUser(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Don't pre-fill password for security
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    });
    setFormErrors({});
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      const success = await deleteUser(selectedUser._id);
      if (success) {
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    }
  };

  const handleToggleStatus = async (user) => {
    await toggleUserStatus(user._id);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (modalMode === "add" && !formData.password) {
      errors.password = "Password is required";
    }

    if (
      modalMode === "add" &&
      formData.password &&
      formData.password.length < 6
    ) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      role: formData.role,
      isActive: formData.isActive,
    };

    if (modalMode === "add") {
      userData.password = formData.password;
    }

    let success = false;

    if (modalMode === "add") {
      success = await createUser(userData);
    } else if (modalMode === "edit") {
      success = await updateUser(selectedUser._id, userData);
    }

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Search and filter handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "role") {
      setFilterRole(value);
    } else if (filterType === "status") {
      setFilterStatus(value);
    }
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Effects
  useEffect(() => {
    console.log("AdminUsers component mounted, fetching users...");
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    console.log("Fetching user stats...");
    fetchUserStats();
  }, [fetchUserStats]);

  // Utility functions
  const getStatusColor = (isActive) => {
    return isActive ? "success" : "warning";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "moderator":
        return "warning";
      case "customer":
        return "primary";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFullName = (user) => {
    return `${user.firstName} ${user.lastName}`;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner animation="border" style={{ color: "#1d1d1b" }} />
      </div>
    );
  }

  return (
    <div>
      <style>
        {`
          .user-table th {
            background-color: #f8f9fa !important;
            border-color: #dee2e6 !important;
            color: #1d1d1b !important;
            font-weight: 600 !important;
            cursor: pointer;
          }
          .user-table th:hover {
            background-color: #e9ecef !important;
          }
          .user-table td {
            vertical-align: middle !important;
            border-color: #dee2e6 !important;
          }
          .user-card {
            transition: all 0.3s ease;
            border: 1px solid #dee2e6;
          }
          .user-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
          }
          .stats-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .action-btn {
            transition: all 0.2s ease-in-out !important;
            border-width: 1px !important;
          }
          .action-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
          }
          .btn-outline-primary:hover {
            background-color: #007bff !important;
            border-color: #007bff !important;
            color: white !important;
          }
          .btn-outline-warning:hover {
            background-color: #ffc107 !important;
            border-color: #ffc107 !important;
            color: #212529 !important;
          }
          .btn-outline-success:hover {
            background-color: #28a745 !important;
            border-color: #28a745 !important;
            color: white !important;
          }
          .btn-outline-secondary:hover {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            color: white !important;
          }
          .btn-outline-danger:hover {
            background-color: #dc3545 !important;
            border-color: #dc3545 !important;
            color: white !important;
          }
          .action-btn:focus {
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25) !important;
          }
          .btn-outline-danger:focus {
            box-shadow: 0 0 0 0.2rem rgba(220,53,69,.25) !important;
          }
        `}
      </style>

      {/* Alert */}
      {showAlert && (
        <Alert
          variant={alertType}
          dismissible
          onClose={() => setShowAlert(false)}
          className="position-fixed"
          style={{
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Users size={32} className="me-3" style={{ color: "#404040" }} />
            <div>
              <h1 className="h2 mb-0" style={{ color: "#1d1d1b" }}>
                User Management
              </h1>
              <p className="text-muted mb-0">
                Manage user accounts, roles, and permissions
              </p>
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button
              onClick={() => {
                fetchUsers();
                fetchUserStats();
              }}
              variant="outline-secondary"
              className="d-flex align-items-center"
              disabled={loading || statsLoading}
            >
              {loading || statsLoading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                <Activity size={18} className="me-2" />
              )}
              Refresh
            </Button>
            <Button
              onClick={handleAddUser}
              style={{
                backgroundColor: "#1d1d1b",
                borderColor: "#1d1d1b",
                fontWeight: "600",
              }}
              className="d-flex align-items-center"
            >
              <Plus size={18} className="me-2" />
              Add User
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <Users size={32} style={{ color: "#404040" }} className="mb-2" />
              <h3 className="mb-1" style={{ color: "#1d1d1b" }}>
                {statsLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#1d1d1b" }}
                  />
                ) : (
                  userStats.totalUsers
                )}
              </h3>
              <p className="text-muted mb-0 small">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <UserCheck
                size={32}
                style={{ color: "#28a745" }}
                className="mb-2"
              />
              <h3 className="mb-1" style={{ color: "#1d1d1b" }}>
                {statsLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#1d1d1b" }}
                  />
                ) : (
                  userStats.activeUsers
                )}
              </h3>
              <p className="text-muted mb-0 small">Active Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <UserX size={32} style={{ color: "#ffc107" }} className="mb-2" />
              <h3 className="mb-1" style={{ color: "#1d1d1b" }}>
                {statsLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#1d1d1b" }}
                  />
                ) : (
                  userStats.inactiveUsers
                )}
              </h3>
              <p className="text-muted mb-0 small">Inactive Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <Activity
                size={32}
                style={{ color: "#17a2b8" }}
                className="mb-2"
              />
              <h3 className="mb-1" style={{ color: "#1d1d1b" }}>
                {statsLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#1d1d1b" }}
                  />
                ) : (
                  userStats.recentRegistrations
                )}
              </h3>
              <p className="text-muted mb-0 small">New (30 days)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text
              style={{ backgroundColor: "#ffffff", borderColor: "#dee2e6" }}
            >
              <Search size={18} style={{ color: "#404040" }} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ borderColor: "#dee2e6" }}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-between"
              style={{ borderColor: "#dee2e6" }}
            >
              <span className="d-flex align-items-center">
                <Filter size={16} className="me-2" />
                Role:{" "}
                {filterRole === "all"
                  ? "All"
                  : roles.find((r) => r.value === filterRole)?.label}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterChange("role", "all")}>
                All Roles
              </Dropdown.Item>
              {roles.map((role) => (
                <Dropdown.Item
                  key={role.value}
                  onClick={() => handleFilterChange("role", role.value)}
                >
                  {role.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3}>
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-between"
              style={{ borderColor: "#dee2e6" }}
            >
              <span className="d-flex align-items-center">
                <Activity size={16} className="me-2" />
                Status:{" "}
                {filterStatus === "all"
                  ? "All"
                  : filterStatus === "active"
                  ? "Active"
                  : "Inactive"}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => handleFilterChange("status", "all")}
              >
                All Status
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterChange("status", "active")}
              >
                Active
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterChange("status", "inactive")}
              >
                Inactive
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="user-card">
        <Card.Body className="p-0">
          <Table responsive className="user-table mb-0">
            <thead>
              <tr>
                <th onClick={() => handleSort("firstName")}>
                  Name{" "}
                  {sortBy === "firstName" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email{" "}
                  {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("role")}>
                  Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("isActive")}>
                  Status{" "}
                  {sortBy === "isActive" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  Joined{" "}
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th width="160">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
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
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: "#1d1d1b", fontWeight: "600" }}>
                          {formatFullName(user)}
                        </div>
                        {user.phone && (
                          <small className="text-muted">
                            <Phone size={12} className="me-1" />
                            {user.phone}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Mail size={16} className="me-2 text-muted" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <Badge
                      bg={getRoleColor(user.role)}
                      className="text-capitalize"
                    >
                      <Shield size={12} className="me-1" />
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(user.isActive)}>
                      {user.isActive ? (
                        <>
                          <UserCheck size={12} className="me-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX size={12} className="me-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={14} className="me-2" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1 align-items-center">
                      {/* View Button */}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="action-btn"
                        title="View Details"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          minWidth: "32px",
                          height: "32px",
                        }}
                      >
                        <Eye size={12} />
                      </Button>

                      {/* Edit Button */}
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="action-btn"
                        title="Edit User"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          minWidth: "32px",
                          height: "32px",
                        }}
                      >
                        <Edit size={12} />
                      </Button>

                      {/* Toggle Status Button */}
                      <Button
                        variant={
                          user.isActive
                            ? "outline-secondary"
                            : "outline-success"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className="action-btn"
                        title={
                          user.isActive ? "Deactivate User" : "Activate User"
                        }
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          minWidth: "32px",
                          height: "32px",
                        }}
                      >
                        {user.isActive ? (
                          <UserX size={12} />
                        ) : (
                          <UserCheck size={12} />
                        )}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="action-btn"
                        title="Delete User"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          minWidth: "32px",
                          height: "32px",
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-5">
              <Users size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {users.length} of {totalUsers} users
          </div>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              if (page > totalPages) return null;

              return (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ color: "#1d1d1b" }}>
            {modalMode === "add"
              ? "Add New User"
              : modalMode === "edit"
              ? "Edit User"
              : "User Details"}
          </Modal.Title>
        </Modal.Header>

        {modalMode === "view" ? (
          <Modal.Body>
            {selectedUser && (
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Full Name</label>
                    <p
                      className="mb-0"
                      style={{ color: "#1d1d1b", fontWeight: "600" }}
                    >
                      {formatFullName(selectedUser)}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Email</label>
                    <p className="mb-0" style={{ color: "#1d1d1b" }}>
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Role</label>
                    <p className="mb-0">
                      <Badge
                        bg={getRoleColor(selectedUser.role)}
                        className="text-capitalize"
                      >
                        {selectedUser.role}
                      </Badge>
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Phone</label>
                    <p className="mb-0" style={{ color: "#1d1d1b" }}>
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Status</label>
                    <p className="mb-0">
                      <Badge bg={getStatusColor(selectedUser.isActive)}>
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Joined</label>
                    <p className="mb-0" style={{ color: "#1d1d1b" }}>
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Body>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      isInvalid={!!formErrors.firstName}
                      placeholder="Enter first name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      isInvalid={!!formErrors.lastName}
                      placeholder="Enter last name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Mail size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!formErrors.email}
                        placeholder="Enter email address"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Phone size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              {modalMode === "add" && (
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!formErrors.password}
                      placeholder="Enter password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="switch"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      label={formData.isActive ? "Active" : "Inactive"}
                      style={{ marginTop: "8px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer
              style={{
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid #dee2e6",
              }}
            >
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: "#1d1d1b",
                  borderColor: "#1d1d1b",
                }}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {modalMode === "add" ? "Creating..." : "Updating..."}
                  </>
                ) : modalMode === "add" ? (
                  "Create User"
                ) : (
                  "Update User"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ color: "#1d1d1b" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>Are you sure you want to delete the following user?</p>
              <div className="bg-light p-3 rounded">
                <strong>{formatFullName(selectedUser)}</strong>
                <br />
                <small className="text-muted">{selectedUser.email}</small>
              </div>
              <div className="mt-3 p-3 border border-danger rounded bg-danger bg-opacity-10">
                <small className="text-danger">
                  <strong>Warning:</strong> This action cannot be undone. All
                  user data will be permanently removed.
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <Trash2 size={16} className="me-2" />
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
