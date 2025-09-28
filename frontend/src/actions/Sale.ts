import { ApiResponse, QueryObject, Sale } from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";

export async function GetSaleByUUID(uuid: string): Promise<ApiResponse<Sale>> {
  return RequestWrapper<Sale>("GET", `sale/get-by-uuid`, { query: { uuid } });
}

export async function GetSaleByCompany(
  query: QueryObject
): Promise<ApiResponse<Sale[]>> {
  return RequestWrapper<Sale[]>("GET", `sale/get-by-company`, { query });
}

export async function GetSaleByReceipt(
  uuid: string
): Promise<ApiResponse<Sale>> {
  return RequestWrapper<Sale>("GET", `sale/get-by-invoice`, {
    query: { uuid },
  });
}

export async function DownloadRecieptFromServer(
  uuid: string
): Promise<ApiResponse<string>> {
  return RequestWrapper<string>("GET", `checkout/download-receipt`, {
    query: { uuid },
  });
}
