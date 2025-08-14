import { ApiResponse, QueryObject } from "@/types/models";
import { GetToken } from "./User";
import { axiosGlobal } from "@/lib/axios";
import { buildMediaQueryParams } from "@/lib/params";

export async function GetAllNotificationsSuperAdmin(
  query?: QueryObject
): Promise<ApiResponse<Notification[]>> {
  const token = await GetToken();
  const params = buildMediaQueryParams(query);

  const res = await axiosGlobal.get<ApiResponse<Notification[]>>(
    `notification/get-all-superadmin?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function MarkAsRead(
  uuid?: string
): Promise<ApiResponse<Notification>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<Notification>>(
    `notification/mark-read?uuid=${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function SafeDeleteNotification(
  uuid?: string
): Promise<ApiResponse<Notification>> {
  const token = await GetToken();

  const res = await axiosGlobal.delete<ApiResponse<Notification>>(
    `notification/safe-delete?uuid=${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}
