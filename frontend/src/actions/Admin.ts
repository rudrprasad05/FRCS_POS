"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse } from "@/types/models";
import { AdminDashboardDTO } from "@/types/res";
import { GetToken } from "./User";

export async function GetAdminDashboardByCompany(): Promise<
  ApiResponse<AdminDashboardDTO>
> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<AdminDashboardDTO>>(
    `superadmin/get-dashboard`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
