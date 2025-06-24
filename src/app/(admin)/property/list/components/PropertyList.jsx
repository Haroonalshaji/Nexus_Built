
import CategoryListClient from './CategoryListClient';
import { getAllProperty } from '@/helpers/data';
import PropertyDetailsPage from '../../details/page';
const PropertyList = async () => {
  const propertyListData = await getAllProperty();

  const viewIndVendor = (item) => {
    console.log(item);
    navigate(`/admin/property/detail/${item.id}`);
    PropertyDetailsPage(item);
  }

  return <CategoryListClient propertyListData={propertyListData} />;
};
export default PropertyList;