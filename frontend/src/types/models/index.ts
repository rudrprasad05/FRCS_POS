import { CompanyRole, RefundStatus, SaleStatus } from "@/types/enum";

export interface BaseModel {
  id: number;
  uuid: string;
  createdOn: string;
  updatedOn: string;
}

export interface Product extends BaseModel {
  companyId: number;
  company?: Company;

  name: string;
  sku: string;
  barcode?: string | null;
  price: number;
  taxCategoryId: number;
  taxCategory?: TaxCategory;
  isPerishable: boolean;

  batches?: ProductBatch[];
  saleItems?: SaleItem[];
}

export interface SaleItem extends BaseModel {
  saleId: number;
  sale?: Sale;

  productId: number;
  product?: Product;

  quantity: number;
  unitPrice: number;
  taxRatePercent: number;
  lineTotal: number;
}

export interface Company extends BaseModel {
  name: string;
  adminUserId: string;
  adminUser?: User;

  users?: CompanyUser[];
  warehouses?: Warehouse[];
  posTerminals?: PosTerminal[];
  products?: Product[];
  taxCategories?: TaxCategory[];
}

export interface TaxCategory extends BaseModel {
  companyId: number;
  company?: Company;

  name: string; // e.g., "VAT 15%", "Exempt"
  ratePercent: number; // e.g., 0, 15, etc.

  products?: Product[];
}

export interface ProductBatch extends BaseModel {
  companyId: number;
  company?: Company;

  productId: number;
  product?: Product;

  warehouseId: number;
  warehouse?: Warehouse;

  quantity: number;
  expiryDate?: string; // or Date, depending on your serialization

  notifications?: Notification[];
}

export interface Warehouse extends BaseModel {
  companyId: number;

  name: string;
  location?: string;

  batches?: ProductBatch[];
}

export interface User {
  id: string; // corresponds to IdentityUser's string ID (usually a GUID)
  userName: string;
  email: string;
  token?: string; // custom field for auth tokens, etc.

  companies?: CompanyUser[];
  salesAsCashier?: Sale[];
}

export interface CompanyUser extends BaseModel {
  companyId: number;
  company?: Company;

  userId: string;
  user?: User;

  role: CompanyRole;
}

export interface PosTerminal extends BaseModel {
  companyId: number;
  company?: Company;

  name: string;
  locationDescription?: string;
  serialNumber?: string;
  isActive: boolean;

  cashiers?: CashierTerminal[];
  sales?: Sale[];
}

export interface Sale extends BaseModel {
  companyId: number;
  company?: Company;

  posTerminalId: number;
  posTerminal?: PosTerminal;

  cashierId: string;
  cashier?: User;

  invoiceNumber: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  status: SaleStatus;

  items?: SaleItem[];
  refunds?: RefundRequest[];
}

export interface CashierTerminal extends BaseModel {
  userId: string;
  user?: User;

  posTerminalId: number;
  posTerminal?: PosTerminal;
}

export interface RefundRequest extends BaseModel {
  companyId: number;
  company?: Company;

  saleId: number;
  sale?: Sale;

  requestedByUserId: string;
  requestedBy?: User;

  status: RefundStatus;
  reason?: string;

  approvedByUserId?: string;
  approvedBy?: User;

  items?: RefundItem[];
}

export interface RefundItem extends BaseModel {
  refundRequestId: number;
  refundRequest?: RefundRequest;

  saleItemId: number;
  saleItem?: SaleItem;

  quantity: number;
  approvedQuantity?: number;
  note?: string;
}
