'use client';

import { useEffect, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { chartOptions } from '../data';
import { getAdminDashboardStats } from '@/utils/apiCalls/commonApi';
import Link from 'next/link';

const StatCard = ({ amount, change, icon, title, variant, url }) => {
  return (
    <Card>
      <CardBody>
        <Row className="align-items-center justify-content-between">
          <Col xs={12}>
            <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
              <IconifyIcon width={32} height={32} icon={icon} className="text-primary" />
            </div>
            <Link href={url}>
              <p className="text-muted mb-2 mt-3">{title}</p>
            </Link>
            <h3 className="text-dark fw-bold d-flex align-items-center gap-2 mb-0">
              {amount}{' '}

            </h3>
          </Col>
          {/* <Col xs={6}>
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              height={95}
              type="bar"
              className="apex-charts"
            />
          </Col> */}
        </Row>
      </CardBody>
    </Card>
  );
};

const Statistics = () => {
  const [statisticData, setStatisticData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardStats(); // API call
      const data = res.data.result[0];

      const mappedData = [
        {
          icon: 'solar:buildings-2-broken',
          title: 'No. of Vendors',
          amount: data?.totalVendors,
          change: 7.34,
          url: '/vendorLists'
        },
        {
          icon: 'solar:users-group-two-rounded-broken',
          title: 'Regi. Vendors',
          amount: data?.registeredVendors,
          change: 76.89,
          url: '',

        },
        {
          icon: 'solar:shield-user-broken',
          title: 'Customers',
          amount: data?.totalCustomers,
          change: 45.0,
          variant: 'danger',
          url: '/customerLists'
        },
        {
          icon: 'solar:money-bag-broken',
          title: 'Revenue',
          amount: `AED ${data?.totalRevenue}`,
          change: 8.76,
          url: '',
        },
      ];

      setStatisticData(mappedData);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) return <p>Loading statistics...</p>;

  return (
    <Row>
      {statisticData.map((item, idx) => (
        <Col md={6} xl={3} key={idx}>
          <StatCard {...item} />
        </Col>
      ))}
    </Row>
  );
};

export default Statistics;
