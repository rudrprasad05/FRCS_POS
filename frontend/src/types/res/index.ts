import { Company, User } from "../models";

export interface SuperAdminDashboardDTO {
  users: User[];
  companies: Company[];
}

export interface ICreateNewPosSession {
  posUserId: string;
  posTerminalId: string;
}
