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

export async function GetPosTerminalSessions(
  query?: QueryObject
): Promise<ApiResponse<PosSession[]>> {
  let a: ApiResponse<PosSession[]> = {
    data: [],
    success: true,
    errors: undefined,
    statusCode: 200,
    timestamp: Date.now().toLocaleString(),
  };
  return a;
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<PosSession[]>>(
    `pos-terminal/get-one?uuid=`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function GetPosTerminalSales(
  query?: QueryObject
): Promise<ApiResponse<Sale[]>> {
  let a: ApiResponse<Sale[]> = {
    data: [],
    success: true,
    errors: undefined,
    statusCode: 200,
    timestamp: Date.now().toLocaleString(),
  };
  return a;
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<Sale[]>>(
    `pos-terminal/get-one?uuid=`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
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
