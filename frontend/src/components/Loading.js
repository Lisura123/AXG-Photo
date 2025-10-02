import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({
  size = "md",
  text = "Loading...",
  variant = "primary",
  fullScreen = false,
  skeleton = false,
  className = "",
}) => {
  if (skeleton) {
    return (
      <div
        className={`loading-skeleton rounded ${className}`}
        style={{
          width: "100%",
          height: "20px",
          marginBottom: "10px",
          background:
            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "loading 1.5s infinite",
        }}
      ></div>
    );
  }

  if (fullScreen) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center position-fixed w-100 h-100 ${className}`}
        style={{
          top: 0,
          left: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          zIndex: 9999,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            style={{
              color: "#1d1d1b",
              width: "50px",
              height: "50px",
              borderWidth: "4px",
            }}
          />
          <div className="mt-3 fw-medium" style={{ color: "#1d1d1b" }}>
            {text}
          </div>
        </div>
      </div>
    );
  }

  const spinnerSizes = {
    sm: { width: "20px", height: "20px" },
    md: { width: "30px", height: "30px" },
    lg: { width: "40px", height: "40px" },
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center py-4 ${className}`}
    >
      <Spinner
        animation="border"
        size={size}
        style={{
          color: "#1d1d1b",
          ...spinnerSizes[size],
        }}
        className="me-2"
      />
      <span className="fw-medium" style={{ color: "#404040" }}>
        {text}
      </span>
    </div>
  );
};

export default Loading;
