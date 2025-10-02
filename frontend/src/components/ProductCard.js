import React from "react";
import { Heart, Eye, Star } from "lucide-react";
import { Card, Button, Badge } from "react-bootstrap";

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    rating = 5,
    reviews = 0,
    isNew = false,
    isOnSale = false,
    discount = 0,
  } = product;

  return (
    <Card
      className="h-100 shadow-sm hover-shadow-lg card-hover-effect"
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Image Container */}
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          className="card-img-hover"
          style={{
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
        />

        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
          {isNew && (
            <Badge bg="success" className="small">
              New
            </Badge>
          )}
          {isOnSale && discount > 0 && (
            <Badge bg="danger" className="small">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="light"
          size="sm"
          onClick={() => onAddToWishlist?.(product)}
          className="position-absolute top-0 end-0 m-3 rounded-circle wishlist-btn btn-animated"
          style={{
            width: "40px",
            height: "40px",
            opacity: "0",
            transition: "all 0.3s ease",
          }}
        >
          <Heart size={16} style={{ color: "#404040" }} />
        </Button>

        {/* Quick View to Buy */}
        <Button
          variant="dark"
          size="sm"
          onClick={() => onAddToCart?.(product)}
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3 quick-add-btn btn-animated"
          style={{
            backgroundColor: "#1d1d1b",
            borderColor: "#1d1d1b",
            opacity: "0",
            transition: "all 0.3s ease",
          }}
        >
          View to Buy
        </Button>
      </div>

      {/* Product Info */}
      <Card.Body className="d-flex flex-column">
        {/* Product Name */}
        <Card.Title
          className="h6 mb-2"
          style={{
            color: "#1d1d1b",
            fontSize: "0.9rem",
            lineHeight: "1.2",
            height: "2.4em",
            overflow: "hidden",
          }}
        >
          {name}
        </Card.Title>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="d-flex align-items-center me-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={12}
                className={index < rating ? "text-warning" : "text-muted"}
                fill={index < rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <small className="text-muted">
            ({reviews} {reviews === 1 ? "review" : "reviews"})
          </small>
        </div>

        {/* Price */}
        <div className="d-flex align-items-center mb-3">
          <span className="fw-bold" style={{ color: "#1d1d1b" }}>
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-muted text-decoration-line-through ms-2 small">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* View to Buy Button */}
        <Button
          variant="dark"
          className="mt-auto d-flex align-items-center justify-content-center gap-2 btn-animated"
          onClick={() => onAddToCart?.(product)}
          style={{
            backgroundColor: "#1d1d1b",
            borderColor: "#1d1d1b",
          }}
        >
          <Eye size={16} />
          <span>View to Buy</span>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
