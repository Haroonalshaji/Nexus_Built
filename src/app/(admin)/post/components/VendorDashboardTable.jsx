"use client";
import { useDebugValue, useEffect, useState } from "react";
import ExportableTable from "@/components/ExportableTable"; // 👈 use the component you shared
import { getAllAdminOrders, getAllEnquiries } from "@/utils/apiCalls/commonApi";

// --- Sample Data ---
const ordersData1 = [
  {
    orderGuid: "caeba4e3-a3c1-4be9-9bc7-efbbdd70754d",
    orderNo: "NXBOID0078",
    vendorGuid: "6a2a4fec-e935-4a15-b5bf-014fe2dfce67",
    subscriptionGuid: "09193439-CA8A-499C-9DF6-50263EB534F6",
    name: "Vishnu",
    lastName: "test",
    email: "vishnu@brandstory.in",
    contact: "",
    paymentMode: "Payment Gateway",
    orderStatus: "Active",
    addedOn: "2025-09-22T11:05:14.92",
    paymentStatus: "Initiated",
    paymentId: "",
    priceAtPurchase: 49,
    updatedOn: "2025-09-22T11:05:14.92",
  },
];

const enquiriesData1 = [
  {
    rowNumber: 1,
    totalCount: 4,
    enquiryGuid: "3518c47b-9a5a-4b22-9ada-b0abf55ba806",
    customerGuid: "b1271b7f-799d-4895-9faf-67f714f110fc",
    customerName: "Haroon Shaji",
    emailAddress: "haroonalshaji@gmail.com",
    phoneNumber: "9207619827",
    priorityLevel: "medium",
    serviceRequired: "Stone (Supply & Installation)",
    description: "categoryNamecategoryNamecategoryNamecategoryNamecategoryName",
    totalAmount: 0,
    addedOn: "2025-09-23T22:11:02.45",
    status: "Open",
    statusOn: "2025-09-23T22:11:02.45",
    statusNotes: "",
    attachmentCount: 2,
    totalQuotes: 2,
  },
];

// --- Column Configs ---
const orderColumns = [
  { key: "orderNo", label: "Order No" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "paymentMode", label: "Payment Mode" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "orderStatus", label: "Order Status" },
  { key: "paymentId", label: "Transaction ID" },
  { key: "priceAtPurchase", label: "Price" },
  { key: "addedOn", label: "Added On" },
];

const enquiryColumns = [
  { key: "rowNumber", label: "#" },
  { key: "customerName", label: "Customer Name" },
  { key: "emailAddress", label: "Email" },
  { key: "phoneNumber", label: "Phone" },
  { key: "priorityLevel", label: "Priority" },
  { key: "serviceRequired", label: "Service Required" },
  { key: "status", label: "Status" },
  { key: "addedOn", label: "Added On" },
];

// --- Page Component ---
export default function TablesPage() {
  const [ordersData, setOrdersData] = useState([])
  const [enquiriesData, setEnquiriesData] = useState([])

  const [orderFilters, setOrderFilters] = useState({
    search: "",
    orderStatus: "",    // 👈 separate for order status
    paymentStatus: "",  // 👈 separate for payment status
    fromDate: "",
    toDate: "",
    pageNo: 0,
    pageSize: 20
  });


  const [enquiryFilters, setEnquiryFilters] = useState({
    search: "",
    status: "", // 👈 enquiry status
    priority: "", // 👈 enquiry priority
    fromDate: "",
    toDate: "",
    pageNo: 0,
    pageSize: 20
  });


  const getAllTransactionDetails = async () => {
    try {
      const result = await getAllAdminOrders();
      setOrdersData(result?.data?.result || []);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const getEnquiryDetails = async () => {
    let payload = {
      pageSize: enquiryFilters.pageSize,
      pageNo: enquiryFilters.pageNo,
      fromDate: enquiryFilters.fromDate,
      toDat: enquiryFilters.toDate,
      sParam: enquiryFilters.search,
      status: enquiryFilters.status,
      priority: enquiryFilters.priority
    }
    try {
      const result = await getAllEnquiries(payload);
      setEnquiriesData(result?.data?.result || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllTransactionDetails();
    getEnquiryDetails();
  }, [])

  return (
    <div className="container my-5">
      {/* Orders Table */}
      <ExportableTable
        title="Transactions"
        data={ordersData}
        columns={orderColumns}
        filters={orderFilters}
        setFilters={setOrderFilters}
        filterOptions={{
          orderStatus: ["Active", "Blocked"], // 👈 for orderStatus
          paymentStatus: ["Initiated", "Success"], // 👈 reusing priority dropdown for paymentStatus
        }}
        totalPages={1}
      />

      {/* Enquiries Table */}
      <ExportableTable
        title="Enquiries"
        data={enquiriesData}
        columns={enquiryColumns}
        filters={enquiryFilters}
        setFilters={setEnquiryFilters}
        filterOptions={{
          status: ["Open", "Closed"],
          priority: ["low", "medium", "high"],
        }}
        totalPages={1}
      />
    </div>
  );
}
