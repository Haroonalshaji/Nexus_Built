import api from '../axios';

export const getPendingVendorApplications = () => api.get("/vendorapplications/pending");
export const approveVendorApplication = (businessGuid) => api.put(`/vendorapplications/approve?businessGuid=${businessGuid}`);
export const rejectVendorApplication = (businessGuid) => api.put(`/vendorapplications/reject?businessGuid=${businessGuid}`);

//get dashboard insights
export const getAdminDashboardStats = () => api.get("/admin/dashboard/stats");

//AdminVendors
export const getVendors = () => api.get("/vendors/all");
export const blockVendor = (vendorGuid) => api.put(`/vendors/block?vendorGuid=${vendorGuid}`)
export const unBlockVendor = (vendorGuid) => api.put(`/vendors/unblock?vendorGuid=${vendorGuid}`)

//contact-us
export const getLeads = () => api.get("/contactus/all");

// AdminCustomers
export const getAllCustomer = () => api.get("/customers/all");
export const blockCustomer = (customerGuid) => api.put(`/customers/block?customerGuid=${customerGuid}`)
export const unBlockCustomer = (customerGuid) => api.put(`/customers/unblock?customerGuid=${customerGuid}`)

// subscription get_n_put
export const getVendorSubscriptionDetails = () => api.get("/subscriptions/subscription");
export const updateVendorSubscriptionDetails = (payload) => api.put("/subscriptions/subscription", payload);

// categoryMaster
export const getListCategories = () => api.get("/masters/category");
export const updateCategoryName = (payload) => api.put("/masters/category", payload);
export const addNewCategory = (payload) => api.post("/masters/category", payload);
export const deleteCategory = (categoryId) => api.delete(`/masters/category/${categoryId}`);
export const specificCategoryDetail = (categoryId) => api.get(`/masters/category/${categoryId}`);

// AdminOrders
export const getAllAdminOrders = () => api.get("/orders/all");

//AdminEnquiries_made_by_the_customer
export const getAllEnquiriesMadeCustomer = (payload) => api.post("/admin/enquiry/filters", payload);
export const getEnquiryAttachments = (enquiryGuid) => api.get(`/admin/enquiry/attachments?enquiryGuid=${enquiryGuid}`);
export const getIndividualEnquiryDet = (enquiryGuid) => api.get(`/admin/enquiry?enquiryGuid=${enquiryGuid}`);

//AdminEnquiries
export const getAllEnquiries = (payload) => api.post("/admin/enquiry/filters", payload);
export const getEachEnquiries = (payload) => api.get(`/admin/enquiry?enquiryGuid=${payload}`);
export const getVendorEnqAttachments = (enquiryGuid) => api.get(`/admin/enquiry/attachments?enquiryGuid=${enquiryGuid}`);

//adminquote
export const getVendorQuoteAdmin = (enquiryGuid) => api.get(`/admin/quote?enquiryGuid=${enquiryGuid}`);