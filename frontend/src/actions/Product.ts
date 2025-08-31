import {
  ApiResponse,
  ApiResponseFail,
  Company,
  Product,
  QueryObject,
} from "@/types/models";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { NewCompanyFormType } from "@/components/superadmin/companies/NewCompanyDialoge";
import { RequestWrapper } from "./RequestWrapper";

export async function GetAllProducts(
  query?: QueryObject
): Promise<ApiResponse<Product[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<Product[]>>(
    `product/get-all?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetCompanyByAdminUserId(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>(
    "GET",
    `company/get-one-by-admin-id?uuid=${uuid}`,
    {}
  );
}

export async function GetFullCompanyByUUID(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>(
    "GET",
    `company/get-full-by-uuid?uuid=${uuid}`,
    {}
  );
}

export async function AddUserToCompany(
  userId: string,
  companyId: string
): Promise<ApiResponse<Company>> {
  try {
    const res = await axiosGlobal.post<ApiResponse<Company>>(
      "company/add-user",
      { userId: userId, companyUUID: companyId }
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<Company>;
    }

    return ApiResponseFail<Company>();
  }
}

export async function CreateProduct(
  data: FormData
): Promise<ApiResponse<Product>> {
  try {
    const res = await axiosGlobal.post<ApiResponse<Product>>(
      "product/create",
      data
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<Product>;
    }

    return ApiResponseFail<Product>();
  }
}
