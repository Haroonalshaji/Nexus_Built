import api from "../axios";

export const adminLogin = (credentials) => api.post("/auth/admin-login", credentials);