import api from '../axios';

export const getPendingVendorApplications = () => api.get("/vendorapplications/pending");
export const approveVendorApplication = (businessGuid) => api.put(`/vendorapplications/approve?businessGuid=${businessGuid}`);
export const rejectVendorApplication = (businessGuid) => api.put(`/vendorapplications/reject?businessGuid=${businessGuid}`);