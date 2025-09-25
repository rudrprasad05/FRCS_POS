import { SaleStatus } from "../enum";
import {
  Company,
  Notification,
  PosSession,
  Product,
  SaleItem,
  TaxCategory,
  UserRoles,
  Warehouse,
} from "../models";

export interface SuperAdminDashboardDTO {
  totalCompanies: number;
  totalMedia: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalVat: number;
  notifications: Notification[];
}
export interface CompanyAdminDashboardDTO {
  totalCompanies: number;
  totalMedia: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalVat: number;
  notifications: Notification[];
}

export interface ILoadPreCreationInfo {
  company: Company;
  products: Product[];
  warehouses: Warehouse[];
}

export interface AdminDashboardDTO {
  totalMedia: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  notifications: Notification[];
}

export interface ICreateNewPosSession {
  email: string;
  password: string;
  PosTerminalUUID: string;
}

export interface IPosSessionData {
  session: PosSession;
  company: Company;
}

export type LoginResponse = {
  username: string;
  id: string;
  email: string;
  token: string;
  role: UserRoles;
};

export type LoginDTO = {
  username: string;
  id: string;
  email: string;
  token: string;
  role: string;
};

export interface NewCheckoutRequest {
  companyName: string;
  posSessionId: number;
  cashierId: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  status: SaleStatus; // defaults to PENDING in C#
  items: SaleItem[];
}

export interface EditProductData {
  product: Product;
  taxCategories: TaxCategory[];
}
