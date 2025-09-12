import { ApiResponse, QueryObject, Warehouse } from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { NewWarehouseType } from "@/components/company/warehouse/NewWarehouseDialoge";
import { WarehouseEditData } from "@/components/company/warehouse/edit/EditTab";

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

export async function GetOneWarehouseWithBatch(
  query?: QueryObject
): Promise<ApiResponse<Warehouse>> {
  return RequestWrapper<Warehouse>("GET", `warehouse/get-full-by-uuid`, {
    query,
  });
}

export async function SoftDeleteWarehouse(
  query?: QueryObject
): Promise<ApiResponse<Warehouse>> {
  return RequestWrapper<Warehouse>("DELETE", `warehouse/soft-delete`, {
    query,
  });
}
export async function ActivateWarehouse(
  query?: QueryObject
): Promise<ApiResponse<Warehouse>> {
  return RequestWrapper<Warehouse>("DELETE", `warehouse/activate`, {
    query,
  });
}

export async function EditWarehouse(
  data: WarehouseEditData,
  uuid: string
): Promise<ApiResponse<Warehouse>> {
  return RequestWrapper<Warehouse>("PATCH", `warehouse/edit`, {
    query: { uuid },
    data: data,
  });
}
