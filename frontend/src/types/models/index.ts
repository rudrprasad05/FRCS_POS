import { CompanyRole, RefundStatus, SaleStatus } from "@/types/enum";

export interface BaseModel {
  id: number;
  uuid: string;
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
  isActive: boolean;
}

export interface Supplier extends BaseModel {
  name: string;
  code: string;

  contactName: string;
  phone: string;
  email: string;
  address: string;

  taxNumber: string;

  products: Product[];
  batches: ProductBatch[];
}

export interface Product extends BaseModel {
  companyId: number;
  company?: Company;
  supplier?: Supplier;

  name: string;
  sku: string;
  barcode?: string | null;
  price: number;
  taxCategoryId: number;
  taxCategory?: TaxCategory;
  isPerishable: boolean;

  media?: Media | null;
  mediaId?: number | null;

  batches?: ProductBatch[];
  variants: ProductVariant[];
  saleItems?: SaleItem[];
  firstWarningInDays?: number | null;
  criticalWarningInHours?: number | null;

  maxStock?: number;
}

export interface ProductVariant extends BaseModel {
  productId: number;
  product: Product;

  name: string;
  sku: string;
  barcode: string;
  price: number;

  batches: ProductBatch[];
  saleItems: SaleItem[];
  isPerishable?: boolean;

  media?: Media | null;
  mediaId?: number | null;

  firstWarningInDays?: number | null;
  criticalWarningInHours?: number | null;

  mediaFile?: File;

  maxStock?: number;
  taxCategory?: TaxCategory;
  supplier?: Supplier;
}

export interface Media extends BaseModel {
  url: string;
  objectKey: string;
  altText: string;
  fileName: string;
  contentType: string;
  sizeInBytes: number;
  showInGallery: boolean;
}

export interface SaleItem extends BaseModel {
  saleId: number;
  sale?: Sale;

  productVariantId: number;
  productVariant: ProductVariant;

  quantity: number;
  unitPrice: number;
  taxRatePercent: number;
  lineTotal: number;
}

export type SaleItemOmitted = Omit<
  SaleItem,
  | "sale"
  | "saleId"
  | "id"
  | "uuid"
  | "createdOn"
  | "updatedOn"
  | "isActive"
  | "isDeleted"
>;

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
  product?: ProductVariant;
  supplier?: Supplier;

  warehouseId: number;
  warehouse?: Warehouse;

  quantity: number;
  expiryDate?: string;
  recievedDate?: string;

  notifications?: Notification[];
}
export enum NotificationTypes {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  EXPIRED = "EXPIRED",
  CRITICAL = "CRITICAL",
}

export interface QueryObject {
  pageNumber?: number;
  pageSize?: number;
  showInGallery?: boolean;
  isDeleted?: boolean;
  sortBy?: ESortBy;
  uuid?: string;
  companyName?: string;
  role?: UserRoles;
  isAvailable?: boolean;
  search?: string;
  userId?: string;
}

export enum ESortBy {
  ASC = "ASC",
  DSC = "DSC",
}
export interface Notification extends BaseModel {
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationTypes;
  userId?: number;
  user?: User;
  actionUrl: string;
}

export interface Warehouse extends BaseModel {
  companyId: number;
  company: Company;
  isActive: boolean;

  name: string;
  location?: string;

  productBatches?: ProductBatch[];
}

export enum UserRoles {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  USER = "USER",
}

export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  role?: UserRoles;
  companies?: CompanyUser[];
  salesAsCashier?: Sale[];
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
  profilePicture?: Media;
  profilePictureLink?: string;
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

  session?: PosSession[];
  sales?: Sale[];
  totalSales?: number;
  lastUsedBy?: User;
}

export interface Sale extends BaseModel {
  companyId: number;
  company?: Company;

  posSessionId: number;
  posSession?: PosSession;

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

export interface PosSession extends BaseModel {
  posUserId: string;
  posUser?: User;

  posTerminalId: number;
  posTerminal?: PosTerminal;

  connectionUUID: string;
  isActive: boolean;
  connectionTimeOut: Date;
  sales: Sale[];
  totalSales?: number;
}

export type PosSessionWithProducts = {
  posSession: PosSession;
  products: Product[];
};

export type NewTaxFormType = {
  name: string;
  percentage: number;
};

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

export interface MetaData {
  pageSize: number;
  totalCount: number;
  pageNumber: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: MetaData;
  errors?: string[];
  timestamp: string;
}

export function ApiResponseFail<T>(): ApiResponse<T> {
  return {
    success: false,
    statusCode: 500,
    data: undefined,
    errors: ["Network error"],
    message: "Unable to reach the server",
    timestamp: Date.now().toString(),
  };
}

export interface QuickConnect extends BaseModel {
  posSessionId: number;
  quickConnectMobileId?: number | null;
  quickConnectMobile?: QuickConnectMobile | null;
}

export interface QuickConnectMobile extends BaseModel {
  model: string;
  location: string;
  connectionTime: string;
  isActive: boolean;
}
