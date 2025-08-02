import axios from "axios";
import http from "https";
import { destroyCookie } from "nookies";

const agent = new http.Agent({
  rejectUnauthorized: false,
});

export const axiosGlobal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 100000, // 10 seconds timeout
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
});

axiosGlobal.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosGlobal.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.dir(error);

    if (status === 401 || status === 403) {
      // Remove token cookie or localStorage
      destroyCookie(null, "token");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        // Redirect to login or home
        // window.location.href = "/error/unauthorised";
      }

      // Optional: reject with meaningful message
      return Promise.reject("Unauthorized - Logged out");
    }

    // For other errors, just forward them
    return Promise.reject(error);
  }
);
