import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { ApiResponse, QueryObject } from "@/types/models";
import { AxiosRequestConfig, Method } from "axios";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { GetToken } from "./User";

class RedirectError extends Error {
  constructor(public response: NextResponse) {
    super("Redirect triggered");
    this.name = "RedirectError";
  }
}

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

    if (res.status === 401) {
      console.log("401", res);
      redirect("/error/unauthorised");
    }

    return res.data;
  } catch (error: any) {
    if (isRedirectError(error)) {
      console.log("401", error);
      console.dir(error);
      throw error;
    }

    if (error.response?.status === 401) {
      console.log("401", error);

      redirect("/error/unauthorised");
    }
    console.dir(error);
    return {
      data: null,
      success: false,
      statusCode: 400,
    } as ApiResponse<T>;
  }
}
