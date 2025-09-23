'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Modal, Form } from 'react-bootstrap';
import { getLeads } from '@/utils/apiCalls/commonApi'; // replace with your API function

export default function LeadsTable() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentLead, setCurrentLead] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Fetch leads
    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await getLeads(); 
            if (res.data?.result) setLeads(res.data.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Filtered data
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = searchTerm
            ? `${lead.cName} ${lead.cEmail} ${lead.cSubject}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true;

        const leadDate = new Date(lead.addedOn);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchesDate =
            (!from || leadDate >= from) &&
            (!to || leadDate <= new Date(to.setHours(23, 59, 59, 999))); // include full day

        return matchesSearch && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

    const handleView = (lead) => {
        setCurrentLead(lead);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

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
        return <div className="d-flex justify-content-center mt-3">{pages}</div>;
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFromDate('');
        setToDate('');
        setCurrentPage(1);
    };

    return (
        <Row>
            <Col xl={12}>
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <h4>Website Leads</h4>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Search by name, email, subject..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            />
                            <Form.Control
                                type="date"
                                value={fromDate}
                                onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            />
                            <Form.Control
                                type="date"
                                value={toDate}
                                onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
                                size="sm"
                            />
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className=''
                                onClick={handleClearFilters}
                            >
                                Clear Filters
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
                                                <th>Contact</th>
                                                <th>Subject</th>
                                                <th>Added On</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((lead) => (
                                                <tr key={lead.id}>
                                                    <td>{lead.id}</td>
                                                    <td>{lead.cName}</td>
                                                    <td>{lead.cEmail}</td>
                                                    <td>{lead.cContact}</td>
                                                    <td>{lead.cSubject}</td>
                                                    <td>{new Date(lead.addedOn).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button size="sm" variant="info" onClick={() => handleView(lead)}>
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='mb-3'>
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
                    <Modal.Title>Lead Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentLead && (
                        <>
                            <p><strong>Name:</strong> {currentLead.cName}</p>
                            <p><strong>Email:</strong> {currentLead.cEmail}</p>
                            <p><strong>Contact:</strong> {currentLead.cContact}</p>
                            <p><strong>Subject:</strong> {currentLead.cSubject}</p>
                            <p><strong>Message:</strong> {currentLead.cMessage}</p>
                            <p><strong>Added On:</strong> {new Date(currentLead.addedOn).toLocaleString()}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}
