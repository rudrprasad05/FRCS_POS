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
import { EditTerminalData } from "@/components/company/pos/view/EditTab";
import { uuid } from "zod";

export async function GetPosTerminalById(
  uuid: string
): Promise<ApiResponse<PosTerminal>> {
  return RequestWrapper<PosTerminal>("GET", `pos-terminal/get-one`, {
    query: { uuid },
  });
}

export async function GetPosTerminalSales(
  query?: QueryObject
): Promise<ApiResponse<Sale[]>> {
  return RequestWrapper<Sale[]>("GET", `pos-terminal/get-sales`, {
    query,
  });
}

export async function EditTerminal(
  data: EditTerminalData,
  uuid: string
): Promise<ApiResponse<PosTerminal>> {
  return RequestWrapper<PosTerminal>("PATCH", `pos-terminal/edit`, {
    query: { uuid },
    data: data,
  });
}

export async function SoftDeleteTerminal(
  query?: QueryObject
): Promise<ApiResponse<PosTerminal>> {
  return RequestWrapper<PosTerminal>("DELETE", `pos-terminal/soft-delete`, {
    query,
  });
}
export async function ActivateTerminal(
  query?: QueryObject
): Promise<ApiResponse<PosTerminal>> {
  return RequestWrapper<PosTerminal>("DELETE", `pos-terminal/activate`, {
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
  query?: QueryObject
): Promise<ApiResponse<PosTerminal[]>> {
  return RequestWrapper<PosTerminal[]>("GET", `pos-terminal/get-all`, {
    query,
  });
}
