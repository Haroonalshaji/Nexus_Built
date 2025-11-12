"use client";

import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllReview } from '@/helpers/data'; // replace with your new API call
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Form } from 'react-bootstrap';
import useModal from '@/hooks/useModal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllEnquiries } from '@/utils/apiCalls/commonApi';
import Link from 'next/link';

const ReviewsPage = () => {
  const [reviewData, setReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modal
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, toggleModal } = useModal();

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      const payload = {
        pageSize: itemsPerPage,
        pageNo: currentPage - 1,
        fromDate,
        toDate,
        sParam: searchTerm,
        status: statusFilter,
        priority: priorityFilter
      };
      const response = await getAllEnquiries(payload);
      if (response.data.isSuccess) {
        setReviewData(response.data.result);
        setTotalPages(Math.ceil(response.data.result[0]?.totalCount / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, statusFilter, priorityFilter, fromDate, toDate]);

  // Modal handlers
  const handleOpenModal = (review) => {
    setSelectedReview(review);
    toggleModal();
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    toggleModal();
  };

  // Delete handlers
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setReviewData(prev => prev.filter(i => i !== itemToDelete));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <PageTitle title="Enquiries" subName="Admin Services" />

      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Col>
        <Col md={2}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </Col>
        <Col md={2}>
          <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </Col>
        <Col md={1}>
          <Button onClick={fetchData}>Filter</Button>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader>
              <CardTitle>All Enquiries</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>#</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service Required</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Added On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewData.map((item, idx) => (
                      <tr key={item.enquiryGuid}>
                        <td>{item.rowNumber}</td>
                        <td>{item.customerName}</td>
                        <td>{item.emailAddress}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.serviceRequired}</td>
                        <td>{item.priorityLevel}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.addedOn).toLocaleDateString()}</td>
                        <td>
                          <Link href={`/reviews/individual-enquiry?enquiryGuid=${item.enquiryGuid}`}>
                            <Button size="sm" variant="primary" >View Enquiry</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
            <CardFooter>
              <nav>
                <ul className="pagination justify-content-end mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* View Enquiry Modal */}
      {selectedReview && (
        <Modal show={isOpen} onHide={handleCloseModal}>
          <ModalHeader closeButton>
            <ModalTitle>Enquiry Details</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p><strong>Customer Name:</strong> {selectedReview.customerName}</p>
            <p><strong>Email:</strong> {selectedReview.emailAddress}</p>
            <p><strong>Phone:</strong> {selectedReview.phoneNumber}</p>
            <p><strong>Service Required:</strong> {selectedReview.serviceRequired}</p>
            <p><strong>Priority:</strong> {selectedReview.priorityLevel}</p>
            <p><strong>Description:</strong> {selectedReview.description}</p>
            <p><strong>Status:</strong> {selectedReview.status}</p>
            <p><strong>Added On:</strong> {new Date(selectedReview.addedOn).toLocaleString()}</p>
            <p><strong>Total Quotes:</strong> {selectedReview.totalQuotes}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default ReviewsPage;
