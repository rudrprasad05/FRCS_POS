import { ApiResponse, QueryObject } from "@/types/models";
import { MonthlySalesReportDto, MonthlyTaxReportDto } from "@/types/res";
import { RequestWrapper } from "./RequestWrapper";

export async function GetSalesLast12Months(
  query?: QueryObject
): Promise<ApiResponse<MonthlySalesReportDto[]>> {
  return RequestWrapper<MonthlySalesReportDto[]>(
    "GET",
    "reports/sales-last-12-months",
    { query }
  );
}

export async function GetTaxDueLast12Months(
  query?: QueryObject
): Promise<ApiResponse<MonthlyTaxReportDto[]>> {
  return RequestWrapper<MonthlyTaxReportDto[]>(
    "GET",
    "reports/tax-due-last-12-months",
    { query }
  );
}
