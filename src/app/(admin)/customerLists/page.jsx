'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { blockCustomer, getAllCustomer, unBlockCustomer } from '@/utils/apiCalls/commonApi';
import { useNotificationContext } from '@/context/useNotificationContext';

export default function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [currentCustomerGuid, setCurrentCustomerGuid] = useState(null);
    const [comment, setComment] = useState('');
    const { showNotification } = useNotificationContext();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterEmailStatus, setFilterEmailStatus] = useState('');

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await getAllCustomer();
            if (res.data?.result) setCustomers(res.data.result);
        } catch (err) {
            console.error("Error fetching customers:", err);
        } finally {
            setLoading(false);
        }
    };


    // Filtering logic
    const filteredCustomers = customers.filter((c) => {
        const matchesSearch = searchTerm
            ? `${c.firstName} ${c.lastName} ${c.emailAddress}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true;

        const matchesStatus = filterStatus ? c.status === filterStatus : true;
        const matchesEmailStatus = filterEmailStatus ? c.emailStatus === filterEmailStatus : true;

        return matchesSearch && matchesStatus && matchesEmailStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    // Actions
    const handleShow = (type, customerGuid) => {
        setActionType(type);
        setCurrentCustomerGuid(customerGuid);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setComment('');
    };

    const handleSubmit = async () => {
        console.log({ actionType, currentCustomerGuid });
        if (actionType === "block") {
            try {
                const letBlockCustomer = await blockCustomer(currentCustomerGuid);
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
                const letUnBlockCustomer = await unBlockCustomer(currentCustomerGuid);
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
        fetchCustomers();
        handleClose();
    };

    // Pagination renderer
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

    
    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <Row>
            <Col xl={12}>
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <h4>Customer List</h4>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Search customers..."
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
                                <option value="Blocked">Blocked</option>
                            </Form.Select>
                            <Form.Select
                                value={filterEmailStatus}
                                onChange={(e) => { setFilterEmailStatus(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            >
                                <option value="">All Email Status</option>
                                <option value="Verified">Verified</option>
                                <option value="Unverified">Unverified</option>
                            </Form.Select>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('');
                                    setFilterEmailStatus('');
                                    setCurrentPage(1);
                                }}
                            >
                                Clear
                            </Button>
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
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Email Status</th>
                                                <th>Status</th>
                                                <th>Registered On</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{item.firstName} {item.lastName}</td>
                                                    <td>
                                                        <Link href={`mailto:${item.emailAddress}`} className="text-dark fw-medium">
                                                            {item.emailAddress}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${item.emailStatus === "Verified" ? "success" : "warning"}-subtle text-${item.emailStatus === "Verified" ? "success" : "warning"} py-1 px-2 fs-12`}>
                                                            {item.emailStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${item.status === "Active" ? "success" : "secondary"}-subtle text-${item.status === "Active" ? "success" : "secondary"} py-1 px-2 fs-12`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {item.registeredOn
                                                            ? new Date(item.registeredOn).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                                                            : "N/A"}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() => handleShow("unblock", item.customerGuid)}
                                                                disabled={item.status === "Active"}
                                                            >
                                                                <IconifyIcon icon="solar:check-circle-bold" className="align-middle fs-18 me-1" />
                                                                Unblock
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleShow("block", item.customerGuid)}
                                                                disabled={item.status !== "Active"}
                                                            >
                                                                <IconifyIcon icon="solar:close-circle-bold" className="align-middle fs-18 me-1" />
                                                                Block
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {currentData.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-4 text-muted">
                                                        No customers found
                                                    </td>
                                                </tr>
                                            )}
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
                    <Modal.Title>{actionType === "block" ? "Block" : "Unblock"} Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Form.Group>
                        <Form.Label>Admin Comments (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter comments here..."
                            autoFocus
                        />
                    </Form.Group> */}
                    <div>
                        Are you sure need to {actionType === "block" ? "Block" : "Unblock"} this user.
                    </div>
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
}
