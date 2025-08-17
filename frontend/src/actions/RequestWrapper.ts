import { ApiResponse } from "@/types/models";
import axios, { AxiosRequestConfig, Method } from "axios";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";

export async function RequestWrapper<T>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const token = await GetToken();

  const res = await axiosGlobal({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(config?.headers || {}),
    },
    ...config,
  });

  return res.data;
}
