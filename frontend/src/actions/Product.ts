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
import { EditProductData } from "@/types/res";

export async function GetAllProducts(
  query?: QueryObject
): Promise<ApiResponse<Product[]>> {
  return RequestWrapper<Product[]>("GET", `product/get-all`, {
    query,
  });
}

export async function GetCompanyByAdminUserId(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>("GET", `company/get-one-by-admin-id`, {
    query: { uuid },
  });
}

export async function GetFullCompanyByUUID(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>("GET", `company/get-full-by-uuid`, {
    query: { uuid },
  });
}
export async function GetEditProductData(
  uuid: string
): Promise<ApiResponse<EditProductData>> {
  return RequestWrapper<EditProductData>("GET", `product/get-edit-page-info`, {
    query: { uuid },
  });
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

export async function EditProduct(
  data: FormData,
  uuid: string
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("PATCH", `product/edit`, {
    query: { uuid },
    data: data,
  });
}

export async function SoftDeleteProduct(
  uuid: string
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("DELETE", `product/soft-delete`, {
    query: { uuid },
  });
}
