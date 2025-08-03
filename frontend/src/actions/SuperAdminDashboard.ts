"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse } from "@/types/models";
import { SuperAdminDashboardDTO } from "@/types/res";
import { GetToken } from "./User";

export async function GetSuperAdminDashboard(): Promise<
  ApiResponse<SuperAdminDashboardDTO>
> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<SuperAdminDashboardDTO>>(
    `superadmin/get-dashboard`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
