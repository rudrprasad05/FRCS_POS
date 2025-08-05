import { Company, PosSession, User } from "../models";

export interface SuperAdminDashboardDTO {
  users: User[];
  companies: Company[];
}

export interface ICreateNewPosSession {
  posUserId: string;
  posTerminalId: string;
}

export interface IPosSessionData {
  session: PosSession;
  company: Company;
}
