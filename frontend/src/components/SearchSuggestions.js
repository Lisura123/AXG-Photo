import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner, Button, Badge } from "react-bootstrap";
import {
  Search,
  Package,
  Tag,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

const SearchSuggestions = ({
  query,
  onSuggestionClick,
  onClose,
  isVisible,
  apiBase = "http://localhost:8070/api",
  selectedCategory = null,
}) => {
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
    popular: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Fetch suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        // If no query, show popular products instead
        try {
          setLoading(true);
          const popularResponse = await fetch(
            `${apiBase}/products/search/popular?limit=5${
              selectedCategory ? `&category=${selectedCategory}` : ""
            }`
          );
          const popularData = await popularResponse.json();

          if (popularData.success) {
            setSuggestions({
              products: [],
              categories: [],
              popular: popularData.data,
            });
          }
        } catch (error) {
          console.error("Error fetching popular products:", error);
          setSuggestions({ products: [], categories: [], popular: [] });
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams({
          q: query,
          limit: "8",
        });

        // Add category filter if selected
        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const response = await fetch(
          `${apiBase}/products/search/autocomplete?${params.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setSuggestions({
            ...data.data,
            popular: [], // Clear popular when showing search results
          });
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({ products: [], categories: [], popular: [] });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, apiBase, selectedCategory]);

  // Get item at specific index (products first, then categories, then popular)
  const getItemAtIndex = useCallback(
    (index) => {
      const { products, categories, popular } = suggestions;

      if (index < products.length) {
        return { ...products[index], type: "product" };
      } else if (index < products.length + categories.length) {
        return {
          ...categories[index - products.length],
          type: "category",
        };
      } else {
        return {
          ...popular[index - products.length - categories.length],
          type: "popular-product",
        };
      }
    },
    [suggestions]
  ); // Handle item click
  const handleItemClick = useCallback(
    (item) => {
      if (item.type === "product" || item.type === "popular-product") {
        navigate(`/products/${item.id}`);
      } else if (item.type === "category") {
        navigate(`/products?category=${item.slug}`);
      }
      onSuggestionClick(item);
      onClose();
    },
    [navigate, onSuggestionClick, onClose]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;

      const totalItems =
        suggestions.products.length +
        suggestions.categories.length +
        suggestions.popular.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleItemClick(getItemAtIndex(selectedIndex));
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isVisible,
    selectedIndex,
    suggestions,
    onClose,
    getItemAtIndex,
    handleItemClick,
  ]);

  // Enhanced highlight matching text with multiple words support
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    // Split query into words and create a pattern that matches any of them
    const words = query
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length === 0) return text;

    // Create regex that matches any of the words (case insensitive)
    const pattern = words
      .map(
        (word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape special characters
      )
      .join("|");

    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: "#fff3cd",
            color: "#1d1d1b",
            fontWeight: "600",
            padding: "1px 2px",
            borderRadius: "2px",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Helper function to render star rating
  const renderStarRating = (rating, size = 12) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? "#ffc107" : "none"}
            color="#ffc107"
            style={{ marginRight: "1px" }}
          />
        ))}
      </div>
    );
  };

  if (
    !isVisible ||
    (!loading &&
      suggestions.products.length === 0 &&
      suggestions.categories.length === 0 &&
      suggestions.popular.length === 0)
  ) {
    return null;
  }

  return (
    <Card
      ref={suggestionsRef}
      className="position-absolute w-100 shadow-lg"
      style={{
        top: "100%",
        left: 0,
        zIndex: 1050,
        borderRadius: "12px",
        border: "1px solid rgba(64, 64, 64, 0.15)",
        maxHeight: window.innerWidth <= 768 ? "70vh" : "400px", // Better mobile height
        overflowY: "auto",
        // Enhanced mobile scrolling
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
      }}
    >
      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center py-4">
            <Spinner size="sm" style={{ color: "#404040" }} />
            <small className="d-block mt-2 text-muted">Searching...</small>
          </div>
        ) : (
          <>
            {/* Product Suggestions */}
            {suggestions.products.length > 0 && (
              <div>
                <div
                  className="px-3 py-2 border-bottom"
                  style={{
                    backgroundColor: "#fafafa",
                    color: "#404040",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Package size={14} className="me-2" />
                  Products
                </div>
                {suggestions.products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`px-3 py-3 border-bottom cursor-pointer d-flex align-items-center ${
                      selectedIndex === index ? "bg-light" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedIndex === index ? "#f8f9fa" : "transparent",
                      transition: "background-color 0.2s ease",
                      minHeight: window.innerWidth <= 768 ? "70px" : "auto", // Better touch target on mobile
                      padding: window.innerWidth <= 768 ? "16px 12px" : "12px", // More padding on mobile
                    }}
                    onClick={() =>
                      handleItemClick({ ...product, type: "product" })
                    }
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {product.image && (
                      <img
                        src={`http://localhost:8070${product.image}`}
                        alt={product.name}
                        className="me-3"
                        style={{
                          width: window.innerWidth <= 768 ? "50px" : "45px", // Larger on mobile for easier touch
                          height: window.innerWidth <= 768 ? "50px" : "45px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid rgba(64, 64, 64, 0.1)",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <div
                          style={{
                            color: "#1d1d1b",
                            fontWeight: "500",
                            fontSize: "0.95rem",
                            flex: "1",
                          }}
                        >
                          {highlightText(product.name, query)}
                        </div>
                        {product.isFeatured && (
                          <Badge
                            bg="warning"
                            text="dark"
                            style={{ fontSize: "0.65rem", marginLeft: "8px" }}
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div
                        style={{
                          color: "#404040",
                          fontSize: "0.8rem",
                          marginBottom: "4px",
                        }}
                      >
                        {product.brand && (
                          <>{highlightText(product.brand, query)} • </>
                        )}
                        {product.category}
                        {!product.inStock && (
                          <span style={{ color: "#dc3545", marginLeft: "8px" }}>
                            • Out of Stock
                          </span>
                        )}
                      </div>
                      {product.rating > 0 && (
                        <div className="d-flex align-items-center">
                          {renderStarRating(product.rating, 10)}
                          <small style={{ color: "#666", marginLeft: "6px" }}>
                            ({product.reviewsCount || 0})
                          </small>
                        </div>
                      )}
                    </div>
                    <ArrowRight size={16} style={{ color: "#404040" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Category Suggestions */}
            {suggestions.categories.length > 0 && (
              <div>
                <div
                  className="px-3 py-2 border-bottom"
                  style={{
                    backgroundColor: "#fafafa",
                    color: "#404040",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Tag size={14} className="me-2" />
                  Categories
                </div>
                {suggestions.categories.map((category, index) => {
                  const categoryIndex = suggestions.products.length + index;
                  return (
                    <div
                      key={category.id}
                      className={`px-3 py-3 cursor-pointer d-flex align-items-center ${
                        selectedIndex === categoryIndex ? "bg-light" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedIndex === categoryIndex
                            ? "#f8f9fa"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                        borderBottom:
                          index < suggestions.categories.length - 1
                            ? "1px solid rgba(64, 64, 64, 0.1)"
                            : "none",
                      }}
                      onClick={() =>
                        handleItemClick({ ...category, type: "category" })
                      }
                      onMouseEnter={() => setSelectedIndex(categoryIndex)}
                    >
                      <div
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid rgba(64, 64, 64, 0.1)",
                        }}
                      >
                        <Tag size={18} style={{ color: "#404040" }} />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{
                            color: "#1d1d1b",
                            fontWeight: "500",
                            fontSize: "0.95rem",
                          }}
                        >
                          {highlightText(category.name, query)}
                        </div>
                        <div
                          style={{
                            color: "#404040",
                            fontSize: "0.8rem",
                          }}
                        >
                          Browse all products in {category.name}
                        </div>
                      </div>
                      <ArrowRight size={16} style={{ color: "#404040" }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Popular Products (shown when no query) */}
            {suggestions.popular.length > 0 && (
              <div>
                <div
                  className="px-3 py-2 border-bottom"
                  style={{
                    backgroundColor: "#fafafa",
                    color: "#404040",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <TrendingUp size={14} className="me-2" />
                  Popular Products
                </div>
                {suggestions.popular.map((product, index) => {
                  const popularIndex =
                    suggestions.products.length +
                    suggestions.categories.length +
                    index;
                  return (
                    <div
                      key={product.id}
                      className={`px-3 py-3 cursor-pointer d-flex align-items-center ${
                        selectedIndex === popularIndex ? "bg-light" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedIndex === popularIndex
                            ? "#f8f9fa"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                        borderBottom:
                          index < suggestions.popular.length - 1
                            ? "1px solid rgba(64, 64, 64, 0.1)"
                            : "none",
                      }}
                      onClick={() =>
                        handleItemClick({ ...product, type: "popular-product" })
                      }
                      onMouseEnter={() => setSelectedIndex(popularIndex)}
                    >
                      {product.image ? (
                        <img
                          src={`http://localhost:8070${product.image}`}
                          alt={product.name}
                          className="me-3"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid rgba(64, 64, 64, 0.1)",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid rgba(64, 64, 64, 0.1)",
                          }}
                        >
                          <Package size={18} style={{ color: "#404040" }} />
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <div
                            style={{
                              color: "#1d1d1b",
                              fontWeight: "500",
                              fontSize: "0.95rem",
                              flex: "1",
                            }}
                          >
                            {product.name}
                          </div>
                          {product.isFeatured && (
                            <Badge
                              bg="warning"
                              text="dark"
                              style={{ fontSize: "0.65rem", marginLeft: "8px" }}
                            >
                              <Zap size={10} className="me-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div
                          style={{
                            color: "#404040",
                            fontSize: "0.8rem",
                            marginBottom: "4px",
                          }}
                        >
                          {product.brand} • {product.category}
                        </div>
                        {product.rating > 0 && (
                          <div className="d-flex align-items-center">
                            {renderStarRating(product.rating, 10)}
                            <small style={{ color: "#666", marginLeft: "6px" }}>
                              ({product.reviewsCount || 0})
                            </small>
                          </div>
                        )}
                      </div>
                      <ArrowRight size={16} style={{ color: "#404040" }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* View All Results Option */}
            {query &&
              (suggestions.products.length > 0 ||
                suggestions.categories.length > 0) && (
                <div className="px-3 py-3 border-top">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100"
                    style={{
                      borderColor: "#404040",
                      color: "#404040",
                      borderRadius: "8px",
                      fontWeight: "500",
                    }}
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                  >
                    <Search size={14} className="me-2" />
                    View all results for "{query}"
                  </Button>
                </div>
              )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default SearchSuggestions;
