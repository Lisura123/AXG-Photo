import React, { useState } from "react";
import { ArrowRight, Eye, ShoppingBag } from "lucide-react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const {
    name,
    image,
    productCount = 0,
    description,
    thumbnails = [],
    features = [],
    isEnhanced = false,
    subcategories = [],
  } = category;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      as={Link}
      to={`/products/${name.toLowerCase().replace(/\s+/g, "-")}`}
      className="h-100 enhanced-category-card position-relative overflow-hidden text-decoration-none"
      style={{
        cursor: "pointer",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        color: "#1d1d1b",
        boxShadow: isHovered
          ? "0 20px 40px rgba(29, 29, 27, 0.15)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div
        className="position-relative overflow-hidden"
        style={{ borderRadius: "16px 16px 0 0" }}
      >
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          className="category-main-img"
          style={{
            height: "180px",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        {/* Enhanced Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 category-overlay"
          style={{
            background: isHovered
              ? "linear-gradient(45deg, rgba(29, 29, 27, 0.4), rgba(64, 64, 64, 0.2))"
              : "linear-gradient(45deg, rgba(29, 29, 27, 0.1), transparent)",
            transition: "all 0.4s ease",
          }}
        />

        {/* Enhanced Action Icons */}
        <div
          className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2"
          style={{
            opacity: isHovered ? "1" : "0",
            transform: isHovered ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease",
            }}
          >
            <Eye size={16} style={{ color: "#1d1d1b" }} />
          </div>
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease",
            }}
          >
            <ShoppingBag size={16} style={{ color: "#1d1d1b" }} />
          </div>
        </div>

        {/* Product Count Badge */}
        <Badge
          className="position-absolute bottom-0 end-0 m-3 enhanced-badge"
          style={{
            backgroundColor: isHovered ? "#1d1d1b" : "#404040",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: "600",
            padding: "6px 12px",
            borderRadius: "20px",
            transition: "all 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </Badge>

        {/* Category Type Badge */}
        {isEnhanced && (
          <Badge
            className="position-absolute top-0 start-0 m-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#1d1d1b",
              fontSize: "0.7rem",
              fontWeight: "600",
              padding: "4px 10px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(29, 29, 27, 0.1)",
            }}
          >
            Featured
          </Badge>
        )}
      </div>

      {/* Gallery Thumbnails or Spacer */}
      <div className="thumbnail-section">
        {thumbnails && thumbnails.length > 0 ? (
          <div className="p-2 pb-0">
            <Row className="g-2">
              {thumbnails.slice(0, 3).map((thumb, index) => (
                <Col xs={4} key={index}>
                  <div
                    className="thumbnail-container position-relative overflow-hidden"
                    style={{
                      height: "50px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <img
                      src={thumb}
                      alt={`${name} thumbnail ${index + 1}`}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        borderRadius: "6px",
                        transition: "transform 0.3s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        opacity: isHovered ? "0.8" : "1",
                      }}
                    />
                  </div>
                </Col>
              ))}
              {thumbnails.length > 3 && (
                <Col xs={4}>
                  <div
                    className="d-flex align-items-center justify-content-center h-100"
                    style={{
                      height: "50px",
                      borderRadius: "6px",
                      backgroundColor: "#f8f9fa",
                      border: "2px dashed #e9ecef",
                      fontSize: "0.75rem",
                      color: "#404040",
                      fontWeight: "600",
                    }}
                  >
                    +{thumbnails.length - 3}
                  </div>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div className="no-thumbnails-spacer"></div>
        )}
      </div>

      {/* Enhanced Category Info */}
      <Card.Body className="p-3">
        <div className="mb-3">
          <Card.Title
            className="h5 fw-bold mb-2"
            style={{
              color: "#1d1d1b",
              transition: "color 0.3s ease",
              fontSize: "1.25rem",
            }}
          >
            {name}
          </Card.Title>

          {description && (
            <Card.Text
              className="mb-3"
              style={{
                color: "#404040",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                transition: "color 0.3s ease",
              }}
            >
              {description}
            </Card.Text>
          )}
        </div>

        {/* Enhanced Features */}
        {features && features.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  className="feature-badge"
                  style={{
                    backgroundColor: "rgba(64, 64, 64, 0.1)",
                    color: "#404040",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    border: "1px solid rgba(64, 64, 64, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories */}
        {subcategories && subcategories.length > 0 && (
          <div className="mb-3">
            <small
              style={{
                color: "#404040",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              Categories: {subcategories.slice(0, 2).join(", ")}
              {subcategories.length > 2 && ` +${subcategories.length - 2} more`}
            </small>
          </div>
        )}

        {/* Action Arrow */}
        <div
          className="d-flex align-items-center justify-content-between mt-auto"
          style={{
            transform: isHovered ? "translateX(5px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <span
            style={{
              color: "#1d1d1b",
              fontSize: "0.9rem",
              fontWeight: "600",
              opacity: isHovered ? "1" : "0.7",
              transition: "opacity 0.3s ease",
            }}
          >
            Explore Collection
          </span>
          <ArrowRight
            size={18}
            style={{
              color: "#1d1d1b",
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;
