"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, QueryObject } from "@/types/models";
import { CompanyAdminDashboardDTO, SuperAdminDashboardDTO } from "@/types/res";
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

export async function GetCompanyAdminDashboard(
  query: QueryObject
): Promise<ApiResponse<CompanyAdminDashboardDTO>> {
  return RequestWrapper<CompanyAdminDashboardDTO>(
    "GET",
    `superadmin/company-dashboard`,
    { query }
  );
}
