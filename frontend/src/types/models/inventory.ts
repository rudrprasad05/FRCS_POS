import { BaseModel } from ".";

export interface InventorySummaryDTO {
  totalProducts: number;
  totalBatches: number;
  totalWarehouses: number;
  lowStockProductsCount: number;
  expiringProductsCount: number;
  totalInventoryValue: number;
  warehouseSummaries: WarehouseInventorySummaryDTO[];
}

export interface WarehouseInventorySummaryDTO {
  warehouseId: number;
  warehouseName: string;
  location: string;
  productCount: number;
  totalItemsCount: number;
  inventoryValue: number;
}

export interface ProductStockDTO {
  productId: number;
  productName: string;
  sku: string;
  barcode?: string;
  price: number;
  isPerishable: boolean;
  totalStock: number;
  stockByWarehouse: WarehouseStockDTO[];
}

export interface WarehouseStockDTO {
  warehouseId: number;
  warehouseName: string;
  quantity: number;
}

export interface StockTransferDTO extends BaseModel {
  companyId: number;
  companyName: string;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  notes: string;
  transferredByUserId: string;
  transferredByUserName: string;
}