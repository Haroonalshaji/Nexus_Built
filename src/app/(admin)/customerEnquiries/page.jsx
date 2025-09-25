'use client';

import {
    Card, CardBody, CardFooter, CardHeader, Spinner, CardTitle, Col, Row, Form, Button, Modal
} from 'react-bootstrap';
import { useEffect, useState, useMemo } from 'react';
import { getVendorEnquiries, getEnquiryAttachments, getEnquiryDetails, getAllEnquiriesMadeCustomer, getIndividualEnquiryDet } from '@/utils/apiCalls/commonApi';
import Image from 'next/image';

const priorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'secondary';
        default: return 'dark';
    }
};

const statusVariant = (status) => {
    switch (status?.toLowerCase()) {
        case 'open': return 'primary';
        case 'closed': return 'success';
        case 'pending': return 'warning';
        default: return 'dark';
    }
};

const CustomerEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // filters
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [sParam, setSParam] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Modals
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentAttachments, setCurrentAttachments] = useState([]);
    const [currentDetails, setCurrentDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchEnquiries = async () => {
        setIsLoading(true);
        try {
            const payload = {
                pageSize: 0,
                pageNo: 0,
                fromDate,
                toDate,
                sParam,
                status,
                priority
            };
            const result = await getAllEnquiriesMadeCustomer(payload);
            setEnquiries(result?.data?.result || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleAttachmentClick = async (enquiryGuid) => {
        setModalLoading(true);
        setShowAttachmentModal(true);
        try {
            const result = await getEnquiryAttachments(enquiryGuid);
            setCurrentAttachments(result?.data?.result || []);
        } catch (error) {
            console.error(error);
            setCurrentAttachments([]);
        } finally {
            setModalLoading(false);
        }
    };

    const handleViewDetailsClick = async (enquiryGuid) => {
        setModalLoading(true);
        setShowDetailsModal(true);
        try {
            const result = await getIndividualEnquiryDet(enquiryGuid);
            setCurrentDetails(result?.data?.result || null);
        } catch (error) {
            console.error(error);
            setCurrentDetails(null);
        } finally {
            setModalLoading(false);
        }
    };

    const filteredEnquiries = useMemo(() => {
        return enquiries.filter((item) => {
            const matchesSearch = sParam === '' ||
                item.customerName?.toLowerCase().includes(sParam.toLowerCase()) ||
                item.emailAddress?.toLowerCase().includes(sParam.toLowerCase()) ||
                item.serviceRequired?.toLowerCase().includes(sParam.toLowerCase());

            const matchesStatus = status === '' || item.status?.toLowerCase() === status.toLowerCase();
            const matchesPriority = priority === '' || item.priorityLevel?.toLowerCase() === priority.toLowerCase();

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [enquiries, sParam, status, priority]);

    const totalPages = Math.ceil(filteredEnquiries.length / pageSize);
    const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
                            <CardTitle as={'h4'}>Customer Enquiries</CardTitle>
                        </CardHeader>

                        {/* Filters */}
                        <CardBody>
                            <Row className="mb-3">
                                <Col md={2}>
                                    <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                </Col>
                                <Col md={2}>
                                    <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                </Col>
                                <Col md={3}>
                                    <Form.Control type="text" placeholder="Search by name, email, service..." value={sParam} onChange={(e) => setSParam(e.target.value)} />
                                </Col>
                                <Col md={2}>
                                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">All Status</option>
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Pending">Pending</option>
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="">All Priority</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </Form.Select>
                                </Col>
                                <Col md={1}>
                                    <Button variant="primary" onClick={fetchEnquiries}>Filter</Button>
                                </Col>
                            </Row>
                        </CardBody>

                        <CardBody className="p-0">
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center p-5">
                                    <Spinner animation="border" role="status" variant="primary">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                                        <thead className="bg-light-subtle">
                                            <tr>
                                                <th>#</th>
                                                <th>Customer Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Priority</th>
                                                <th>Service Required</th>
                                                <th>Status</th>
                                                <th>Attachments</th>
                                                <th>Added On</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEnquiries.length === 0 ? (
                                                <tr>
                                                    <td colSpan="10" className="text-center p-5">
                                                        <h5>No Enquiries to show</h5>
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedEnquiries.map((item) => (
                                                    <tr key={item.enquiryGuid}>
                                                        <td>{item.rowNumber}</td>
                                                        <td>{item.customerName}</td>
                                                        <td>{item.emailAddress}</td>
                                                        <td>{item.phoneNumber || '-'}</td>
                                                        <td>
                                                            <span className={`badge bg-${priorityVariant(item.priorityLevel)}-subtle text-${priorityVariant(item.priorityLevel)}`}>
                                                                {item.priorityLevel}
                                                            </span>
                                                        </td>
                                                        <td>{item.serviceRequired}</td>
                                                        <td>
                                                            <span className={`badge bg-${statusVariant(item.status)}-subtle text-${statusVariant(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                disabled={item.attachmentCount === 0}
                                                                onClick={() => handleAttachmentClick(item.enquiryGuid)}
                                                            >
                                                                Attachments ({item.attachmentCount})
                                                            </Button>
                                                        </td>
                                                        <td>{new Date(item.addedOn).toLocaleString()}</td>
                                                        <td>
                                                            <Button variant="primary" size="sm" onClick={() => handleViewDetailsClick(item.enquiryGuid)}>
                                                                View Details
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardBody>

                        {!isLoading && (
                            <CardFooter>
                                <nav>
                                    <ul className="pagination justify-content-end mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </CardFooter>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Attachments Modal */}
            <Modal show={showAttachmentModal} onHide={() => setShowAttachmentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Attachments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalLoading ? (
                        <Spinner animation="border" />
                    ) : currentAttachments.length === 0 ? (
                        <p>No attachments available</p>
                    ) : (
                        <div className="d-flex flex-wrap gap-3">
                            {currentAttachments.map((att, idx) => {
                                const isImage = att?.fileType?.toLowerCase() === "image";
                                return isImage ? (
                                    <a
                                        key={idx}
                                        href={att?.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Image
                                            src={att?.filePath}
                                            alt={att?.name || "attachment"}
                                            width={150}
                                            height={150}
                                            style={{ objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </a>
                                ) : (
                                    <a
                                        key={idx}
                                        href={att?.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="d-block p-2 border rounded"
                                    >
                                        {att?.name || "View File"}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Enquiry Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" />
                        </div>
                    ) : currentDetails ? (
                        <div className="p-3">
                            <div className="mb-3">
                                <h5>{currentDetails.customerName}</h5>
                                <p className="text-muted mb-0">{currentDetails.emailAddress}</p>
                                <p className="text-muted">{currentDetails.phoneNumber || '-'}</p>
                            </div>

                            <div className="d-flex gap-2 flex-wrap mb-3">
                                <span className={`badge bg-${priorityVariant(currentDetails.priorityLevel)}-subtle text-${priorityVariant(currentDetails.priorityLevel)}`}>
                                    Priority: {currentDetails.priorityLevel}
                                </span>
                                <span className={`badge bg-${statusVariant(currentDetails.status)}-subtle text-${statusVariant(currentDetails.status)}`}>
                                    Status: {currentDetails.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <h6 className="mb-1">Service Required:</h6>
                                <p>{currentDetails.serviceRequired}</p>
                            </div>

                            <div className="mb-3">
                                <h6 className="mb-1">Description:</h6>
                                <p>{currentDetails.description}</p>
                            </div>

                            <div className="text-end text-muted">
                                <small>Added On: {new Date(currentDetails.addedOn).toLocaleString()}</small>
                            </div>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CustomerEnquiries;
