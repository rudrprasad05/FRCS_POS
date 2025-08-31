import {
  ApiResponse,
  ApiResponseFail,
  Company,
  QueryObject,
  Sale,
} from "@/types/models";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { NewCompanyFormType } from "@/components/superadmin/companies/NewCompanyDialoge";
import { RequestWrapper } from "./RequestWrapper";

export async function GetSaleByUUID(uuid: string): Promise<ApiResponse<Sale>> {
  return RequestWrapper<Sale>("GET", `sale/get-by-uuid`, { query: { uuid } });
}
