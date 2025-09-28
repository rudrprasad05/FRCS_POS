"use server";

import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  PosSession,
  PosSessionWithProducts,
  QuickConnect,
  Sale,
} from "@/types/models";
import { ICreateNewPosSession, NewCheckoutRequest } from "@/types/res";

import axios from "axios";
import { RequestWrapper } from "./RequestWrapper";
import { GetToken } from "./User";

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
  try {
    const res = await axios.get<ApiResponse<QuickConnect>>(
      `https://192.168.1.184:5081/api/quickconnect/validate`,
      {
        params: { uuid }, // axios automatically serializes query params
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("ValidateQr error:", error);
    return {
      data: {},
      success: false,
      statusCode: error?.response?.status || 400,
      errors: error?.response?.data?.errors ?? ["Request failed"],
      timestamp: Date.now.toString(),
    } as ApiResponse<QuickConnect>;
  }
}

// https://192.168.1.184:5081
