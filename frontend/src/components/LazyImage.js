import React, { useState, useEffect } from "react";

const LazyImage = ({
  src,
  alt,
  className = "",
  style = {},
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div
      className={`lazy-image-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {/* Placeholder or loading skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="lazy-image-placeholder loading-skeleton"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "14px",
          }}
        >
          {placeholder || "Loading..."}
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
            opacity: isLoaded ? 1 : 0,
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div>⚠️</div>
          <div style={{ fontSize: "12px" }}>Failed to load image</div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
