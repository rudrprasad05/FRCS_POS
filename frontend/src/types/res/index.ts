import { Company, PosSession, User } from "../models";

export interface SuperAdminDashboardDTO {
  users: User[];
  companies: Company[];
}

export interface ICreateNewPosSession {
  posUserId: string;
  PosTerminalUUID: string;
}

export interface IPosSessionData {
  session: PosSession;
  company: Company;
}
