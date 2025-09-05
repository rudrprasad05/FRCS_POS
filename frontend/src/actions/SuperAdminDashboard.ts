"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse } from "@/types/models";
import { SuperAdminDashboardDTO } from "@/types/res";
import { GetToken } from "./User";
import { RequestWrapper } from "./RequestWrapper";

export async function GetSuperAdminDashboard(): Promise<
  ApiResponse<SuperAdminDashboardDTO>
> {
  return RequestWrapper<SuperAdminDashboardDTO>(
    "GET",
    `superadmin/get-dashboard`,
    {}
  );
}
