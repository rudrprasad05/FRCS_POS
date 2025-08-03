"use server";

import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";
import { ApiResponse, PosTerminal } from "@/types/models";
import axios from "axios";
import { redirect } from "next/navigation";
import { GetToken } from "./User";
import { SuperAdminDashboardDTO } from "@/types/res";

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
