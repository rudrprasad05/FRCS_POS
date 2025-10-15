import { EditTaxData } from "@/components/superadmin/tax/EditTab";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import {
  ApiResponse,
  NewTaxFormType,
  QueryObject,
  TaxCategory,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { GetToken } from "./User";

export async function GetAllTaxCategories(
  query?: QueryObject
): Promise<ApiResponse<TaxCategory[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);
  const res = await axiosGlobal.get<ApiResponse<TaxCategory[]>>(
    `tax/get-all?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function CreateTaxCategory(
  data: NewTaxFormType
): Promise<ApiResponse<TaxCategory>> {
  return RequestWrapper<TaxCategory>("POST", "tax/create", {
    data,
  });
}

export async function EditTaxCategory(
  data: EditTaxData,
  query: QueryObject
): Promise<ApiResponse<TaxCategory>> {
  return RequestWrapper<TaxCategory>("POST", "tax/edit", {
    data,
    query,
  });
}
export async function GetTaxByUUID(
  query: QueryObject
): Promise<ApiResponse<TaxCategory>> {
  return RequestWrapper<TaxCategory>("GET", "tax/get-by-uuid", {
    query,
  });
}

export async function ActivateTax(
  uuid: string
): Promise<ApiResponse<TaxCategory>> {
  return RequestWrapper<TaxCategory>("PATCH", "tax/activate", {
    query: { uuid },
  });
}

export async function SoftDeleteTax(
  uuid: string
): Promise<ApiResponse<TaxCategory>> {
  try {
    const token = await GetToken();
    const res = await axiosGlobal.delete<ApiResponse<TaxCategory>>(
      `tax/soft-delete?uuid=${uuid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.data)
      return error.response.data as ApiResponse<TaxCategory>;
    return {
      success: false,
      statusCode: 500,
      message: "Failed",
      data: undefined,
      timestamp: new Date().toISOString(),
    };
  }
}
