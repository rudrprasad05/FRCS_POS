import { NewBatchFormData } from "@/components/company/warehouse/batch/new/NewBatchContainer";
import { ApiResponse, ProductBatch, QueryObject } from "@/types/models";
import { ILoadPreCreationInfo } from "@/types/res";
import { RequestWrapper } from "./RequestWrapper";

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
