import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const ViewToBuy = () => {
  const countries = ["Sri Lanka", "Maldives", "Singapore"];

  return (
    <div
      className="min-vh-100"
      style={{ backgroundColor: "#f8f9fa", paddingTop: "100px" }}
    >
      <Container>
        {/* Header Section */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1
                className="display-4 fw-bold mb-4"
                style={{ color: "#1d1d1b" }}
              >
                Available Countries
              </h1>
            </div>
          </Col>
        </Row>

        {/* Countries List */}
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Card.Body className="p-4">
                <ul
                  className="list-unstyled mb-0"
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: "2.5",
                  }}
                >
                  {countries.map((country, index) => (
                    <li
                      key={index}
                      className="py-3 px-3"
                      style={{
                        color: "#1d1d1b",
                        fontWeight: "500",
                        borderBottom:
                          index < countries.length - 1
                            ? "1px solid #e9ecef"
                            : "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f8f9fa";
                        e.target.style.borderRadius = "8px";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      • {country}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewToBuy;
