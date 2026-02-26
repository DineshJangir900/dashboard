import React, { useMemo, useState } from "react";
import data from "../data";

const {
  qcFailures,
  stockMismatch,
  dispatchLogs,
  routeIssues,
  operationErrors
} = data;

// Derive a "today" reference from the latest created_at
// in the data so that sample data always has active issues.
const allCreatedAt = [
  ...qcFailures,
  ...stockMismatch,
  ...dispatchLogs,
  ...routeIssues,
  ...operationErrors
].map(r => new Date(r.created_at));

const latestDate =
  allCreatedAt.length > 0
    ? new Date(Math.max(...allCreatedAt.map(d => d.getTime())))
    : new Date();

const TODAY_REF = latestDate.toISOString().slice(0, 10);

export default function TopIssuesScreen({ onBack }) {
  const rows = useMemo(() => {
    const isToday = dateStr => dateStr && dateStr.startsWith(TODAY_REF);

    const isWithinLast7Days = dateStr => {
      if (!dateStr) return false;
      const current = new Date(TODAY_REF);
      const recordDate = new Date(dateStr);
      const diffTime = current - recordDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    };

    const all = [];

    // ========== DATA SOURCES (LOCAL ENGINE) ==========

    qcFailures.forEach(r => {
      all.push({
        exception_type: "QC_FAILURE",
        reference_id: r.id,
        warehouse: r.warehouse,
        created_at: r.created_at
      });
    });

    stockMismatch.forEach(r => {
      all.push({
        exception_type: "STOCK_MISMATCH",
        reference_id: r.id,
        warehouse: r.warehouse,
        created_at: r.created_at
      });
    });

    dispatchLogs.forEach(r => {
      all.push({
        exception_type: "DISPATCH_SUPPORT",
        reference_id: r.id,
        warehouse: r.warehouse,
        created_at: r.created_at
      });
    });

    routeIssues.forEach(r => {
      all.push({
        exception_type: "ROUTE_ISSUE",
        reference_id: r.id,
        warehouse: r.warehouse,
        created_at: r.created_at
      });
    });

    operationErrors.forEach(r => {
      all.push({
        exception_type: "OPERATION_ERROR",
        reference_id: r.id,
        warehouse: r.warehouse,
        created_at: r.created_at
      });
    });

    // ========== GROUPING: exception_type + reference_id + warehouse ==========

    const grouped = new Map();

    all.forEach(item => {
      const key = `${item.exception_type}::${item.reference_id}::${item.warehouse}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          exception_type: item.exception_type,
          reference_id: item.reference_id,
          warehouse: item.warehouse,
          today_count: 0,
          repeat_count: 0
        });
      }

      const current = grouped.get(key);

      if (isToday(item.created_at)) {
        current.today_count += 1;
      }

      if (isWithinLast7Days(item.created_at)) {
        current.repeat_count += 1;
      }
    });

    // ========== SCORING: Score = (Today × 2) + Last 7 Days ==========

    const scored = Array.from(grouped.values()).map(item => ({
      ...item,
      score: item.today_count * 2 + item.repeat_count
    }));

    // ========== SORTING & TOP 10 ==========

    const sorted = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        ...item
      }));

    return sorted;
  }, []);

  const today = TODAY_REF;
  const [focusTop3, setFocusTop3] = useState(false);

  const handleRefresh = () => {
    // Derived from static data; no-op for now but wired for future API.
  };

  const toggleFocusTop3 = () => {
    setFocusTop3(prev => !prev);
  };

  const visibleRows = focusTop3 ? rows.slice(0, 3) : rows;

  return (
    <div className="category-screen">
      <div className="category-header-row">
        <button className="back-button" onClick={onBack}>
          ⬅ Back to Dashboard
        </button>
        <div>
          <h2 className="category-title">Daily Top 10 Issues</h2>
          <p className="category-subtitle">
            Prioritised list of the most critical operational exceptions across QC, stock, dispatch, route, and system modules.
          </p>
        </div>
      </div>

      <div className="category-toolbar">
        <div className="category-toolbar-left">
          <span>Insights tools</span>
        </div>
        <div className="category-toolbar-right">
          <button className="toolbar-button" type="button" onClick={handleRefresh}>
            ⟳ Refresh
          </button>
          <button
            className="toolbar-button primary"
            type="button"
            onClick={toggleFocusTop3}
          >
            ★ {focusTop3 ? "Show Top 10" : "Focus on Top 3"}
          </button>
        </div>
      </div>

      <p className="top10-meta">
        <span className="pill pill-soft">
          Date: <strong>{today}</strong>
        </span>
        <span className="pill pill-soft">
          Total Records: <strong>{rows.length}</strong>
        </span>
        <span className="pill pill-outline">
          Score = (Today Issue Count × 2) + Last 7 Days Repeat Count
        </span>
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Exception Type</th>
            <th>Reference ID</th>
            <th>Warehouse / Route</th>
            <th>Today</th>
            <th>7 Day Repeat</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={index}>
              <td>{row.rank}</td>
              <td>{row.exception_type}</td>
              <td>{row.reference_id}</td>
              <td>{row.warehouse}</td>
              <td>{row.today_count}</td>
              <td>{row.repeat_count}</td>
              <td>
                <strong>{row.score}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

