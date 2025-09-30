'use client';

import {
  Card, CardBody, CardFooter, CardHeader, Spinner, Button, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Form
} from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { getAllAdminOrders } from '@/utils/apiCalls/commonApi';

const statusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'primary';
    case 'inactive': return 'secondary';
    case 'cancelled': return 'danger';
    case 'initiated': return 'warning';
    case 'completed': return 'primary';
    case 'success': return 'success';
    case 'failed': return 'danger';
    default: return 'dark';
  }
};


const TransactionData = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // rows per page

  const getAllTransactionDetails = async () => {
    setIsLoading(true);
    try {
      const result = await getAllAdminOrders();
      setOrders(result?.data?.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilter = () => {
    setSearchTerm("");
    setPaymentStatus("");
    setOrderStatus("")
  }

  useEffect(() => {
    getAllTransactionDetails();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderNo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment = paymentStatus === '' || item.paymentStatus?.trim().toLowerCase() === paymentStatus.trim().toLowerCase();
      const matchesOrder = orderStatus === '' || item.orderStatus?.trim().toLowerCase() === orderStatus.trim().toLowerCase();
      return matchesSearch && matchesPayment && matchesOrder;

    });
  }, [orders, searchTerm, paymentStatus, orderStatus]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as={'h4'}>All Orders</CardTitle>
          </CardHeader>

          {/* Filters */}
          <CardBody>
            <Row className="mb-3 gy-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, order no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                  <option value="">All Payment Status</option>
                  <option value="Success">Success</option>
                  <option value="Initiated">Initiated</option>
                  <option value="Failed">Failed</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                  <option value="">All Order Status</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                  <option value="Initiated">Initiated</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="primary" onClick={clearFilter}>Clear</Button>
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
                      <th>Order No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Payment Mode</th>
                      <th>Order Status</th>
                      <th>Transaction Id</th>
                      <th>Payment Status</th>
                      <th>Price</th>
                      <th>Added On</th>
                      <th>Updated On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ?
                      <tr>
                        <td colSpan="10" className="text-center p-5">
                          <h3 className="text-lg font-medium">No Transaction to show</h3>
                        </td>
                      </tr>
                      :
                      paginatedOrders.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            {idx + 1}
                          </td>
                          <td>
                            <Link href="" className="link-primary fw-semibold">
                              {item.orderNo}
                            </Link>
                          </td>
                          <td>{item.name} {item.lastName}</td>
                          <td>{item.email}</td>
                          <td>{item.contact || '-'}</td>
                          <td>{item.paymentMode}</td>
                          <td>
                            <span
                              className={`badge bg-${statusVariant(item.orderStatus)}-subtle text-${statusVariant(item.orderStatus)} py-1 px-2 fs-12`}
                            >
                              {item.orderStatus}
                            </span>
                          </td>
                          <td>{item.paymentId || 'N/A'}</td>
                          <td>
                            <span
                              className={`badge bg-${statusVariant(item.paymentStatus)}-subtle text-${statusVariant(item.paymentStatus)} py-1 px-2 fs-12`}
                            >
                              {item.paymentStatus}
                            </span>
                          </td>
                          <td>AED {item.priceAtPurchase}</td>
                          <td>{new Date(item.addedOn).toLocaleString()}</td>
                          <td>{new Date(item.updatedOn).toLocaleString()}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>

          {!isLoading && (
            <CardFooter>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default TransactionData;
