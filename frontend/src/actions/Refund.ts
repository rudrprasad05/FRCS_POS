import { ApiResponse, QueryObject, RefundRequest, Sale } from "@/types/models";
import { StartRefundRequest } from "@/types/res";
import { RequestWrapper } from "./RequestWrapper";

export async function StartRefund(
  data: StartRefundRequest
): Promise<ApiResponse<Sale>> {
  return RequestWrapper<Sale>("POST", `refunds`, { data });
}

export async function GetRefundByUUID(
  query: QueryObject
): Promise<ApiResponse<RefundRequest>> {
  return RequestWrapper<RefundRequest>("GET", `refunds/get-by-uuid`, { query });
}

export async function GetSaleByCompany(
  query: QueryObject
): Promise<ApiResponse<Sale[]>> {
  return RequestWrapper<Sale[]>("GET", `sale/get-by-company`, { query });
}
