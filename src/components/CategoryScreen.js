import React, { useState } from "react";
import {
  qcFailures,
  stockMismatch,
  dispatchLogs,
  routeIssues
} from "../data";
import StatusBadge from "./StatusBadge";
import Toast from "./Toast";

export default function CategoryScreen({ category, onBack }) {
  const [toast, setToast] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const dataMap = {
    QC_FAILURE: qcFailures,
    STOCK_MISMATCH: stockMismatch,
    DISPATCH_LOGS: dispatchLogs,
    ROUTE_ISSUES: routeIssues
  };

  const [records, setRecords] = useState(
    [...dataMap[category]].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  );

  const updateStatus = (id, newStatus) => {
    const updated = records.map(r =>
      r.id === id
        ? { ...r, status: newStatus, status_updated_at: new Date() }
        : r
    );
    setRecords(updated);

    setToast("Status updated successfully. Notification sent to user.");
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRecords = records.filter(r => {
    if (!fromDate && !toDate) return true;

    const recordDate = new Date(r.created_at);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && recordDate < from) return false;
    if (to && recordDate > to) return false;
    return true;
  });

  return (
    <div className="category-screen">
      <button onClick={onBack}>⬅ Back</button>

      <h2>{category.replace("_", " ")}</h2>

      <div className="filter-bar">
        <input type="date" onChange={e => setFromDate(e.target.value)} />
        <input type="date" onChange={e => setToDate(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr>
            {Object.keys(filteredRecords[0] || {}).map(key => (
              <th key={key}>{key}</th>
            ))}
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map(record => (
            <tr key={record.id}>
              {Object.values(record).map((val, i) => (
                <td key={i}>
                  {i === 13 || record.status === val ? (
                    <StatusBadge status={val} />
                  ) : (
                    val?.toString()
                  )}
                </td>
              ))}
              <td>
                <select
                  value={record.status}
                  onChange={e =>
                    updateStatus(record.id, e.target.value)
                  }
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {toast && <Toast message={toast} />}
    </div>
  );
}