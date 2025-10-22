import axios from "axios";
import { redirect } from "next/navigation";
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
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const res = error?.response;

    if (status === 401) {
      destroyCookie(null, "token");
      redirect("/error/unauthorised");

      //   if (typeof window !== "undefined") {
      //     localStorage.removeItem("token");

      //     // Redirect to login or home
      //     window.location.href = "/error/unauthorised";
      //   }
    }

    return {
      data: res?.data ?? null,
      success: false,
      status: res?.status ?? 400,
      message: res?.data?.message || error.message || "Unknown error",
    };
  }
);
