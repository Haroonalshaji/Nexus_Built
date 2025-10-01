"use client";
import { Card, CardBody, CardTitle, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportableTable = ({ title, data, columns, filters, setFilters, filterOptions, totalPages }) => {
  // 📤 Export Excel
  const handleExportExcel = () => {
    const exportData = [
      columns.map((col) => col.label),
      ...filteredData.map((row) => columns.map((col) => row[col.key])),
    ];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  // 📤 Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [columns.map((col) => col.label)],
      body: filteredData.map((row) => columns.map((col) => row[col.key])),
    });
    doc.save(`${title}.pdf`);
  };

  // ✅ Filtering Logic
  const filteredData = data.filter((row) => {
    const searchCheck = filters.search
      ? Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filters.search.toLowerCase())
      )
      : true;

    const orderStatusCheck = filters.orderStatus
      ? row.orderStatus === filters.orderStatus
      : true;

    const paymentStatusCheck = filters.paymentStatus
      ? row.paymentStatus === filters.paymentStatus
      : true;

    const statusCheck = filters.status
      ? row.status === filters.status
      : true;

    const priorityCheck = filters.priority
      ? row.priorityLevel === filters.priority
      : true;

    // ✅ Date Range Check (using addedOn)
    const dateCheck = (() => {
      if (!filters.fromDate && !filters.toDate) return true;

      const addedDate = new Date(row.addedOn).setHours(0, 0, 0, 0); // normalize
      const fromDate = filters.fromDate ? new Date(filters.fromDate).setHours(0, 0, 0, 0) : null;
      const toDate = filters.toDate ? new Date(filters.toDate).setHours(23, 59, 59, 999) : null;

      if (fromDate && addedDate < fromDate) return false;
      if (toDate && addedDate > toDate) return false;

      return true;
    })();

    return searchCheck && orderStatusCheck && paymentStatusCheck && statusCheck && priorityCheck && dateCheck;
  });

  // 🔄 Pagination
  const handlePrev = () => {
    if (filters.pageNo > 0) {
      setFilters((prev) => ({ ...prev, pageNo: prev.pageNo - 1 }));
    }
  };

  const handleNext = () => {
    if (filters.pageNo < totalPages - 1) {
      setFilters((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }));
    }
  };

  // 🔹 Pagination Logic
  const startIndex = filters.pageNo * filters.pageSize;
  const endIndex = startIndex + filters.pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPagesCalc = Math.ceil(filteredData.length / filters.pageSize);


  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle as="h5" className="mb-3">{title}</CardTitle>

        {/* 🔹 Filters */}
        <div className="grid md:grid-cols-6 gap-2 mb-3">
          {/* <Form.Control
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          /> */}

          {/* Order Status Dropdown */}
          {filterOptions?.orderStatus && (
            <Form.Select
              value={filters.orderStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, orderStatus: e.target.value }))}
            >
              <option value="">All Order Status</option>
              {filterOptions.orderStatus.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Form.Select>
          )}

          {/* Payment Status Dropdown */}
          {filterOptions?.paymentStatus && (
            <Form.Select
              value={filters.paymentStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}
            >
              <option value="">All Payment Status</option>
              {filterOptions.paymentStatus.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Form.Select>
          )}

          {/* Enquiry Status Dropdown */}
          {filterOptions?.status && (
            <Form.Select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              {filterOptions.status.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Form.Select>
          )}

          {/* Priority Dropdown */}
          {filterOptions?.priority && (
            <Form.Select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">All Priority</option>
              {filterOptions.priority.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          )}

          {/* Date Range */}
          <Form.Control
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
          />
          <Form.Control
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
          />

          {/* Clear Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setFilters({
                ...filters,
                search: "",
                orderStatus: "",
                paymentStatus: "",
                status: "",
                priority: "",
                fromDate: "",
                toDate: "",
                pageNo: 0,
              })
            }
          >
            Clear
          </Button>
        </div>

        {/* 🔹 Export Buttons */}
        <div className="mb-3 d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>

        {/* 🔹 Data Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="bg-light">
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={col.key === "priorityLevel" ? "text-capitalize" : ""}
                      >
                        {col.key === "addedOn"
                          ? new Date(row[col.key]).toLocaleDateString()  // format date nicely
                          : row[col.key || "-"]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center  text-muted">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={filters.pageNo === 0}
            onClick={() => setFilters((prev) => ({ ...prev, pageNo: prev.pageNo - 1 }))}
          >
            Previous
          </Button>

          <span>
            Page {filters.pageNo + 1} of {totalPagesCalc || 1}
          </span>

          <Button
            variant="outline-secondary"
            size="sm"
            disabled={filters.pageNo >= totalPagesCalc - 1}
            onClick={() => setFilters((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }))}
          >
            Next
          </Button>
        </div>

      </CardBody>
    </Card>
  );
};

export default ExportableTable;
