import {
  ApiResponse,
  Company,
  Product,
  ProductBatch,
  QueryObject,
  Warehouse,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { NewWarehouseType } from "@/components/company/warehouse/NewWarehouseDialoge";
import { ILoadPreCreationInfo } from "@/types/res";
import { NewBatchFormData } from "@/app/[companyName]/(sidebar)/warehouse/[warehouseId]/batch/new/page";

export async function GetAllBatchesByWarehouse(
  query?: QueryObject
): Promise<ApiResponse<ProductBatch[]>> {
  return RequestWrapper<ProductBatch[]>(
    "GET",
    `product-batch/get-all-by-warehouse`,
    {
      query,
    }
  );
}

export async function LoadPreCreationInfo(
  query?: QueryObject
): Promise<ApiResponse<ILoadPreCreationInfo>> {
  return RequestWrapper<ILoadPreCreationInfo>(
    "GET",
    `product-batch/load-pre-new`,
    {
      query,
    }
  );
}

export async function CreateProductBatch(
  data: NewBatchFormData
): Promise<ApiResponse<ProductBatch>> {
  return RequestWrapper<ProductBatch>("POST", `product-batch/create`, {
    data,
  });
}
