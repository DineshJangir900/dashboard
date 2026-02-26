import React, { useState } from "react";
import {
  qcFailures,
  stockMismatch,
  dispatchLogs,
  routeIssues,
  operationErrors
} from "../data";
import StatusBadge from "./StatusBadge";
import Toast from "./Toast";

const CATEGORY_CONFIG = {
  QC_FAILURE: {
    label: "QC Failures",
    description:
      "Track and resolve product quality issues detected during picking, with full visibility of repacking and disposal actions.",
    statusOptions: ["OPEN", "ACTION_TAKEN", "CLOSED"],
    columns: [
      "id",
      "item_id",
      "item_name",
      "item_brand",
      "qr_id",
      "batch_id",
      "expiry_date",
      "variety",
      "qty",
      "reason",
      "warehouse",
      "created_by",
      "phone_number",
      "notify_phone",
      "status",
      "action_type",
      "status_updated_by",
      "created_at",
      "status_updated_at"
    ]
  },
  STOCK_MISMATCH: {
    label: "Stock Mismatch Alerts",
    description:
      "Monitor cases where physical stock exists but system inventory is incorrect, and drive fast verification and correction.",
    statusOptions: ["OPEN", "VERIFIED", "RESOLVED"],
    columns: [
      "id",
      "item_id",
      "warehouse",
      "created_by",
      "phone_number",
      "notify_phone",
      "created_at",
      "status",
      "scenario",
      "action_required"
    ]
  },
  DISPATCH_LOGS: {
    label: "Dispatch Support & Operational Issues",
    description:
      "Capture picking, loading, and dispatch problems from the floor and coordinate rapid operational support.",
    statusOptions: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    columns: [
      "id",
      "issue_category",
      "order_id",
      "route_id",
      "item_id",
      "description",
      "photo_url",
      "warehouse",
      "created_by",
      "phone_number",
      "created_at",
      "status"
    ]
  },
  ROUTE_ISSUES: {
    label: "Route Delay Monitoring",
    description:
      "Let drivers report en-route incidents and delays so transport teams can intervene quickly.",
    statusOptions: ["OPEN", "SUPPORT_SENT", "RESOLVED"],
    columns: [
      "id",
      "route_id",
      "driver_id",
      "issue_type",
      "description",
      "latitude",
      "longitude",
      "photo_url",
      "need_help",
      "created_by",
      "phone_number",
      "created_at",
      "status"
    ]
  },
  OPERATION_ERRORS: {
    label: "Operation Errors",
    description:
      "Centralise high-level operational and system errors for management visibility and follow-up.",
    statusOptions: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    columns: [
      "id",
      "description",
      "warehouse",
      "created_by",
      "phone_number",
      "created_at",
      "status"
    ]
  }
};

function buildNotificationMessage(category, previousStatus, record, newStatus) {
  if (category === "QC_FAILURE") {
    if (!previousStatus) {
      return `QC failure logged. Notifying allocator at ${record.notify_phone}.`;
    }
    if (previousStatus === "OPEN" && newStatus === "ACTION_TAKEN") {
      return `QC status set to ACTION_TAKEN. Notifying picker at ${record.phone_number}.`;
    }
    if (newStatus === "CLOSED") {
      return `QC case closed. Notifying allocator at ${record.notify_phone}.`;
    }
  }

  if (category === "STOCK_MISMATCH") {
    if (!previousStatus) {
      return `Stock mismatch created. Notifying allocator at ${record.notify_phone}.`;
    }
    if (newStatus === "VERIFIED") {
      return `Stock mismatch verified. Notifying picker at ${record.phone_number}.`;
    }
    if (newStatus === "RESOLVED") {
      return `Inventory updated. Notifying picker at ${record.phone_number}.`;
    }
  }

  if (category === "DISPATCH_LOGS") {
    if (!previousStatus) {
      return `Dispatch issue logged. Notifying operations team.`;
    }
    if (newStatus === "IN_PROGRESS") {
      return `Issue under investigation. Notifying reporter at ${record.phone_number}.`;
    }
    if (newStatus === "RESOLVED") {
      return `Issue resolved. Notifying reporter at ${record.phone_number}.`;
    }
    if (newStatus === "CLOSED") {
      return `Issue closed. Confirmation sent to ${record.phone_number}.`;
    }
  }

  if (category === "ROUTE_ISSUES") {
    if (!previousStatus) {
      return `Route issue reported. Alerting transport team.`;
    }
    if (newStatus === "SUPPORT_SENT") {
      return `Support dispatched. Notifying driver at ${record.phone_number}.`;
    }
    if (newStatus === "RESOLVED") {
      return `Route issue resolved.`;
    }
  }

  return "Status updated. Notification sent.";
}

export default function CategoryScreen({ category, onBack }) {
  const [toast, setToast] = useState(null);
  const todayISO = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const dataMap = {
    QC_FAILURE: qcFailures,
    STOCK_MISMATCH: stockMismatch,
    DISPATCH_LOGS: dispatchLogs,
    ROUTE_ISSUES: routeIssues,
    OPERATION_ERRORS: operationErrors
  };

  const config = CATEGORY_CONFIG[category] || {
    label: category.replace("_", " "),
    statusOptions: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    columns: Object.keys((dataMap[category] && dataMap[category][0]) || {})
  };

  const initialRecords = (dataMap[category] || []).slice().sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const [records, setRecords] = useState(initialRecords);

  const handleRefresh = () => {
    setSelectedDate(todayISO);
  };

  const updateStatus = (id, newStatus) => {
    const existing = records.find(r => r.id === id);
    if (!existing) return;

    const updatedRecord = {
      ...existing,
      status: newStatus,
      status_updated_at: new Date().toISOString()
    };

    const updated = records.map(r => (r.id === id ? updatedRecord : r));
    setRecords(updated);

    const message = buildNotificationMessage(
      category,
      existing.status,
      updatedRecord,
      newStatus
    );

    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredRecords = records.filter(r => {
    if (!selectedDate) return true;
    const recordDay = r.created_at?.slice(0, 10);
    return recordDay === selectedDate;
  });

  const visibleColumns =
    config.columns?.length > 0
      ? config.columns
      : Object.keys(filteredRecords[0] || {});

  return (
    <div className="category-screen">
      <div className="category-header-row">
        <button className="back-button" onClick={onBack}>
          ⬅ Back to Dashboard
        </button>
        <div>
          <h2 className="category-title">{config.label}</h2>
          {config.description && (
            <p className="category-subtitle">{config.description}</p>
          )}
        </div>
      </div>

      <div className="category-toolbar">
        <button className="toolbar-button" onClick={handleRefresh}>
          ⟳ Refresh
        </button>
      </div>

      <div className="filter-bar">
        <span>
          Total Records: <strong>{records.length}</strong>
        </span>

        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {visibleColumns.map(key => (
              <th key={key}>{key}</th>
            ))}
            <th>Update Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredRecords.length === 0 && (
            <tr>
              <td colSpan={visibleColumns.length + 1}>
                No records found for selected date
              </td>
            </tr>
          )}

          {filteredRecords.map(record => (
            <tr key={record.id}>
              {visibleColumns.map(col => {
                const value = record[col];

                if (col === "status") {
                  return (
                    <td key={col}>
                      <StatusBadge status={value} />
                    </td>
                  );
                }

                return (
                  <td key={col}>
                    {value !== undefined && value !== null
                      ? value.toString()
                      : ""}
                  </td>
                );
              })}

              <td>
                <select
                  value={record.status}
                  onChange={e => updateStatus(record.id, e.target.value)}
                >
                  {config.statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
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