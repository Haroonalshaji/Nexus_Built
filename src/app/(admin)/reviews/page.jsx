"use client"
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllReview } from '@/helpers/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import useModal from '@/hooks/useModal';
import { useState, useEffect } from 'react';

const ReviewsPage = () => {
  const [reviewData, setReviewData] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(reviewData.length / itemsPerPage);
  // Modal state
  const [selectedReview, setSelectedReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState(null);
  const {
    isOpen,
    toggleModal
  } = useModal();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    getAllReview().then(setReviewData);
  }, []);

  // Handler for opening modal
  const handleOpenModal = (review, editable = false) => {
    setSelectedReview(review);
    setEditMode(editable);
    setEditFields(editable ? {
      propertyName: review.property?.name || '',
      date: review.date,
      customerName: review.user?.name || '',
      vendorName: review.property?.location || '',
      rating: review.rating,
      status: review.reviewStatus,
      title: review.review.title,
      description: review.review.description
    } : null);
    toggleModal();
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setSelectedReview(null);
    setEditMode(false);
    setEditFields(null);
    toggleModal();
  };

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

  // Handle input changes in edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prev => ({ ...prev, [name]: value }));
  };

  // Save changes to reviewData
  const handleSaveChanges = () => {
    if (!selectedReview || !editFields) return;
    setReviewData(prevData => prevData.map(item => {
      if (item === selectedReview) {
        return {
          ...item,
          property: {
            ...item.property,
            name: editFields.propertyName,
            location: editFields.vendorName
          },
          date: editFields.date,
          user: {
            ...item.user,
            name: editFields.customerName
          },
          rating: editFields.rating,
          reviewStatus: editFields.status,
          review: {
            ...item.review,
            title: editFields.title,
            description: editFields.description
          }
        };
      }
      return item;
    }));
    handleCloseModal();
  };

  // Pagination logic
  const paginatedData = reviewData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return <>
    <PageTitle title="Enquiries" subName="Real Estate" />
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as={'h4'}>All Enquiries</CardTitle>
            </div>
            <Dropdown>
              <DropdownToggle as={'a'} className=" btn btn-sm btn-outline-light rounded content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-responsive">
              <table className="table align-middle text-nowrap table-hover table-centered border-bottom mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th style={{
                      width: 20
                    }}>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="customCheck1" />
                        <label className="form-check-label" htmlFor="customCheck1" />
                      </div>
                    </th>
                    <th>Enquiry Name</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Vendor Name</th>
                    <th>Rating</th>
                    <th className="w-25">Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => <tr key={idx}>
                    <td>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="customCheck2" />
                        <label className="form-check-label" htmlFor="customCheck2">
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          {/* {item.property?.image && <Image src={item.property.image} alt="Property" className="avatar-md rounded border border-light border-3" />} */}
                        </div>
                        <div>
                          <Link href="" className="text-dark fw-medium fs-15">
                            {item.property?.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>{item.date?.toLocaleString ? item.date.toLocaleString('en-us', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : item.date}</td>
                    <td>{item.user?.name}</td>
                    <td>{item.property?.location}</td>
                    <td>{item.rating}/5</td>
                    <td>
                      <ul className="d-flex text-warning m-0 fs-5 list-unstyled">
                        {Array(Math.floor(item.rating)).fill(0).map((_star, idx) => <li className="icons-center" key={idx}>
                          <IconifyIcon icon="ri:star-fill" />
                        </li>)}
                        {!Number.isInteger(item.rating) && <li className="icons-center">
                          <IconifyIcon icon="ri:star-half-fill" />{' '}
                        </li>}
                        {item.rating < 5 && Array(5 - Math.ceil(item.rating)).fill(0).map((_star, idx) => <li className="icons-center" key={idx}>
                          <IconifyIcon icon="ri:star-s-line" />
                        </li>)}
                      </ul>
                      <p className="my-1 text-dark fw-semibold">{item.review.title}</p>
                      <p className="text-wrap mb-0">&quot;{item.review.description}&quot;</p>
                    </td>
                    <td>
                      <span className={`badge bg-${item.reviewStatus == 'Pending' ? 'warning' : 'success'}-subtle text-${item.reviewStatus == 'Pending' ? 'warning' : 'success'} py-1 px-2 fs-12`}>
                        {item.reviewStatus}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" onClick={() => handleOpenModal(item, false)}>
                          <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                        </Button>
                        <Button variant="soft-primary" size="sm" onClick={() => handleOpenModal(item, true)}>
                          <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                        </Button>
                        <Button variant="soft-danger" size="sm">
                          <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" onClick={() => handleDelete(item)} className="align-middle fs-18" />
                        </Button>
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter>
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end mb-0">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                  </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
    {/* Modal for view/edit review */}
    {selectedReview && (
      <Modal show={isOpen} onHide={handleCloseModal}>
        <ModalHeader closeButton>
          <ModalTitle>{editMode ? 'Edit Enquiry' : 'Enquiry Details'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="mb-3">
              <strong>Enquiry Name:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="text" name="propertyName" value={editFields.propertyName} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.property?.name}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Date:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="date" name="date" value={editFields.date?.slice ? editFields.date.slice(0, 10) : editFields.date} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.date?.toLocaleString ? selectedReview.date.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' }) : selectedReview.date}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Customer Name:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="text" name="customerName" value={editFields.customerName} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.user?.name}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Vendor Name:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="text" name="vendorName" value={editFields.vendorName} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.property?.location}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Rating:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="number" name="rating" min="0" max="5" step="0.1" value={editFields.rating} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.rating}/5</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Status:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <select name="status" value={editFields.status} onChange={handleEditChange} className="form-control">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                  </select>
                ) : (
                  <span className={`badge bg-${selectedReview.reviewStatus === 'Pending' ? 'warning' : 'success'}-subtle text-${selectedReview.reviewStatus === 'Pending' ? 'warning' : 'success'} py-1 px-2 fs-13`}>
                    {selectedReview.reviewStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Title:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <input type="text" name="title" value={editFields.title} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>{selectedReview.review.title}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <strong>Description:</strong>
              <div className="mt-1 mb-2">
                {editMode ? (
                  <textarea name="description" value={editFields.description} onChange={handleEditChange} className="form-control" />
                ) : (
                  <span>"{selectedReview.review.description}"</span>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          {editMode && <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>}
        </ModalFooter>
      </Modal>
    )}
    {/* Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onHide={cancelDelete} centered>
      <ModalHeader closeButton>
        <ModalTitle>Confirm Delete</ModalTitle>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this enquiry?
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
      </ModalFooter>
    </Modal>
  </>;
};
export default ReviewsPage;