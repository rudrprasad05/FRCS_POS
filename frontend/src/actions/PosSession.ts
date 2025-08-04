"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, PosSession, PosTerminal } from "@/types/models";
import { ICreateNewPosSession } from "@/types/res";

import { GetToken } from "./User";

export async function CreateNewPosSession(
  data: ICreateNewPosSession
): Promise<ApiResponse<PosSession>> {
  const token = await GetToken();

  const res = await axiosGlobal.post<ApiResponse<PosSession>>(
    `pos-session/create`,
    {
      data,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
