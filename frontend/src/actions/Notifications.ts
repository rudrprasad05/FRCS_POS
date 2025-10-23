import { axiosGlobal } from "@/lib/axios";
import {
  ApiResponse,
  Notification as AppNotification,
  QueryObject,
} from "@/types/models";
import { RequestWrapper } from "./RequestWrapper";
import { GetToken } from "./User";

// export async function GetAllNotificationsSuperAdmin(
//   query?: QueryObject
// ): Promise<ApiResponse<AppNotification[]>> {
//   return RequestWrapper<AppNotification[]>(
//     "GET",
//     `notification/get-all-superadmin`,
//     {
//       query,
//     }
//   );
// }

export async function GetAllNotifications(
  query?: QueryObject
): Promise<ApiResponse<AppNotification[]>> {
  return RequestWrapper<AppNotification[]>("GET", `notification/get`, {
    query,
  });
}

export async function GetAllNotificationsSuperadmin(
  query?: QueryObject
): Promise<ApiResponse<AppNotification[]>> {
  return RequestWrapper<AppNotification[]>(
    "GET",
    `notification/get-superadmin`,
    {
      query,
    }
  );
}
export async function GetAllNotificationsAdmin(
  query?: QueryObject
): Promise<ApiResponse<AppNotification[]>> {
  return RequestWrapper<AppNotification[]>("GET", `notification/get-admin`, {
    query,
  });
}
export async function GetAllNotificationsCashier(
  query?: QueryObject
): Promise<ApiResponse<AppNotification[]>> {
  return RequestWrapper<AppNotification[]>("GET", `notification/get-cashier`, {
    query,
  });
}

export async function MarkAsRead(
  query?: QueryObject
): Promise<ApiResponse<AppNotification>> {
  return RequestWrapper<AppNotification>("POST", `notification/read`, {
    query,
  });
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
