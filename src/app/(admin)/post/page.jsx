"use client";
import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';
import Articles from './components/Articles';
import FreshArticles from './components/FreshArticles';
import Posts from './components/Posts';
import DashboardReportsTree from './components/DashboardReportsTree';
import VendorDashboardTable from './components/VendorDashboardTable';

const handleGenerateReport = () => {
  alert('Generate Reports clicked! (Implement report generation logic here)');
};

const handleExportData = () => {
  alert('Export Data clicked! (Implement export to Excel/PDF logic here)');
};

const PostPage = () => {
  return <>
      <PageTitle title="Export Data" subName="Export" />
      <VendorDashboardTable />
      <div style={{ marginBottom: 24 }} className='d-none'>
        <DashboardReportsTree
          onGenerateReport={handleGenerateReport}
          onExportData={handleExportData}
        />
      </div>
      <Row className='d-none'>
        <FreshArticles />
        <Articles />
      </Row>
      <Row className='d-none'>
        <Posts />
      </Row>
    </>;
};

export default PostPage;