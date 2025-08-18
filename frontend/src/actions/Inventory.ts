import { ApiResponse, InventorySummaryDTO, ProductBatchDTO, ProductStockDTO, QueryObject, StockTransferDTO } from "@/types/models";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";

// Product Batch Management
export async function CreateProductBatch(
  companyId: number,
  productId: number,
  warehouseId: number,
  quantity: number,
  expiryDate?: Date
): Promise<ApiResponse<ProductBatchDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.post<ApiResponse<ProductBatchDTO>>(
    "api/inventory/batch",
    {
      companyId,
      productId,
      warehouseId,
      quantity,
      expiryDate,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function UpdateProductBatch(
  uuid: string,
  quantity: number,
  expiryDate?: Date
): Promise<ApiResponse<ProductBatchDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.put<ApiResponse<ProductBatchDTO>>(
    "api/inventory/batch",
    {
      uuid,
      quantity,
      expiryDate,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function DeleteProductBatch(
  uuid: string
): Promise<ApiResponse<boolean>> {
  const token = await GetToken();

  const res = await axiosGlobal.delete<ApiResponse<boolean>>(
    `api/inventory/batch/${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetProductBatchByUuid(
  uuid: string
): Promise<ApiResponse<ProductBatchDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductBatchDTO>>(
    `api/inventory/batch/${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetProductBatchesByProductId(
  productId: number
): Promise<ApiResponse<ProductBatchDTO[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductBatchDTO[]>>(
    `api/inventory/product/${productId}/batches`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetProductBatchesByWarehouseId(
  warehouseId: number
): Promise<ApiResponse<ProductBatchDTO[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductBatchDTO[]>>(
    `api/inventory/warehouse/${warehouseId}/batches`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

// Inventory Reports
export async function GetInventorySummary(
  companyId: number
): Promise<ApiResponse<InventorySummaryDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<InventorySummaryDTO>>(
    `api/inventory/summary/${companyId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetLowStockProducts(
  companyId: number,
  threshold: number = 10
): Promise<ApiResponse<ProductStockDTO[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductStockDTO[]>>(
    `api/inventory/low-stock/${companyId}?threshold=${threshold}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetExpiringProductBatches(
  companyId: number,
  daysThreshold: number = 30
): Promise<ApiResponse<ProductBatchDTO[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductBatchDTO[]>>(
    `api/inventory/expiring/${companyId}?daysThreshold=${daysThreshold}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetProductByBarcode(
  companyId: number,
  barcode: string
): Promise<ApiResponse<ProductStockDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<ProductStockDTO>>(
    `api/inventory/product/barcode/${companyId}/${barcode}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

// Stock Transfers
export async function CreateStockTransfer(
  companyId: number,
  sourceWarehouseId: number,
  destinationWarehouseId: number,
  productId: number,
  quantity: number,
  transferredByUserId: string,
  notes: string = ""
): Promise<ApiResponse<StockTransferDTO>> {
  const token = await GetToken();

  const res = await axiosGlobal.post<ApiResponse<StockTransferDTO>>(
    "api/inventory/transfer",
    {
      companyId,
      sourceWarehouseId,
      destinationWarehouseId,
      productId,
      quantity,
      transferredByUserId,
      notes,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function GetStockTransferHistory(
  companyId: number,
  query?: QueryObject
): Promise<ApiResponse<StockTransferDTO[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<StockTransferDTO[]>>(
    `api/inventory/transfer/${companyId}?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}