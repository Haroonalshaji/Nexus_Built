"use client";

import React from "react";

const DashboardReportsTree = ({ onGenerateReport, onExportData }) => (
  <div style={{ background: "#fdeaea", padding: 16, borderRadius: 12, display: "inline-block" }}>
    <div style={{ marginBottom: 8, fontWeight: "bold", color: "#8d2424" }}>Dashboard & Reports</div>
    <div style={{ marginLeft: 24 }}>
      <button
        onClick={onGenerateReport}
        style={{ display: "block", marginBottom: 8, background: "#f8d7da", border: "none", borderRadius: 8, padding: 8, color: "#8d2424", cursor: "pointer" }}
      >
        Generate Reports
      </button>
      <button
        onClick={onExportData}
        style={{ display: "block", background: "#f8d7da", border: "none", borderRadius: 8, padding: 8, color: "#8d2424", cursor: "pointer" }}
      >
        Export Data
      </button>
    </div>
  </div>
);

export default DashboardReportsTree; 