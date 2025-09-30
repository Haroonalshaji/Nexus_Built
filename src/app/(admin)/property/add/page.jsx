import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import PropertyAdd from './components/PropertyAdd';
import PropertyAddCard from './components/PropertyAddCard';
import CategoryList from './components/CategoryList';
import ConstructionCategoriesAdmin from './components/CategoryList';
export const metadata = {
  title: 'Add Property'
};
const PropertyAddPage = () => {
  return <>
    <PageTitle title="Add Category" subName="Real Estate" />
    <Row>
      {/* <PropertyAddCard className="d-none"/> */}
      <Col >
        {/* <FileUpload className="d-none" title="Add Property Photo" /> */}
        {/* <PropertyAdd /> */}
        {/* <CategoryList className="w-full" /> */}
        <ConstructionCategoriesAdmin/>
      </Col>
    </Row>
  </>;
};
export default PropertyAddPage;