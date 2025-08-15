"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, PosTerminal, QueryObject } from "@/types/models";
import { GetToken } from "./User";
import { buildMediaQueryParams } from "@/lib/params";

export async function GetPosTerminalById(
  id: string
): Promise<ApiResponse<PosTerminal>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<PosTerminal>>(
    `pos-terminal/get-one?uuid=${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function GetAllCompanyPosTerminals(
  query?: QueryObject,
  companyName?: string
): Promise<ApiResponse<PosTerminal[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<PosTerminal[]>>(
    `pos-terminal/get-all/${companyName}?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}
