import { ApiResponse, QueryObject } from "@/types/models";
import axios, { AxiosRequestConfig, Method } from "axios";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";

export async function RequestWrapper<T>(
  method: Method,
  url: string,
  options: {
    data?: any;
    config?: AxiosRequestConfig;
    query?: QueryObject;
  }
): Promise<ApiResponse<T>> {
  const { data, config, query } = options;
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  url = `${url}?${params}`;
  console.log(url);

  try {
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

    console.log("RequestWrapper", res);

    return res.data;
  } catch (error) {
    console.dir(error);
    return {
      data: null,
      success: false,
      statusCode: 400,
    } as ApiResponse<T>;
  }
}
