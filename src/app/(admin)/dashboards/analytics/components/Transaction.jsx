import { getAllTransaction } from '@/helpers/data';
import VendorClient from './VendorClient'; // you'll create this next

const Transaction = async () => {
  const transaction = await getAllTransaction();
  return <VendorClient transaction={transaction} />;
};

export default Transaction;
