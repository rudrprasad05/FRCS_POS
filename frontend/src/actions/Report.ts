import { axiosGlobal } from "@/lib/axios";

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  statusCode: number;
  message?: string;
}

// Fetch all sales reports
export async function getSalesReports(): Promise<ApiResponse<any>> {
  try {
    const response = await axiosGlobal.get("/reports/sales");

    // Wrap actual Axios response into ApiResponse format
    return {
      data: response.data,
      success: true,
      statusCode: response.status,
      message: "Reports fetched successfully",
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
    };
  }
}

// Fetch top products
export async function getTopProducts(limit = 5): Promise<ApiResponse<any>> {
  try {
    const response = await axiosGlobal.get(`/reports/top-products?limit=${limit}`);

    return {
      data: response.data,
      success: true,
      statusCode: response.status,
      message: "Top products fetched successfully",
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
    };
  }
}
