import {
  ApiResponse,
  ApiResponseFail,
  Company,
  QueryObject,
} from "@/types/models";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { NewCompanyFormType } from "@/components/superadmin/companies/NewCompanyDialoge";

export async function GetAllCompanies(
  query?: QueryObject
): Promise<ApiResponse<Company[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<Company[]>>(
    `company/get-all?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function CreateCompany(
  data: NewCompanyFormType
): Promise<ApiResponse<Company>> {
  try {
    const res = await axiosGlobal.post<ApiResponse<Company>>(
      "company/create",
      data
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<Company>;
    }

    return ApiResponseFail<Company>();
  }
}

export async function SoftDeleteCompany(
  uuid: string
): Promise<ApiResponse<Company>> {
  try {
    const res = await axiosGlobal.delete<ApiResponse<Company>>(
      `company/soft-delete?uuid=${uuid}`
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<Company>;
    }

    return ApiResponseFail<Company>();
  }
}
