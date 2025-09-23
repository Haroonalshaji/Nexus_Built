// src/api/axios.ts
import axios from "axios";
import { getCookie } from "./cookies/cookies";

// Create an Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL, // replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor (attach token if exists)
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") { // only runs in browser
        const token = getCookie('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
},
    (error) => Promise.reject(error)
);

// Response interceptor (handle refresh token / errors globally)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle token expiration, refresh, or logout
            console.error("Unauthorized! Redirect to login or refresh token.");
            if (typeof window !== "undefined") {
                window.location.href = "/auth/sign-in"; // safe redirect outside React
            }
        }
        return Promise.reject(error);
    }
);

export default api;