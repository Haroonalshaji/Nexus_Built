"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Button, Modal, Form, Card, CardBody, CardHeader,
    CardTitle, Col, Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle, Row
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { transactionData } from '@/assets/data/other';

const VendorClient = ({ transaction }) => {
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [comment, setComment] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalVendorsListed = Math.ceil(transaction.length / itemsPerPage);
    const currentData = transaction.slice(
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
        setComment('');
        setSelectedId(null);
    };

    const handleSubmit = () => {
        console.log(`Action: ${actionType}, ID: ${selectedId}, Comment: ${comment}`);
        handleClose();
    };

    const renderPagination = () => (
        <div className="d-flex justify-content-center px-3 py-2">
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalVendorsListed }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalVendorsListed ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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
                        <CardTitle as={'h4'}>Latest Vendor Applications</CardTitle>
                        <Dropdown>
                            <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light rounded content-none icons-center">
                                This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem>Week</DropdownItem>
                                <DropdownItem>Months</DropdownItem>
                                <DropdownItem>Years</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </CardHeader>

                    <CardBody className="p-0">
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
                                        <th>Invoice</th>
                                        <th>Purchase Date</th>
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
                                                <Link href="#" className="text-dark fw-medium">#{item.id}</Link>
                                            </td>
                                            <td>
                                                {item.user?.avatar && (
                                                    <Image src={item.user.avatar} className="avatar-sm rounded-circle me-2" alt="avatar" width={32} height={32} />
                                                )}
                                                {item.user?.name}
                                            </td>
                                            <td>IN-4563</td>
                                            <td>{new Date(item.purchaseDate).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</td>
                                            <td>
                                                <span className={`badge bg-${item.paymentStatus === 'Cancel' ? 'danger' : item.paymentStatus === 'Pending' ? 'warning' : 'success'}-subtle text-${item.paymentStatus === 'Cancel' ? 'danger' : item.paymentStatus === 'Pending' ? 'warning' : 'success'} py-1 px-2 fs-12`}>
                                                    {item.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button variant="success" size="sm" onClick={() => handleShow('approve', item.id)}>
                                                        <IconifyIcon icon="solar:check-circle-bold" className="align-middle fs-18 me-1" />
                                                        Approve
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleShow('reject', item.id)}>
                                                        <IconifyIcon icon="solar:close-circle-bold" className="align-middle fs-18 me-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-5">
                            {renderPagination()}
                        </div>
                    </CardBody>
                </Card>
            </Col>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{actionType === 'approve' ? 'Approve' : 'Reject'} Request</Modal.Title>
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
                    <Button variant={actionType === 'approve' ? 'success' : 'danger'} onClick={handleSubmit}>
                        {actionType === 'approve' ? 'Approve' : 'Reject'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default VendorClient;
