import api from "../axios";

export const adminLogin = (credentials) => api.post("/auth/admin-login", credentials);
export const adminRefreshTokern = (credentials) => api.post("/auth/admin-refresh-token", credentials);
export const adminForgotPassword = (email) => api.post("/auth/admin-forgot-password", email);