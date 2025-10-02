import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  ProgressBar,
  ListGroup,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  TrendingUp,
  Users,
  Package,
  Activity,
  ArrowUp,
  ArrowDown,
  Settings,
  BarChart3,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  RefreshCw,
  PieChart,
} from "lucide-react";
import SimpleChart from "../../components/SimpleChart";

const AdminDashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE =
        process.env.REACT_APP_API_URL || "http://localhost:8070/api";
      const response = await fetch(`${API_BASE}/dashboard/overview`);

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate metrics from real data
  const getMetrics = () => {
    if (!dashboardData) return [];

    const { users, products, reviews } = dashboardData;

    return [
      {
        title: "Total Users",
        value: users.totalUsers?.toLocaleString() || "0",
        change:
          users.recentRegistrations > 0 ? `+${users.recentRegistrations}` : "0",
        trend: users.recentRegistrations > 0 ? "up" : "neutral",
        icon: <Users size={28} />,
        color: "#404040",
        description: "registered users",
        subtext: `${users.recentRegistrations || 0} new this month`,
      },
      {
        title: "Active Users",
        value: users.activeUsers?.toLocaleString() || "0",
        change:
          users.totalUsers > 0
            ? `${Math.round((users.activeUsers / users.totalUsers) * 100)}%`
            : "0%",
        trend: "up",
        icon: <Activity size={28} />,
        color: "#404040",
        description: "active accounts",
        subtext: "of total users",
      },
      {
        title: "Total Products",
        value: products.totalProducts?.toLocaleString() || "0",
        change: products.newProducts > 0 ? `+${products.newProducts}` : "0",
        trend: products.newProducts > 0 ? "up" : "neutral",
        icon: <Package size={28} />,
        color: "#404040",
        description: "in inventory",
        subtext: `${products.newProducts || 0} added this month`,
      },
      {
        title: "Featured Products",
        value: products.featuredProducts?.toLocaleString() || "0",
        change:
          products.totalProducts > 0
            ? `${Math.round(
                (products.featuredProducts / products.totalProducts) * 100
              )}%`
            : "0%",
        trend: "up",
        icon: <Star size={28} />,
        color: "#404040",
        description: "featured items",
        subtext: "of total products",
      },
      {
        title: "Total Reviews",
        value: reviews.totalReviews?.toLocaleString() || "0",
        change: reviews.recentReviews > 0 ? `+${reviews.recentReviews}` : "0",
        trend: reviews.recentReviews > 0 ? "up" : "neutral",
        icon: <MessageSquare size={28} />,
        color: "#404040",
        description: "customer reviews",
        subtext: `${reviews.recentReviews || 0} this week`,
      },
      {
        title: "Pending Reviews",
        value: reviews.pendingReviews?.toLocaleString() || "0",
        change:
          reviews.totalReviews > 0
            ? `${Math.round(
                (reviews.pendingReviews / reviews.totalReviews) * 100
              )}%`
            : "0%",
        trend: reviews.pendingReviews > 0 ? "down" : "up",
        icon: <Clock size={28} />,
        color: "#404040",
        description: "awaiting approval",
        subtext: "need attention",
      },
    ];
  };

  // Get summary data for display
  const getSummaryData = () => {
    if (!dashboardData) return null;

    const { users, products, reviews } = dashboardData;

    return {
      quickStats: [
        {
          label: "Active Users",
          value: users.activeUsers || 0,
          total: users.totalUsers || 0,
          color: "#28a745",
          icon: <CheckCircle size={20} />,
        },
        {
          label: "Featured Products",
          value: products.featuredProducts || 0,
          total: products.totalProducts || 0,
          color: "#ffc107",
          icon: <Star size={20} />,
        },
        {
          label: "Approved Reviews",
          value: reviews.approvedReviews || 0,
          total: reviews.totalReviews || 0,
          color: "#17a2b8",
          icon: <MessageSquare size={20} />,
        },
        {
          label: "Recent Activity",
          value:
            (users.recentRegistrations || 0) +
            (products.newProducts || 0) +
            (reviews.recentReviews || 0),
          total: "This Month",
          color: "#6f42c1",
          icon: <TrendingUp size={20} />,
        },
      ],
    };
  };

  // Get chart data
  const getChartData = () => {
    if (!dashboardData) return { barChart: [], donutChart: [], lineChart: [] };

    const { users, products, reviews } = dashboardData;

    const barChart = [
      { label: "Users", value: users.totalUsers || 0 },
      { label: "Products", value: products.totalProducts || 0 },
      { label: "Reviews", value: reviews.totalReviews || 0 },
      { label: "Featured", value: products.featuredProducts || 0 },
    ];

    const donutChart = [
      { label: "Active Products", value: products.activeProducts || 0 },
      { label: "Inactive Products", value: products.inactiveProducts || 0 },
      { label: "Featured Products", value: products.featuredProducts || 0 },
    ].filter((item) => item.value > 0); // Only show categories with data

    // Sample trend data (in a real app, this would come from time-series data)
    const lineChart = [
      { label: "Jan", value: Math.max(0, (users.totalUsers || 0) * 0.6) },
      { label: "Feb", value: Math.max(0, (users.totalUsers || 0) * 0.7) },
      { label: "Mar", value: Math.max(0, (users.totalUsers || 0) * 0.8) },
      { label: "Apr", value: Math.max(0, (users.totalUsers || 0) * 0.9) },
      { label: "May", value: users.totalUsers || 0 },
    ];

    return { barChart, donutChart, lineChart };
  };

  // Loading component
  const LoadingCard = () => (
    <Card className="metric-card h-100 border-0">
      <Card.Body className="p-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "120px" }}
        >
          <Spinner animation="border" style={{ color: "#404040" }} />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="admin-dashboard">
      <style>
        {`
          .admin-dashboard {
            background: #ffffff;
            min-height: 100vh;
            padding: 2rem;
          }
          
          .metric-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(64, 64, 64, 0.08);
            border: 1px solid rgba(64, 64, 64, 0.1);
            transition: all 0.3s ease;
            animation: fadeInUp 0.6s ease-out;
          }
          
          .metric-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 30px rgba(64, 64, 64, 0.15);
            border-color: #404040;
          }
          
          .quick-action-card {
            background: #ffffff;
            border-radius: 12px;
            border: 2px solid rgba(64, 64, 64, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(64, 64, 64, 0.06);
            padding: 1.5rem;
          }
          
          .quick-action-card:hover {
            background: #404040;
            border-color: #404040;
            color: #ffffff;
            transform: translateY(-4px);
            box-shadow: 0 6px 20px rgba(64, 64, 64, 0.2);
          }
          
          .quick-action-card:hover .action-icon,
          .quick-action-card:hover .action-text {
            color: #ffffff !important;
          }
          
          .system-overview-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(64, 64, 64, 0.1);
            box-shadow: 0 4px 12px rgba(64, 64, 64, 0.08);
          }
          
          .chart-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(64, 64, 64, 0.1);
            box-shadow: 0 4px 12px rgba(64, 64, 64, 0.08);
          }
          
          .dashboard-header {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 16px;
            border: 1px solid rgba(64, 64, 64, 0.1);
            box-shadow: 0 2px 8px rgba(64, 64, 64, 0.06);
          }
          
          .action-btn {
            background: #ffffff;
            border: 2px solid #404040;
            color: #404040;
            border-radius: 10px;
            transition: all 0.3s ease;
            font-weight: 600;
          }
          
          .action-btn:hover {
            background: #404040;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(64, 64, 64, 0.2);
          }
          
          .spinning {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .metric-card:nth-child(1) { animation-delay: 0.1s; }
          .metric-card:nth-child(2) { animation-delay: 0.2s; }
          .metric-card:nth-child(3) { animation-delay: 0.3s; }
          .metric-card:nth-child(4) { animation-delay: 0.4s; }
          .metric-card:nth-child(5) { animation-delay: 0.5s; }
          .metric-card:nth-child(6) { animation-delay: 0.6s; }
          
          @media (max-width: 768px) {
            .admin-dashboard {
              padding: 1rem;
            }
          }
        `}
      </style>

      {/* Enhanced Page Header */}
      <div className="mb-5 fade-in">
        <div className="dashboard-header p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h2 fw-bold mb-2" style={{ color: "#1d1d1b" }}>
                Dashboard Overview
              </h1>
              <p
                className="mb-0"
                style={{ color: "#404040", fontSize: "1.1rem" }}
              >
                Welcome back! Here's what's happening with your store today.
              </p>
              {lastUpdated && (
                <small style={{ color: "#404040" }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <Button
                className="action-btn d-flex align-items-center gap-2 px-4 py-2"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <RefreshCw size={18} className={loading ? "spinning" : ""} />
                <span className="d-none d-sm-inline">Refresh</span>
              </Button>
              <Button
                className="d-flex align-items-center gap-2 px-4 py-2"
                style={{
                  backgroundColor: "#404040",
                  borderColor: "#404040",
                  color: "#ffffff",
                  borderRadius: "10px",
                  border: "2px solid #404040",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1d1d1b";
                  e.target.style.borderColor = "#1d1d1b";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#404040";
                  e.target.style.borderColor = "#404040";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <BarChart3 size={18} />
                <span className="d-none d-sm-inline">View Reports</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4 fade-in">
          <div className="d-flex align-items-center gap-2">
            <strong>Error loading dashboard data:</strong> {error}
            <Button
              variant="link"
              size="sm"
              onClick={fetchDashboardData}
              className="p-0 ms-auto"
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Enhanced Metrics Cards */}
      <Row className="mb-5">
        {loading
          ? // Loading cards
            Array.from({ length: 6 }, (_, index) => (
              <Col lg={2} md={4} sm={6} className="mb-4" key={index}>
                <LoadingCard />
              </Col>
            ))
          : // Real data cards
            getMetrics().map((metric, index) => (
              <Col lg={2} md={4} sm={6} className="mb-4" key={index}>
                <Card className="metric-card h-100 border-0">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <p
                          className="mb-1 fw-medium"
                          style={{ color: "#404040", fontSize: "0.85rem" }}
                        >
                          {metric.title}
                        </p>
                        <h4
                          className="fw-bold mb-1"
                          style={{ color: "#1d1d1b", fontSize: "1.8rem" }}
                        >
                          {metric.value}
                        </h4>
                        <small
                          style={{ color: "#404040", fontSize: "0.75rem" }}
                        >
                          {metric.description}
                        </small>
                      </div>
                      <div
                        className="metric-icon rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "rgba(64, 64, 64, 0.1)",
                          color: metric.color,
                        }}
                      >
                        {metric.icon}
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        {metric.trend === "up" ? (
                          <ArrowUp size={16} style={{ color: "#28a745" }} />
                        ) : metric.trend === "down" ? (
                          <ArrowDown size={16} style={{ color: "#dc3545" }} />
                        ) : (
                          <div style={{ width: "16px" }}></div>
                        )}
                        <span
                          className="fw-semibold ms-2"
                          style={{
                            color:
                              metric.trend === "up"
                                ? "#28a745"
                                : metric.trend === "down"
                                ? "#dc3545"
                                : "#404040",
                            fontSize: "0.8rem",
                          }}
                        >
                          {metric.change}
                        </span>
                      </div>
                      <small style={{ color: "#404040", fontSize: "0.7rem" }}>
                        {metric.subtext}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
      </Row>

      <Row>
        {/* Enhanced Summary Statistics */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 fade-in">
            <Card.Header className="bg-white border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                    System Overview
                  </h5>
                  <p className="mb-0 small" style={{ color: "#404040" }}>
                    Key performance indicators and system health
                  </p>
                </div>
                {dashboardData && (
                  <Badge
                    style={{
                      backgroundColor: "#28a745",
                      color: "#ffffff",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                    }}
                  >
                    System Online
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: "#404040" }} />
                  <p className="mt-3" style={{ color: "#404040" }}>
                    Loading system data...
                  </p>
                </div>
              ) : dashboardData ? (
                <Row>
                  {getSummaryData()?.quickStats.map((stat, index) => (
                    <Col md={6} className="mb-4" key={index}>
                      <div
                        className="d-flex align-items-center p-3 rounded"
                        style={{ backgroundColor: "rgba(64, 64, 64, 0.02)" }}
                      >
                        <div className="me-3" style={{ color: stat.color }}>
                          {stat.icon}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <small
                              className="fw-medium"
                              style={{ color: "#404040" }}
                            >
                              {stat.label}
                            </small>
                            <span
                              className="fw-bold"
                              style={{ color: "#1d1d1b" }}
                            >
                              {stat.value}
                              {typeof stat.total === "number" && (
                                <small style={{ color: "#404040" }}>
                                  /{stat.total}
                                </small>
                              )}
                            </span>
                          </div>
                          {typeof stat.total === "number" && stat.total > 0 && (
                            <ProgressBar
                              now={(stat.value / stat.total) * 100}
                              style={{ height: "4px", borderRadius: "2px" }}
                              variant=""
                              className="bg-light"
                            >
                              <ProgressBar
                                now={(stat.value / stat.total) * 100}
                                style={{ backgroundColor: stat.color }}
                              />
                            </ProgressBar>
                          )}
                          {typeof stat.total === "string" && (
                            <small style={{ color: "#404040" }}>
                              {stat.total}
                            </small>
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <p style={{ color: "#404040" }}>No data available</p>
                  <Button
                    variant="outline-secondary"
                    onClick={fetchDashboardData}
                    style={{ borderColor: "#404040", color: "#404040" }}
                  >
                    Reload Data
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Data Insights */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 fade-in">
            <Card.Header className="bg-white border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                    Quick Insights
                  </h5>
                  <p className="mb-0 small" style={{ color: "#404040" }}>
                    Recent activity and trends
                  </p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  style={{ color: "#404040", textDecoration: "none" }}
                >
                  <Settings size={18} />
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-4">
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#404040" }}
                  />
                </div>
              ) : dashboardData ? (
                <ListGroup variant="flush">
                  <ListGroup.Item className="border-0 px-4 py-3">
                    <div className="d-flex align-items-center">
                      <Users
                        size={20}
                        className="me-3"
                        style={{ color: "#404040" }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="fw-semibold mb-1"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          User Growth
                        </h6>
                        <small style={{ color: "#404040" }}>
                          {dashboardData.users.recentRegistrations || 0} new
                          registrations this month
                        </small>
                      </div>
                      <Badge
                        className="ms-2"
                        style={{
                          backgroundColor: "rgba(40, 167, 69, 0.1)",
                          color: "#28a745",
                          borderRadius: "6px",
                        }}
                      >
                        +{dashboardData.users.recentRegistrations || 0}
                      </Badge>
                    </div>
                  </ListGroup.Item>

                  <ListGroup.Item className="border-0 px-4 py-3">
                    <div className="d-flex align-items-center">
                      <Package
                        size={20}
                        className="me-3"
                        style={{ color: "#404040" }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="fw-semibold mb-1"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          Product Updates
                        </h6>
                        <small style={{ color: "#404040" }}>
                          {dashboardData.products.newProducts || 0} new products
                          added
                        </small>
                      </div>
                      <Badge
                        className="ms-2"
                        style={{
                          backgroundColor: "rgba(255, 193, 7, 0.1)",
                          color: "#ffc107",
                          borderRadius: "6px",
                        }}
                      >
                        +{dashboardData.products.newProducts || 0}
                      </Badge>
                    </div>
                  </ListGroup.Item>

                  <ListGroup.Item className="border-0 px-4 py-3">
                    <div className="d-flex align-items-center">
                      <MessageSquare
                        size={20}
                        className="me-3"
                        style={{ color: "#404040" }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="fw-semibold mb-1"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          Review Activity
                        </h6>
                        <small style={{ color: "#404040" }}>
                          {dashboardData.reviews.recentReviews || 0} reviews
                          this week
                        </small>
                      </div>
                      <Badge
                        className="ms-2"
                        style={{
                          backgroundColor: "rgba(23, 162, 184, 0.1)",
                          color: "#17a2b8",
                          borderRadius: "6px",
                        }}
                      >
                        +{dashboardData.reviews.recentReviews || 0}
                      </Badge>
                    </div>
                  </ListGroup.Item>

                  <ListGroup.Item className="border-0 px-4 py-3">
                    <div className="d-flex align-items-center">
                      <Clock
                        size={20}
                        className="me-3"
                        style={{ color: "#404040" }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="fw-semibold mb-1"
                          style={{ color: "#1d1d1b", fontSize: "0.9rem" }}
                        >
                          Pending Actions
                        </h6>
                        <small style={{ color: "#404040" }}>
                          {dashboardData.reviews.pendingReviews || 0} reviews
                          need approval
                        </small>
                      </div>
                      {dashboardData.reviews.pendingReviews > 0 && (
                        <Badge
                          className="ms-2"
                          style={{
                            backgroundColor: "rgba(220, 53, 69, 0.1)",
                            color: "#dc3545",
                            borderRadius: "6px",
                          }}
                        >
                          {dashboardData.reviews.pendingReviews}
                        </Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <small style={{ color: "#404040" }}>
                    No insights available
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      {dashboardData && (
        <Row className="mb-5">
          <Col lg={8} className="mb-4">
            <Card className="system-overview-card border-0 fade-in">
              <Card.Header className="bg-white border-0 py-4">
                <div className="d-flex align-items-center">
                  <BarChart3
                    size={24}
                    className="me-3"
                    style={{ color: "#404040" }}
                  />
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                      System Overview
                    </h5>
                    <p className="mb-0 small" style={{ color: "#404040" }}>
                      Visual representation of key metrics
                    </p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <SimpleChart
                  data={getChartData().barChart}
                  type="bar"
                  height={250}
                  colors={["#404040", "#28a745", "#17a2b8", "#ffc107"]}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="chart-card border-0 fade-in">
              <Card.Header className="bg-white border-0 py-4">
                <div className="d-flex align-items-center">
                  <PieChart
                    size={24}
                    className="me-3"
                    style={{ color: "#404040" }}
                  />
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                      Product Distribution
                    </h5>
                    <p className="mb-0 small" style={{ color: "#404040" }}>
                      Breakdown by status
                    </p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {getChartData().donutChart.length > 0 ? (
                  <SimpleChart
                    data={getChartData().donutChart}
                    type="donut"
                    height={200}
                    colors={["#28a745", "#dc3545", "#ffc107"]}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      height: "200px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="text-center">
                      <Package
                        size={40}
                        className="mb-2"
                        style={{ color: "#6c757d" }}
                      />
                      <p className="mb-0" style={{ color: "#6c757d" }}>
                        No product data available
                      </p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Additional Analytics Chart */}
      {dashboardData && getChartData().lineChart.length > 0 && (
        <Row className="mb-5">
          <Col className="mb-4">
            <Card className="system-overview-card border-0 fade-in">
              <Card.Header className="bg-white border-0 py-4">
                <div className="d-flex align-items-center">
                  <Activity
                    size={24}
                    className="me-3"
                    style={{ color: "#404040" }}
                  />
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                      Growth Trends
                    </h5>
                    <p className="mb-0 small" style={{ color: "#404040" }}>
                      User registration trends over the last 5 months
                    </p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <SimpleChart
                  data={getChartData().lineChart}
                  type="line"
                  height={200}
                  colors={["#404040"]}
                  animated={true}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Enhanced Quick Actions */}
      <Row>
        <Col className="mb-4">
          <Card className="system-overview-card border-0 fade-in">
            <Card.Header className="bg-white border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Settings
                    size={24}
                    className="me-3"
                    style={{ color: "#404040" }}
                  />
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#1d1d1b" }}>
                      Quick Actions
                    </h5>
                    <p className="mb-0 small" style={{ color: "#404040" }}>
                      Frequently used management tools and shortcuts
                    </p>
                  </div>
                </div>
                {dashboardData?.reviews?.pendingReviews > 0 && (
                  <Badge
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#ffffff",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                    }}
                  >
                    {dashboardData.reviews.pendingReviews} Pending
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col lg={3} md={6} className="mb-4">
                  <div
                    className="quick-action-card text-center h-100 d-flex flex-column justify-content-center"
                    onClick={() => (window.location.href = "/admin/products")}
                  >
                    <Package
                      size={48}
                      className="action-icon mb-3"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <p
                      className="action-text fw-bold mb-2"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.1rem",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Manage Products
                    </p>
                    <small
                      className="action-text"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {dashboardData?.products?.totalProducts || 0} items in
                      inventory
                    </small>
                    {dashboardData?.products?.newProducts > 0 && (
                      <Badge
                        className="mt-3"
                        style={{
                          backgroundColor: "rgba(40, 167, 69, 0.15)",
                          color: "#28a745",
                          fontSize: "0.75rem",
                          borderRadius: "8px",
                          padding: "0.4rem 0.8rem",
                        }}
                      >
                        +{dashboardData.products.newProducts} new
                      </Badge>
                    )}
                  </div>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                  <div
                    className="quick-action-card text-center h-100 d-flex flex-column justify-content-center"
                    onClick={() => (window.location.href = "/admin/categories")}
                  >
                    <Settings
                      size={48}
                      className="action-icon mb-3"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <p
                      className="action-text fw-bold mb-2"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.1rem",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Categories
                    </p>
                    <small
                      className="action-text"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Organize product categories
                    </small>
                  </div>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                  <div
                    className="quick-action-card text-center h-100 d-flex flex-column justify-content-center"
                    onClick={() => (window.location.href = "/admin/reviews")}
                  >
                    <MessageSquare
                      size={48}
                      className="action-icon mb-3"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <p
                      className="action-text fw-bold mb-2"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.1rem",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Reviews
                    </p>
                    <small
                      className="action-text"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {dashboardData?.reviews?.totalReviews || 0} customer
                      reviews
                    </small>
                    {dashboardData?.reviews?.pendingReviews > 0 && (
                      <Badge
                        className="mt-3"
                        style={{
                          backgroundColor: "rgba(220, 53, 69, 0.15)",
                          color: "#dc3545",
                          fontSize: "0.75rem",
                          borderRadius: "8px",
                          padding: "0.4rem 0.8rem",
                        }}
                      >
                        {dashboardData.reviews.pendingReviews} pending
                      </Badge>
                    )}
                  </div>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                  <div
                    className="quick-action-card text-center h-100 d-flex flex-column justify-content-center"
                    onClick={fetchDashboardData}
                  >
                    <TrendingUp
                      size={48}
                      className="action-icon mb-3"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <p
                      className="action-text fw-bold mb-2"
                      style={{
                        color: "#1d1d1b",
                        fontSize: "1.1rem",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Analytics
                    </p>
                    <small
                      className="action-text"
                      style={{
                        color: "#404040",
                        transition: "color 0.3s ease",
                      }}
                    >
                      View detailed statistics
                    </small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
