"use server";

import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, PosTerminal } from "@/types/models";
import { GetToken } from "./User";

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
