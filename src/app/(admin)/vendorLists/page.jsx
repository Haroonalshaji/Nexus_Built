'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { blockVendor, getVendors, unBlockVendor } from '@/utils/apiCalls/commonApi';
import { useNotificationContext } from '@/context/useNotificationContext';

export default function VendorTable() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [currentVendorGuid, setCurrentVendorGuid] = useState(null);
    const { showNotification } = useNotificationContext();

    const [comment, setComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // Active, Inactive, Pending, etc.
    const [filterPriority, setFilterPriority] = useState(''); // High, Medium, Low etc.

    // Fetch vendors
    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await getVendors();
            if (res.data?.result) setVendors(res.data.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // Filtered data
    const filteredVendors = vendors.filter((v) => {
        const matchesSearch = searchTerm
            ? `${v.firstName} ${v.lastName} ${v.emailAddress} ${v.businessName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true;

        const matchesStatus = filterStatus ? v.vendorStatus === filterStatus : true;
        const matchesPriority = filterPriority ? v.businessStatus === filterPriority : true;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Pagination
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

    const handleShow = (type, vendorGuid) => {
        setActionType(type);
        setCurrentVendorGuid(vendorGuid);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setComment('');
    };

    const handleSubmit = async () => {
        console.log({ actionType, currentVendorGuid, comment });
        if (actionType === "block") {
            try {
                const letBlockCustomer = await blockVendor(currentVendorGuid);
                let message = letBlockCustomer.data.message;
                showNotification({
                    message: `${message}`,
                    variant: "success",
                })
            } catch (error) {
                console.error(error);
                showNotification({
                    message: `Error while blocking the Customer`,
                    variant: "success",
                })
            }
        }
        if (actionType === "unblock") {
            try {
                const letUnBlockCustomer = await unBlockVendor(currentVendorGuid);
                let message = letUnBlockCustomer.data.message;
                showNotification({
                    message: `${message}`,
                    variant: "success",
                })
            } catch (error) {
                console.error(error);
                showNotification({
                    message: `Error while Unblocking the Customer`,
                    variant: "success",
                })
            }
        }
        fetchVendors();
        handleClose();
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-1"
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <Row>
            <Col xl={12}>
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <h4>Latest Vendor Applications</h4>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            />
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="PendingVerification">Pending</option>
                            </Form.Select>
                            <Form.Select
                                value={filterPriority}
                                onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            >
                                <option value="">All Priority</option>
                                <option value="PendingVerification">Pending Verification</option>
                                <option value="Active">Active</option>
                            </Form.Select>
                        </div>
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
                                                        <input type="checkbox" className="form-check-input" id="customCheck1" />
                                                        <label className="form-check-label" htmlFor="customCheck1" />
                                                    </div>
                                                </th>
                                                <th>Vendor ID</th>
                                                <th>Vendor Name</th>
                                                <th>Vendor Email</th>
                                                <th>Business Name</th>
                                                <th>Registered On</th>
                                                <th>Experience</th>
                                                <th>Vendor Status</th>
                                                <th>Application Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input" id={`customCheck${idx}`} />
                                                            <label className="form-check-label" htmlFor={`customCheck${idx}`}>&nbsp;</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link href="#" className="text-dark fw-medium">
                                                            #{item.vendorGuid ? `${item.vendorGuid.substring(0, 6)}...${item.vendorGuid.slice(-4)}` : ""}
                                                        </Link>
                                                    </td>
                                                    <td>{item.firstName} {item.lastName}</td>
                                                    <td>{item.emailAddress}</td>
                                                    <td>{item.businessName}</td>
                                                    <td>
                                                        {item.registeredOn && item.registeredOn !== "0001-01-01T00:00:00"
                                                            ? new Date(item.registeredOn).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                                                            : "N/A"}
                                                    </td>
                                                    <td>{item.yearsOfExperience}</td>
                                                    <td className={item.vendorStatus === "Blocked" ? "text-danger" : "text-success"}>
                                                        {item.vendorStatus}
                                                    </td>

                                                    <td>
                                                        <span className={`badge bg-${item.businessStatus === "PendingVerification" ? "warning" : "success"}-subtle text-${item.businessStatus === "PendingVerification" ? "warning" : "success"} py-1 px-2 fs-12`}>
                                                            {item.businessStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() => handleShow("unblock", item.vendorGuid)}
                                                                disabled={item.vendorStatus === "Active"}
                                                            >
                                                                <IconifyIcon icon="solar:check-circle-bold" className="align-middle fs-18 me-1" />
                                                                Unblock
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleShow("block", item.vendorGuid)}
                                                                disabled={item.vendorStatus !== "Active"}

                                                            >
                                                                <IconifyIcon icon="solar:close-circle-bold" className="align-middle fs-18 me-1" />
                                                                Block
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                                        {renderPagination()}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            </Col>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{actionType === "block" ? "Block" : "Unblock"} Vendor</Modal.Title>
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
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button
                        variant={actionType === "block" ? "danger" : "success"}
                        onClick={handleSubmit}
                    >
                        {actionType === "block" ? "Block" : "Unblock"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};
