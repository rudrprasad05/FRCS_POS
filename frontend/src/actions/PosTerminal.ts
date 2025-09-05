"use server";

import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  PosSession,
  PosTerminal,
  QueryObject,
  Sale,
} from "@/types/models";
import { GetToken } from "./User";
import { buildMediaQueryParams } from "@/lib/params";
import { RequestWrapper } from "./RequestWrapper";

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

export async function GetPosTerminalSales(
  query?: QueryObject
): Promise<ApiResponse<Sale[]>> {
  return RequestWrapper<Sale[]>("GET", `pos-terminal/get-sales`, {
    query,
  });
}

export async function GetPosTerminalSessions(
  query?: QueryObject
): Promise<ApiResponse<PosSession[]>> {
  return RequestWrapper<PosSession[]>("GET", `pos-terminal/get-sessions`, {
    query,
  });
}

export async function CreatePosTerminals(
  cName: string
): Promise<ApiResponse<PosTerminal>> {
  const token = await GetToken();

  const res = await axiosGlobal.post<ApiResponse<PosTerminal>>(
    `pos-terminal/create`,
    {
      companyName: cName,
    },
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
