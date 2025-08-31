import {
  ApiResponse,
  ProductBatch,
  QueryObject,
  Warehouse,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { NewWarehouseType } from "@/components/company/warehouse/NewWarehouseDialoge";

export async function GetAllBatchesByWarehouse(
  query?: QueryObject
): Promise<ApiResponse<ProductBatch[]>> {
  return RequestWrapper<ProductBatch[]>("GET", `product-batch/get-all`, {
    query,
  });
}
