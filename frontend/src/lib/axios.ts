import axios from "axios";
import { destroyCookie } from "nookies";

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
  (response) => {
    console.log("Response intercepted:", response.status, response.data);
    return response;
  },
  (error) => {
    console.log("Error intercepted:");
    console.dir(error);
    return Promise.reject(error);
  }
);

axiosGlobal.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.log("uhm");
      // Remove token cookie or localStorage
      //   destroyCookie(null, "token");

      if (typeof window !== "undefined") {
        // localStorage.removeItem("token");

        // Redirect to login or home
        window.location.href = "/error/unauthorised";
      }

      // Optional: reject with meaningful message
      return Promise.reject("Unauthorized - Logged out");
    }

    // For other errors, just forward them
    return Promise.reject(error);
  }
);
