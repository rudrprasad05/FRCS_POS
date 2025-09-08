import { NewCompanyFormType } from "@/components/superadmin/companies/NewCompanyDialoge";
import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  ApiResponseFail,
  Company,
  QueryObject,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";

export async function GetAllCompanies(
  query?: QueryObject
): Promise<ApiResponse<Company[]>> {
  console.log("GetAllCompanies", query);
  return RequestWrapper<Company[]>("GET", `company/get-all`, {
    query,
  });
}

export async function GetCompanyByAdminUserId(
  uuid: string
): Promise<ApiResponse<Company>> {
  let query: QueryObject = {
    uuid: uuid,
  };
  return RequestWrapper<Company>("GET", `company/get-one-by-admin-id`, {
    query,
  });
}

export async function GetCompanyForAssociatedUsers(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>(
    "GET",
    `company/get-one-by-associated-admin-id`,
    { query: { uuid } }
  );
}

export async function GetFullCompanyByUUID(
  uuid: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>("GET", `company/get-full-by-uuid`, {
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

export async function RemoveUserFromCompany(
  userId: string,
  companyId: string
): Promise<ApiResponse<Company>> {
  return RequestWrapper<Company>("DELETE", `company/remove-user`, {
    data: { userId, companyId },
  });
}
