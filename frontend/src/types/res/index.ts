import { Company, PosSession, Notification } from "../models";

// export interface SuperAdminDashboardDTO {
//   users: User[];
//   companies: Company[];
// }

export interface SuperAdminDashboardDTO {
  totalCompanies: number;
  totalMedia: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  notifications: Notification[];
}

export interface ICreateNewPosSession {
  posUserId: string;
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
  role: "Admin" | "User";
};
