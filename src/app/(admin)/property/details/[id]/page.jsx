"use client"
import PageTitle from '@/components/PageTitle';
import OwnerDetails from '../components/OwnerDetails'
import PropertyDetails from '../components/PropertyDetails';
import { Col, Row } from 'react-bootstrap';
import { getAllProperty } from '../../../../../helpers/data';
import { useParams } from 'next/navigation';

const PropertyDetailsPage = async () => {
  const paramsId = useParams();
  console.log(paramsId);
  
  const propertyList = await getAllProperty();
  const property = propertyList.find((p) => p.id.toString() === paramsId?.id.toString());

  if (!property) {
    return <div>Property not found</div>;
  }
  
  console.log(property);
  return <>
    <PageTitle title="Property Overview" subName="Real Estate" />
    <Row>
      <OwnerDetails owner={property} />
      <PropertyDetails property={property} />
    </Row>
    <Row>
      <Col lg={12}>
        <div className="mapouter">
          <div className="gmap_canvas mb-2">
            <iframe className="gmap_iframe rounded" width="100%" style={{
              height: 400
            }} frameBorder={0} scrolling="no" marginHeight={0} marginWidth={0} src="https://maps.google.com/maps?width=1980&height=400&hl=en&q=University of Oxford&t=&z=14&ie=UTF8&iwloc=B&output=embed" />
          </div>
        </div>
      </Col>
    </Row>
  </>;
};
export default PropertyDetailsPage;