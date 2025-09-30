import api from "../axios";

export const adminLogin = (credentials) => api.post("/auth/admin-login", credentials);
export const adminRefreshTokern = (credentials) => api.post("/auth/admin-refresh-token", credentials);
export const adminForgotPassword = (email) => api.post("/auth/admin-forgot-password", email);

//admin user management
export const addNewAdminUser = (payload) => api.post("/users", payload);
export const getAllAdminUsers = () => api.get("/users/all");
export const blockAdminUser = (userGuid) => api.put(`/users/block?adminGuid=${userGuid}`);
export const unBlockAdminUser = (userGuid) => api.put(`/users/unblock?adminGuid=${userGuid}`);
export const getAdminUserById = (userGuid) => api.get(`/users?adminGuid=${userGuid}`);
export const updateAdminUser = (payload) => api.put(`/users?`,payload);
export const deleteAdminUser = (userGuid) => api.delete(`/users?adminGuid=${userGuid}`);