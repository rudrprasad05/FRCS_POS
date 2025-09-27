import { ApiResponse, TaxCategory, QueryObject, NewTaxFormType } from "@/types/models";
import { GetToken } from "./User";
import { buildMediaQueryParams } from "@/lib/params";
import { axiosGlobal } from "@/lib/axios";

export async function GetAllTaxCategories(query?: QueryObject): Promise<ApiResponse<TaxCategory[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);
  const res = await axiosGlobal.get<ApiResponse<TaxCategory[]>>(`tax/get-all?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function CreateTaxCategory(data: NewTaxFormType): Promise<ApiResponse<TaxCategory>> {
  try {
    const token = await GetToken();
    const res = await axiosGlobal.post<ApiResponse<TaxCategory>>("tax/create", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.data) return error.response.data as ApiResponse<TaxCategory>;
    return { success: false, statusCode: 500, message: "Failed", data: undefined, timestamp: new Date().toISOString() };
  }
}

export async function SoftDeleteTax(uuid: string): Promise<ApiResponse<TaxCategory>> {
  try {
    const token = await GetToken();
    const res = await axiosGlobal.delete<ApiResponse<TaxCategory>>(`tax/soft-delete?uuid=${uuid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.data) return error.response.data as ApiResponse<TaxCategory>;
    return { success: false, statusCode: 500, message: "Failed", data: undefined, timestamp: new Date().toISOString() };  }
}
