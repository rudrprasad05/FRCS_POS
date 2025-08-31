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

export async function GetAllBatchesByWarehouse(
  query?: QueryObject
): Promise<ApiResponse<ProductBatch[]>> {
  return RequestWrapper<ProductBatch[]>("GET", `product-batch/get-all`, {
    query,
  });
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
