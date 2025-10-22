"use server";

import { ApiResponse, QueryObject } from "@/types/models";
import { CompanyAdminDashboardDTO, SuperAdminDashboardDTO } from "@/types/res";
import { RequestWrapper } from "./RequestWrapper";

export async function GetSuperAdminDashboard(): Promise<
  ApiResponse<SuperAdminDashboardDTO>
> {
  const res = await RequestWrapper<SuperAdminDashboardDTO>(
    "GET",
    `superadmin/get-dashboard`,
    {}
  );

  return res;
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
