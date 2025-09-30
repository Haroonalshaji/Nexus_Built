"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Button,
    Modal,
    Form,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRouter } from "next/navigation";
import { approveVendorApplication, getPendingVendorApplications, rejectVendorApplication } from "@/utils/apiCalls/commonApi";

const VendorClient = () => {
    const { push } = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [comment, setComment] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🚀 store API vendors here
    const [vendors, setVendors] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalVendorsListed = Math.ceil(vendors.length / itemsPerPage);
    const currentData = vendors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleShow = (type, id) => {
        setActionType(type);
        setSelectedId(id);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setComment("");
        setSelectedId(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (actionType === "approve") {
                const approvedResponse = await approveVendorApplication(selectedId);
                console.log(`Approved vendor ${approvedResponse}`);
                setShowModal(false);
            } else if (actionType === "reject") {
                const rejectedResponse = await rejectVendorApplication(selectedId);
                setShowModal(false);
                console.log(`Rejected vendor ${rejectedResponse}`);
            }

            // Refresh the vendor list after action
            await searchForUser();

        } catch (error) {
            console.error("Error processing request:", error);
        } finally {
            handleClose();
            setLoading(false);
        }
    };

    const searchForUser = async () => {
        try {
            setLoading(true);
            const listOfPendingApproval = await getPendingVendorApplications();
            console.log(listOfPendingApproval.data.result);
            setVendors(listOfPendingApproval.data.result || []);
        } catch (error) {
            console.error(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        searchForUser();
    }, []);

    const renderPagination = () => (
        <div className="d-flex justify-content-center px-3 py-2">
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalVendorsListed }, (_, i) => i + 1).map(
                        (page) => (
                            <li
                                key={page}
                                className={`page-item ${page === currentPage ? "active" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    )}
                    <li
                        className={`page-item ${currentPage === totalVendorsListed ? "disabled" : ""
                            }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );

    return (
        <Row>
            <Col xl={12}>
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <CardTitle as={"h4"}>Latest Vendor Applications</CardTitle>
                    </CardHeader>

                    <CardBody className="p-0">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                                        <thead className="bg-light-subtle">
                                            <tr>
                                                <th style={{ width: 20 }}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="customCheck1"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="customCheck1"
                                                        />
                                                    </div>
                                                </th>
                                                <th>Vendor ID</th>
                                                <th>Vendor Name</th>
                                                <th>Vendor Email</th>
                                                <th>Business Name</th>
                                                <th>Registered On</th>
                                                <th>Experience</th>
                                                <th>Application Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.sort((a, b) => new Date(b.registeredOn) - new Date(a.registeredOn)).map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id={`customCheck${idx}`}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`customCheck${idx}`}
                                                            >
                                                                &nbsp;
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link href="#" className="text-dark fw-medium">
                                                            #{item.vendorGuid
                                                                ? `${item.vendorGuid.substring(0, 6)}...${item.vendorGuid.slice(-4)}`
                                                                : ""}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {item.firstName} {item.lastName}
                                                    </td>
                                                    <td>{item.emailAddress}</td>
                                                    <td>{item.businessName}</td>
                                                    <td>
                                                        {item.registeredOn &&
                                                            item.registeredOn !== "0001-01-01T00:00:00"
                                                            ? new Date(item.registeredOn).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )
                                                            : "N/A"}
                                                    </td>
                                                    <td>{item.yearsOfExperience}</td>
                                                    <td>
                                                        <span
                                                            className={`badge bg-${item.businessStatus === "PendingVerification"
                                                                ? "warning"
                                                                : "success"
                                                                }-subtle text-${item.businessStatus === "PendingVerification"
                                                                    ? "warning"
                                                                    : "success"
                                                                } py-1 px-2 fs-12`}
                                                        >
                                                            {item.businessStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleShow("approve", item.businessGuid)
                                                                }
                                                                disabled={item.businessStatus === "Approved"}
                                                            >
                                                                <IconifyIcon
                                                                    icon="solar:check-circle-bold"
                                                                    className="align-middle fs-18 me-1"
                                                                />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleShow("reject", item.businessGuid)
                                                                }
                                                                disabled={item.businessStatus === "Approved"}
                                                            >
                                                                <IconifyIcon
                                                                    icon="solar:close-circle-bold"
                                                                    className="align-middle fs-18 me-1"
                                                                />
                                                                Block
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-5">{renderPagination()}</div>
                            </>
                        )}
                    </CardBody>
                </Card>
            </Col>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === "approve" ? "Approve" : "Reject"} Request
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Admin Comments (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter comments here..."
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={actionType === "approve" ? "success" : "danger"}
                        onClick={handleSubmit}
                    >
                        {actionType === "approve" ? "Approve" : "Reject"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default VendorClient;
