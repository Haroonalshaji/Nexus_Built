"use client";
import React, { useState } from "react";
import { Card, CardBody, CardTitle, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const sampleVendors = [
  {
    id: 1,
    name: "Vendor A",
    work: "Plumbing",
    quotation: "$1,200",
    details: "Completed installation of pipes on 2024-03-01",
    status: "Completed"
  },
  {
    id: 2,
    name: "Vendor B",
    work: "Electrical",
    quotation: "$2,500",
    details: "Wiring and lighting setup, ongoing",
    status: "Pending"
  },
  {
    id: 3,
    name: "Vendor C",
    work: "Painting",
    quotation: "$900",
    details: "Interior painting, completed 2024-02-15",
    status: "Completed"
  },
  {
    id: 4,
    name: "Vendor D",
    work: "Flooring",
    quotation: "$3,000",
    details: "Tile installation, scheduled for 2024-04-10",
    status: "Cancelled"
  },
  {
    id: 5,
    name: "Vendor E",
    work: "Roofing",
    quotation: "$4,500",
    details: "Roof repair, completed 2024-01-20",
    status: "Completed"
  },
  {
    id: 6,
    name: "Vendor F",
    work: "Carpentry",
    quotation: "$2,000",
    details: "Cabinet installation, ongoing",
    status: "Pending"
  }
];

const PAGE_SIZE = 5;
const columns = [
  { key: "id", label: "Vendor ID" },
  { key: "name", label: "Vendor Name" },
  { key: "work", label: "Work" },
  { key: "quotation", label: "Quotation" },
  { key: "details", label: "Details" },
  { key: "status", label: "Status" }
];

const statusBadge = status => {
  if (status === "Completed") return <span className="badge bg-success-subtle text-success py-1 px-2 fs-12">Completed</span>;
  if (status === "Pending") return <span className="badge bg-warning-subtle text-warning py-1 px-2 fs-12">Pending</span>;
  return <span className="badge bg-danger-subtle text-danger py-1 px-2 fs-12">Cancelled</span>;
};

const VendorDashboardTable = () => {
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Sorting logic
  const sortedData = React.useMemo(() => {
    let data = [...sampleVendors];
    if (sortCol) {
      data.sort((a, b) => {
        if (a[sortCol] < b[sortCol]) return sortDir === "asc" ? -1 : 1;
        if (a[sortCol] > b[sortCol]) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [sortCol, sortDir]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const currentData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = col => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const handleExportExcel = () => {
    const exportData = [columns.map(col => col.label), ...sortedData.map(row => columns.map(col => col.key === 'status' ? row[col.key] : row[col.key]))];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors_dashboard.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendors Dashboard", 10, 10);
    let y = 20;
    doc.text(columns.map(col => col.label).join(" | "), 10, y);
    y += 10;
    sortedData.forEach((row, i) => {
      doc.text(columns.map(col => row[col.key]).join(" | "), 10, y + i * 10);
    });
    doc.save("vendors_dashboard.pdf");
  };

  return (
    <Card className="mb-4">
      <CardBody className="p-0">
        <CardTitle as="h5" className="mb-3 p-3">Vendors Dashboard</CardTitle>
        <div className="mb-3 d-flex gap-2 px-3">
          <Button variant="outline-primary" size="sm" onClick={handleExportExcel}>
            Export as Excel
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleExportPDF}>
            Export as PDF
          </Button>
        </div>
        <div className="table-responsive m-3">
          <table className="table align-middle text-nowrap table-hover table-centered mb-0 table-bordered rounded">
            <thead className="bg-light-subtle">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortCol === col.key ? (
                      sortDir === "asc" ? " ▲" : " ▼"
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.work}</td>
                  <td>{item.quotation}</td>
                  <td>{item.details}</td>
                  <td>{statusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end align-items-center p-3">
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="mx-2">Page {page} of {totalPages}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default VendorDashboardTable; 