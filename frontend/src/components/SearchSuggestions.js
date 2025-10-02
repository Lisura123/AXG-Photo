import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner, Button } from "react-bootstrap";
import { Search, Package, Tag, ArrowRight } from "lucide-react";

const SearchSuggestions = ({
  query,
  onSuggestionClick,
  onClose,
  isVisible,
  apiBase = "http://localhost:8070/api",
}) => {
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Fetch suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions({ products: [], categories: [] });
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${apiBase}/products/search/autocomplete?q=${encodeURIComponent(
            query
          )}&limit=8`
        );
        const data = await response.json();

        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({ products: [], categories: [] });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, apiBase]);

  // Get item at specific index (products first, then categories)
  const getItemAtIndex = useCallback(
    (index) => {
      if (index < suggestions.products.length) {
        return { ...suggestions.products[index], type: "product" };
      } else {
        return {
          ...suggestions.categories[index - suggestions.products.length],
          type: "category",
        };
      }
    },
    [suggestions.products, suggestions.categories]
  );

  // Handle item click
  const handleItemClick = useCallback(
    (item) => {
      if (item.type === "product") {
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
        suggestions.products.length + suggestions.categories.length;

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

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: "#fff3cd",
            color: "#1d1d1b",
            fontWeight: "600",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (
    !isVisible ||
    (!loading &&
      suggestions.products.length === 0 &&
      suggestions.categories.length === 0)
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
        maxHeight: "400px",
        overflowY: "auto",
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
                          width: "40px",
                          height: "40px",
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
                      <div
                        style={{
                          color: "#1d1d1b",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                          marginBottom: "2px",
                        }}
                      >
                        {highlightText(product.name, query)}
                      </div>
                      <div
                        style={{
                          color: "#404040",
                          fontSize: "0.8rem",
                        }}
                      >
                        {product.brand && (
                          <>{highlightText(product.brand, query)} • </>
                        )}
                        {product.category}
                      </div>
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

            {/* View All Results Option */}
            {(suggestions.products.length > 0 ||
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
