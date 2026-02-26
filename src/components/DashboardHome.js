import React from "react";

export default function DashboardHome({ onSelect }) {
  const categories = [
    "QC_FAILURE",
    "STOCK_MISMATCH",
    "DISPATCH_LOGS",
    "ROUTE_ISSUES"
  ];

  return (
    <div className="dashboard-home">
      <h1>Exception Management System</h1>

      <div className="card-grid">
        {categories.map(cat => (
          <div
            key={cat}
            className="card"
            onClick={() => onSelect(cat)}
          >
            <h3>{cat.replace("_", " ")}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}