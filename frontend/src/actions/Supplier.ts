import { SupplierInput } from "@/components/company/suppliers/new/NewSupplierPage";
import { WarehouseEditData } from "@/components/company/warehouse/edit/EditTab";
import { ApiResponse, QueryObject, Supplier } from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";

export async function GetAllSuppliers(
  query?: QueryObject
): Promise<ApiResponse<Supplier[]>> {
  return RequestWrapper<Supplier[]>("GET", `supplier/get-all`, { query });
}

export async function CreateSupplier(
  data: SupplierInput
): Promise<ApiResponse<Supplier>> {
  return RequestWrapper<Supplier>("POST", `supplier/create`, { data });
}

export async function GetOneSupplierWithBatch(
  query?: QueryObject
): Promise<ApiResponse<Supplier>> {
  return RequestWrapper<Supplier>("GET", `supplier/get-full-by-uuid`, {
    query,
  });
}

export async function SoftDeleteWarehouse(
  query?: QueryObject
): Promise<ApiResponse<Supplier>> {
  return RequestWrapper<Supplier>("DELETE", `supplier/soft-delete`, {
    query,
  });
}
export async function ActivateWarehouse(
  query?: QueryObject
): Promise<ApiResponse<Supplier>> {
  return RequestWrapper<Supplier>("DELETE", `supplier/activate`, {
    query,
  });
}

export async function EditWarehouse(
  data: WarehouseEditData,
  uuid: string
): Promise<ApiResponse<Supplier>> {
  return RequestWrapper<Supplier>("PATCH", `supplier/edit`, {
    query: { uuid },
    data: data,
  });
}
