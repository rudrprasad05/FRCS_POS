"use server";

import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { ApiResponse } from "@/types/models";
import axios from "axios";
import { redirect } from "next/navigation";
import { GetToken } from "./User";
import { SuperAdminDashboardDTO } from "@/types/res";

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
