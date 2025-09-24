import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { ApiResponse, QueryObject, TaxCategory } from "@/types/models";
import { GetToken } from "./User";

export async function GetAllTaxCategories(
  query?: QueryObject
): Promise<ApiResponse<TaxCategory[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<TaxCategory[]>>(
    `tax/get-all?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}
