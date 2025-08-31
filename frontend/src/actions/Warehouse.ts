import { ApiResponse, QueryObject, Warehouse } from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { NewWarehouseType } from "@/components/company/warehouse/NewWarehouseDialoge";

export async function GetAllWarehouses(
  query?: QueryObject
): Promise<ApiResponse<Warehouse[]>> {
  return RequestWrapper<Warehouse[]>("GET", `warehouse/get-all`, { query });
}

export async function CreateWarehouse(
  data: NewWarehouseType
): Promise<ApiResponse<Warehouse>> {
  return RequestWrapper<Warehouse>("POST", `warehouse/create`, { data });
}
