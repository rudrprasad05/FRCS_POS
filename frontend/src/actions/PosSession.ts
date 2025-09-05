"use server";

import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  PosSession,
  PosSessionWithProducts,
  PosTerminal,
  QuickConnect,
  Sale,
} from "@/types/models";
import {
  ICreateNewPosSession,
  IPosSessionData,
  NewCheckoutRequest,
} from "@/types/res";

import { GetToken } from "./User";
import { RequestWrapper } from "./RequestWrapper";

export async function CreateNewPosSession(
  data: ICreateNewPosSession
): Promise<ApiResponse<PosSession>> {
  const token = await GetToken();

  const res = await axiosGlobal.post<ApiResponse<PosSession>>(
    `pos-session/create`,
    {
      ...data,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function ResumeSession(
  data: ICreateNewPosSession,
  uuid: string
): Promise<ApiResponse<PosSession>> {
  return RequestWrapper<PosSession>("POST", `pos-session/resume`, {
    data,
    query: { uuid },
  });
}

export async function GetPosSession(
  uuid: string
): Promise<ApiResponse<PosSessionWithProducts>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<PosSessionWithProducts>>(
    `pos-session/get-session-by-uuid?uuid=${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function GenerateQr(
  uuid: string
): Promise<ApiResponse<QuickConnect>> {
  return RequestWrapper<QuickConnect>("GET", `quickconnect/generate`, {
    query: { uuid },
  });
}

export async function Checkout(
  data: NewCheckoutRequest
): Promise<ApiResponse<Sale>> {
  return RequestWrapper<Sale>("POST", `checkout/create`, { data });
}

export async function ValidateQr(
  uuid: string
): Promise<ApiResponse<QuickConnect>> {
  return RequestWrapper<QuickConnect>("GET", `quickconnect/validate`, {
    query: { uuid },
  });
}
