import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  Notification as AppNotification,
  QueryObject,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { GetToken } from "./User";

export async function GetAllNotificationsSuperAdmin(
  query?: QueryObject
): Promise<ApiResponse<AppNotification[]>> {
  return RequestWrapper<AppNotification[]>(
    "GET",
    `notification/get-all-superadmin`,
    {
      query,
    }
  );
}

export async function MarkAsRead(
  uuid?: string
): Promise<ApiResponse<AppNotification>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<AppNotification>>(
    `notification/mark-read?uuid=${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function SafeDeleteNotification(
  uuid?: string
): Promise<ApiResponse<AppNotification>> {
  const token = await GetToken();

  const res = await axiosGlobal.delete<ApiResponse<AppNotification>>(
    `notification/safe-delete?uuid=${uuid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}
