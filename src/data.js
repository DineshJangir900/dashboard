// ================= QC FAILURES =================
export const qcFailures = [
    {
      id: 1,
      item_id: "1004784521",
      item_name: "Basmati Mini Dubar 26kg",
      item_brand: "Khetika",
      qr_id: "QR123456",
      batch_id: "B202401",
      expiry_date: "2026-12-31",
      variety: "BAG",
      qty: 5,
      reason: "DAMAGED",
      warehouse: "DHANSAR",
      created_by: "Dinesh",
      phone_number: "9876543210",
      notify_phone: "9123456780",
      status: "OPEN",
      action_type: null,
      status_updated_by: null,
      created_at: "2026-02-24 10:15",
      status_updated_at: null
    }
  ];
  
  // ================= STOCK MISMATCH =================
  export const stockMismatch = [
    {
      id: 1,
      item_id: "1004784601",
      warehouse: "DHANSAR",
      created_by: "Dinesh",
      phone_number: "9876543210",
      notify_phone: "9123456780",
      created_at: "2026-02-25 09:10",
      status: "OPEN",
      scenario:
        "Physical stock available but system inventory shows zero.",
      action_required:
        "Verification by warehouse inventory team."
    }
  ];
  
  // ================= DISPATCH SUPPORT LOGS =================
  export const dispatchLogs = [
    {
      id: 1,
      issue_category: "Damaged Package",
      order_id: "ORD10234",
      route_id: null,
      item_id: "1004784521",
      description: "Outer carton damaged during loading.",
      photo_url: "",
      warehouse: "DHANSAR",
      created_by: "Ravi",
      phone_number: "9876500000",
      created_at: "2026-02-26 08:45",
      status: "IN_PROGRESS"
    }
  ];
  
  // ================= ROUTE ISSUES =================
  export const routeIssues = [
    {
      id: 1,
      route_id: "RT-101",
      driver_id: "DRV-22",
      issue_type: "Vehicle Breakdown",
      description: "Truck stopped due to engine failure.",
      latitude: "28.6139",
      longitude: "77.2090",
      photo_url: "",
      need_help: true,
      created_by: "Amit",
      phone_number: "9999999999",
      created_at: "2026-02-26 07:30",
      status: "OPEN"
    }
  ];