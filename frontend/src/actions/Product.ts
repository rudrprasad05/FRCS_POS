import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  ApiResponseFail,
  Company,
  Product,
  ProductVariant,
  QueryObject,
} from "@/types/models";
import { EditProductData, NewProductData } from "@/types/res";
import { RequestWrapper } from "./RequestWrapper";

export async function GetAllProducts(
  query?: QueryObject,
  forPos?: boolean
): Promise<ApiResponse<ProductVariant[]>> {
  const a = RequestWrapper<ProductVariant[]>("POST", `product/get-all-var`, {
    query,
    data: {
      ForPos: forPos || false,
    },
  });
  console.dir(a);
  return a;
}

export async function CreateProductAsync(
  data: FormData,
  query: QueryObject
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("POST", `product/create`, {
    query,
    data: data,
  });
}
export async function GetAllProductVar(
  query?: QueryObject,
  forPos?: boolean
): Promise<ApiResponse<ProductVariant[]>> {
  return RequestWrapper<ProductVariant[]>("POST", `product/get-all-var`, {
    query,
    data: {
      ForPos: forPos || false,
    },
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
export async function GetNewPageInfo(
  cName?: string
): Promise<ApiResponse<NewProductData>> {
  return RequestWrapper<NewProductData>("GET", `product/get-new-page-info`, {
    query: { companyName: cName },
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
  data: FormData,
  query: QueryObject
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("POST", `product/create`, {
    query,
    data: data,
  });
}

export async function EditProduct(
  data: FormData,
  query: QueryObject
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("POST", `product/update`, {
    query,
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

export async function ActivateProduct(
  uuid: string
): Promise<ApiResponse<Product>> {
  return RequestWrapper<Product>("DELETE", `product/activate`, {
    query: { uuid },
  });
}
