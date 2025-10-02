import React from "react";

const SimpleChart = ({
  data,
  type = "bar",
  height = 200,
  colors = ["#404040", "#28a745", "#ffc107", "#17a2b8"],
  showValues = true,
  showLabels = true,
  animated = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: `${height}px`,
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <small style={{ color: "#6c757d" }}>No data available</small>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  if (type === "bar") {
    return (
      <div style={{ height: `${height}px`, padding: "20px 0" }}>
        <div className="d-flex align-items-end justify-content-between h-100">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 80; // 80% of container height
            return (
              <div
                key={index}
                className="d-flex flex-column align-items-center"
                style={{ flex: 1, maxWidth: "80px" }}
              >
                <small
                  className="mb-2 text-center fw-semibold"
                  style={{
                    color: "#1d1d1b",
                    fontSize: "0.75rem",
                    lineHeight: "1.1",
                    minHeight: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.value}
                </small>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "45px",
                    height: `${barHeight}%`,
                    backgroundColor: colors[index % colors.length],
                    borderRadius: "8px 8px 0 0",
                    transition: animated ? "all 0.5s ease" : "all 0.3s ease",
                    position: "relative",
                    cursor: "pointer",
                    animation: animated
                      ? `barGrow 0.8s ease-out ${index * 0.15}s both`
                      : "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                  title={`${item.label}: ${item.value}`}
                  className="bar-chart-item"
                />
                <small
                  className="mt-2 text-center"
                  style={{
                    color: "#404040",
                    fontSize: "0.7rem",
                    lineHeight: "1.1",
                    maxWidth: "60px",
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </small>
              </div>
            );
          })}
        </div>
        <style>
          {`
            .bar-chart-item:hover {
              opacity: 0.9;
              transform: scaleY(1.08) scaleX(1.05);
              box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
              filter: brightness(1.1);
            }
            
            @keyframes barGrow {
              0% {
                height: 2%;
                opacity: 0.5;
              }
              100% {
                opacity: 1;
              }
            }
            
            .bar-chart-container {
              position: relative;
            }
            
            .bar-value-tooltip {
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.7rem;
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
            }
            
            .bar-chart-item:hover + .bar-value-tooltip {
              opacity: 1;
            }
            
            .donut-segment:hover {
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1);
              stroke-width: 22px;
            }
            
            @keyframes donutGrow {
              0% {
                stroke-dasharray: 0 ${2 * Math.PI * (60 - 40)};
                opacity: 0.5;
              }
              100% {
                opacity: 1;
              }
            }
            
            .legend-item {
              transition: all 0.3s ease;
              cursor: pointer;
              padding: 4px 8px;
              border-radius: 6px;
            }
            
            .legend-item:hover {
              background-color: rgba(64, 64, 64, 0.05);
              transform: translateX(4px);
            }
          `}
        </style>
      </div>
    );
  }

  if (type === "donut") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    const radius = 60;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
      <div className="d-flex align-items-center justify-content-between">
        <div style={{ position: "relative", width: "140px", height: "140px" }}>
          <svg height="140" width="140" style={{ transform: "rotate(-90deg)" }}>
            <circle
              stroke="#f8f9fa"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx="70"
              cy="70"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${
                (percentage / 100) * circumference
              } ${circumference}`;
              const strokeDashoffset = -(
                (cumulativePercentage / 100) *
                circumference
              );

              const result = (
                <circle
                  key={index}
                  stroke={colors[index % colors.length]}
                  fill="transparent"
                  strokeWidth={strokeWidth - 2}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx="70"
                  cy="70"
                  style={{
                    transition: animated
                      ? "all 0.8s ease-in-out"
                      : "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    animation: animated
                      ? `donutGrow 1s ease-out ${index * 0.2}s both`
                      : "none",
                  }}
                  className="donut-segment"
                  strokeLinecap="round"
                />
              );

              cumulativePercentage += percentage;
              return result;
            })}
          </svg>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div
              className="fw-bold"
              style={{ color: "#1d1d1b", fontSize: "1.2rem" }}
            >
              {total}
            </div>
            <small style={{ color: "#404040", fontSize: "0.7rem" }}>
              Total
            </small>
          </div>
        </div>

        <div className="flex-grow-1 ms-4">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="d-flex align-items-center mb-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: colors[index % colors.length],
                    borderRadius: "2px",
                    marginRight: "8px",
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <small
                      className="fw-medium"
                      style={{ color: "#1d1d1b", fontSize: "0.8rem" }}
                    >
                      {item.label}
                    </small>
                    <small
                      className="fw-bold"
                      style={{ color: "#404040", fontSize: "0.75rem" }}
                    >
                      {item.value} ({percentage}%)
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "line") {
    const padding = 40;
    const chartWidth = height * 1.5; // Make it wider for line charts
    const chartHeight = height - padding * 2;

    return (
      <div
        style={{
          height: `${height}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg width="100%" height={height} style={{ background: "transparent" }}>
          {/* Grid Lines */}
          {[...Array(5)].map((_, i) => {
            const y = padding + (chartHeight / 4) * i;
            return (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={y}
                x2="95%"
                y2={y}
                stroke="rgba(64,64,64,0.1)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Line Path */}
          <path
            d={`M ${data
              .map((item, index) => {
                const x =
                  padding +
                  (index * (chartWidth - padding * 2)) / (data.length - 1);
                const y =
                  padding + chartHeight - (item.value / maxValue) * chartHeight;
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}`}
            fill="none"
            stroke={colors[0]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: animated ? "lineDraw 2s ease-out" : "none",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />

          {/* Data Points */}
          {data.map((item, index) => {
            const x =
              padding +
              (index * (chartWidth - padding * 2)) / (data.length - 1);
            const y =
              padding + chartHeight - (item.value / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={colors[0]}
                stroke="#ffffff"
                strokeWidth="2"
                style={{
                  cursor: "pointer",
                  animation: animated
                    ? `pointAppear 0.5s ease-out ${index * 0.1 + 1}s both`
                    : "none",
                }}
                className="line-point"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}

          {/* Labels */}
          {showLabels &&
            data.map((item, index) => {
              const x =
                padding +
                (index * (chartWidth - padding * 2)) / (data.length - 1);
              return (
                <text
                  key={index}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#404040"
                  style={{ fontFamily: "system-ui" }}
                >
                  {item.label.length > 8
                    ? item.label.substring(0, 8) + "..."
                    : item.label}
                </text>
              );
            })}
        </svg>

        <style>
          {`
            .line-point:hover {
              r: 6;
              filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            
            @keyframes lineDraw {
              0% {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            
            @keyframes pointAppear {
              0% {
                opacity: 0;
                transform: scale(0);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>
      </div>
    );
  }

  return null;
};

export default SimpleChart;
