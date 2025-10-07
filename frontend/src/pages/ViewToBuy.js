import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const ViewToBuy = () => {
  useEffect(() => {
    document.title = "Where to Buy - AXG Photography Equipment";
  }, []);
  const countries = ["Sri Lanka", "Maldives", "Singapore"];

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "100px",
        paddingBottom: "60px",
      }}
    >
      <Container>
        {/* Header Section */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1
                className="display-4 fw-bold mb-3"
                style={{ color: "#1d1d1b", marginBottom: "1rem" }}
              >
                Where to Buy
              </h1>
              <p
                className="lead mb-4"
                style={{ color: "#404040", fontSize: "1.1rem" }}
              >
                Our products are available in the following countries
              </p>
            </div>
          </Col>
        </Row>

        {/* Countries Cards */}
        <Row className="justify-content-center g-4">
          {countries.map((country, index) => (
            <Col key={index} lg={3} md={4} sm={6} xs={10}>
              <Card
                className="h-100 border-0 shadow-sm country-card"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease-in-out",
                  cursor: "default",
                  backgroundColor: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(29, 29, 27, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                  <div
                    className="mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#404040",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {country.charAt(0)}
                    </span>
                  </div>
                  <h5
                    className="card-title text-center mb-0"
                    style={{
                      color: "#1d1d1b",
                      fontWeight: "600",
                      fontSize: "1.25rem",
                    }}
                  >
                    {country}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Additional Information */}
        <Row className="mt-5">
          <Col>
            <div className="text-center">
              <p
                className="mb-0"
                style={{
                  color: "#404040",
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                }}
              >
                For more information about availability in your area, please
                contact us directly
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewToBuy;
